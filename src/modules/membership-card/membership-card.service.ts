import { ForbiddenException, Injectable } from "@nestjs/common";
import { MembershipCardRepository } from "./membership-card.repository";
import { MembershipCard } from "./membership-card.schema";
import { MembershipRepository } from "modules/membership/membership.repository";
import { randomUUID } from "crypto";
import { ObjectId, Types } from "mongoose";
import { User } from "modules/user/user.schema";
import { UserRepository } from "modules/user/user.repository";

@Injectable()
export class MembershipCardService {
  constructor(
    private readonly membershipCardRepository: MembershipCardRepository,
    private readonly membershipRepository: MembershipRepository,
    private readonly userRepository: UserRepository
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
    return this.membershipCardRepository.create({
      card_number: randomUUID(),
      user: userId,
      membership: defaultMembership._id,
      start_date: new Date(),
      status: "active",
      price: 0,
    });
  }

  async downgradeMembership(userId: string, membershipId: string) {
    const currUser = await this.userRepository.getProfile(userId);
    const newPlan = await this.membershipRepository.findById(membershipId);
    const currentMembership = currUser.current_membership;

    if (!currentMembership) {
      throw new ForbiddenException("You do not have an active membership.");
    }

    if (currentMembership.membership.toString() === membershipId.toString()) {
      throw new ForbiddenException(
        "You are already subscribed to this membership."
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
      user: userId,
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
