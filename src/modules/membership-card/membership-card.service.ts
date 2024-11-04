import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { MembershipCardRepository } from "./membership-card.repository";
import { MembershipCard } from "./membership-card.schema";
import { MembershipRepository } from "modules/membership/membership.repository";
import { randomUUID } from "crypto";
import { ObjectId, Types } from "mongoose";
import { User } from "modules/user/user.schema";
import { UserRepository } from "modules/user/user.repository";
import { UpgradePlanDto } from "./dto/upgrade-plan.dto";
import { PaymentRepository } from "modules/payment/payment.repository";
import { PaymentService } from "modules/payment/payment.service";

@Injectable()
export class MembershipCardService {
  constructor(
    private readonly membershipCardRepository: MembershipCardRepository,
    private readonly membershipRepository: MembershipRepository,
    private readonly userRepository: UserRepository,
    private readonly paymentRepository: PaymentRepository
  ) {}

  async validateUserMembership(userId: string): Promise<MembershipCard> {
    const activeCard = await this.membershipCardRepository.findByUserId(userId);

    if (!activeCard) {
      throw new ForbiddenException(
        "You need an active membership to borrow books."
      );
    }

    if (activeCard.end_date < new Date()) {
      throw new ForbiddenException(
        "Your membership has expired. Please renew your membership to borrow books."
      );
    }

    if (activeCard.status !== "active") {
      throw new ForbiddenException(
        "Your membership card is not active. Please activate it to borrow books."
      );
    }

    return activeCard;
  }

  async initMembershipCard(userId: ObjectId): Promise<MembershipCard> {
    const defaultMembership =
      await this.membershipRepository.findDefaultMembership();

    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    return this.membershipCardRepository.create({
      card_number: randomUUID(),
      user: userId,
      membership: defaultMembership._id,
      start_date: new Date(),
      end_date: nextMonth,
      status: "active",
      billing_cycle: "monthly",
      price: 0,
    });
  }

  async downgradeMembership(userId: string, membershipId: string) {
    const currUser = await this.userRepository.getProfile(userId);
    const newPlan = await this.membershipRepository.findById(membershipId);
    const currentMembership = currUser.current_membership;

    if (!currentMembership) {
      throw new BadRequestException("You do not have an active membership.");
    }

    if (currentMembership.membership.toString() === membershipId.toString()) {
      throw new BadRequestException(
        "You are already subscribed to this membership."
      );
    }

    if (currentMembership.end_date < new Date()) {
      throw new BadRequestException(
        "Your current membership has already expired."
      );
    }

    if (currentMembership.status !== "active") {
      throw new BadRequestException(
        "Your current membership card is not active."
      );
    }

    if (newPlan.price_monthly === 0) {
      throw new BadRequestException(
        "You cannot downgrade to a free membership plan."
      );
    }

    const remainingAmount = this.getRemainingAmount(currentMembership);
    const newPlanPricePerDay = (newPlan?.price_monthly || 0) / 30;
    const daysCanPurchase = Math.floor(remainingAmount / newPlanPricePerDay);
    const newPlanEndDate = new Date();
    newPlanEndDate.setDate(newPlanEndDate.getDate() + daysCanPurchase);

    await this.membershipCardRepository.update(
      currentMembership._id.toString(),
      {
        status: "inactive",
      }
    );

    const newMembershipCard = await this.membershipCardRepository.create({
      card_number: randomUUID(),
      user: new Types.ObjectId(userId),
      membership: newPlan,
      start_date: new Date(),
      end_date: newPlanEndDate,
      status: "active",
      billing_cycle: "monthly",
      price: newPlan.price_monthly,
    });

    await this.userRepository.updateCurrentMembership(
      userId,
      newMembershipCard
    );

    return newMembershipCard;
  }

  async upgradeMembership(userId: string, data: UpgradePlanDto) {
    const { membershipId, months, payment_method } = data;

    // Retrieve current user and new membership details
    const currUser = await this.userRepository.getProfile(userId);
    const newPlan = await this.membershipRepository.findById(membershipId);
    const currentMembership = currUser.current_membership;

    if (!newPlan) {
      throw new BadRequestException(
        "The selected membership plan does not exist."
      );
    }

    if (
      currentMembership &&
      currentMembership.membership.toString() === membershipId.toString()
    ) {
      throw new BadRequestException(
        "You are already subscribed to this membership."
      );
    }

    const isExist = await this.paymentRepository.isExistPendingPayment(userId);
    if (isExist) {
      throw new BadRequestException(
        "You have an ongoing upgrade payment, if changes are needed, please cancel the previous payment"
      );
    }

    // Calculate the remaining amount of the current membership
    const today = new Date();
    const remainingAmount = this.getRemainingAmount(currentMembership);
    const pricePerMonth =
      months < 12 ? newPlan.price_monthly : newPlan.price_yearly;
    const totalAmount = pricePerMonth * months;
    const discount = newPlan.price_monthly * months - pricePerMonth * months;
    const finalAmount = totalAmount - discount - remainingAmount;

    // create new payment
    const payment = await this.paymentRepository.create({
      user: new Types.ObjectId(userId),
      transaction_id: PaymentService.getRandomTransactionId(),
      amount: finalAmount,
      payment_method: payment_method,
      months: months,
      membership: newPlan,
      payment_type: "upgrade",
      payment_status: "pending",
      details: `Upgrade to ${newPlan.name}`,
      created_at: new Date(),
    });

    return payment;
  }

  getRemainingDays(currentMembership: MembershipCard): number {
    const endDate = new Date(currentMembership?.end_date);
    const today = new Date();
    const remainingDays = Math.max(
      0,
      Math.round((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    );
    return remainingDays;
  }

  getRemainingAmount(currentMembership: MembershipCard): number {
    const { membership } = currentMembership;
    const remainingDays = this.getRemainingDays(currentMembership);
    const isMonthly = currentMembership?.billing_cycle === "monthly";
    const currentPrice = isMonthly
      ? membership?.price_monthly
      : membership?.price_yearly;
    const pricePerDay = currentPrice / 30;
    const remainingAmount = pricePerDay * remainingDays;
    return remainingAmount;
  }
}
