import { BadRequestException, Injectable } from '@nestjs/common';
import { PaymentRepository } from './payment.repository';
import { randomUUID } from 'crypto';
import { MembershipCardRepository } from 'modules/membership-card/membership-card.repository';
import { UserRepository } from 'modules/user/user.repository';

@Injectable()
export class PaymentService {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly membershipCardRepository: MembershipCardRepository,
    private readonly userRepository: UserRepository,
  ) { }

  async createPayment(userId: string, method: string, type: string, amount: number, details: string = "") {
    const data = {
      user: userId,
      transaction_id: PaymentService.getRandomTransactionId(),
      amount: amount,
      payment_method: method,
      payment_type: type,
      payment_status: "pending",
      details: details,
      created_at: new Date(),
    }
    return this.paymentRepository.create(data);
  }

  async finishPayment(paymentId: string) {
    const payment = await this.paymentRepository.findById(paymentId);
    if (payment.payment_status !== "pending") {
      throw new BadRequestException("Payment already completed or failed");
    }
    payment.payment_status = "completed";
    payment.payment_date = new Date();
    return payment.save();
  }

  async failPayment(paymentId: string) {
    const payment = await this.paymentRepository.findById(paymentId);
    if (payment.payment_status !== "pending") {
      throw new BadRequestException("Payment already completed or failed");
    }
    payment.payment_status = "failed";
    return payment.save();
  }

  async getPaymentById(paymentId: string) {
    return this.paymentRepository.findById(paymentId);
  }

  async getPaymentByTransactionId(transactionId: string) {
    return this.paymentRepository.findByTransactionId(transactionId);
  }

  async getPaymentsByUserId(userId: string, page: number = 1, limit: number = 5, sort: string, order: string): Promise<any> {
    return this.paymentRepository.getPaymentsByUserId(userId, page, limit, sort, order);
  }

  async getPayments(page: number = 1, limit: number = 5, sort: string, order: string): Promise<any> {
    return this.paymentRepository.getPayments(page, limit, sort, order);
  }

  // for dashboard
  async approvePayment(paymentId: string) {
    const payment = await this.paymentRepository.findById(paymentId);
    if (!payment) {
      throw new BadRequestException("Payment not found");
    }
    if (payment.payment_status !== "pending") {
      throw new BadRequestException("Payment already completed or failed");
    }
    payment.payment_status = "completed";
    payment.payment_date = new Date();

    const today = new Date();
    const newPlanEndDate = new Date(today.setDate(today.getDate() + payment.months * 30));

    const payer = await this.userRepository.findUserById(payment.user._id.toString());

    await this.membershipCardRepository.update(
      payer.current_membership._id.toString(),
      {
        status: "inactive",
      }
    );

    const newMembershipCard = await this.membershipCardRepository.create({
      card_number: randomUUID(),
      user: payer,
      membership: payment.membership,
      start_date: new Date(),
      end_date: newPlanEndDate,
      status: "active",
      billing_cycle: payment.months >= 12 ? "annual" : "monthly",
      price: payment.amount,
    });

    await this.userRepository.updateCurrentMembership(
      payment.user._id.toString(),
      newMembershipCard
    );
    
    payment.from = payer.current_membership
    payment.to = newMembershipCard

    return payment.save();
  }

  async rejectPayment(paymentId: string) {
    const payment = await this.paymentRepository.findById(paymentId);
    if (payment.payment_status !== "pending") {
      throw new BadRequestException("Payment already completed or failed");
    }
    payment.payment_status = "failed";
    return payment.save();
  }

  async rollbackPayment(paymentId: string) {
    const payment = await this.paymentRepository.findById(paymentId);
    if (payment.payment_status !== "completed") {
      throw new BadRequestException("Payment not completed yet");
    }
    
    const payer = await this.userRepository.findUserById(payment.user._id.toString());
    if (payer.current_membership && payer.current_membership._id.toString() !== payment.to._id.toString()) {
      throw new BadRequestException("Cannot rollback because the user has upgraded to a different membership");
    }

    payment.payment_status = "pending";
    payment.payment_date = null;

    await this.userRepository.updateCurrentMembership(
      payment.user._id.toString(),
      payment.from
    );

    await this.membershipCardRepository.delete(payment.to._id.toString());

    payment.from = null;
    payment.to = null;

    return payment.save();
  }

  static getRandomTransactionId(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let transactionId = '';
    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      transactionId += chars[randomIndex];
    }
    return transactionId.toUpperCase();
  }


}