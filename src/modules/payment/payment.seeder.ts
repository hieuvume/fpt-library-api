import { Injectable } from "@nestjs/common";
import { DataFactory, Seeder } from "nestjs-seeder";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { randomUUID } from "crypto";
import { Role } from "modules/role/role.schema";
import { MembershipCard } from "modules/membership-card/membership-card.schema";
import { Membership } from "modules/membership/membership.schema";
import { User } from "modules/user/user.schema";
import { Payment } from "./payment.schema";

@Injectable()
export class PaymentSeeder implements Seeder {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(MembershipCard.name) private readonly membershipCardModel: Model<MembershipCard>,
    @InjectModel(Payment.name) private readonly paymentModel: Model<Payment>,
    @InjectModel(Membership.name) private readonly membershipModel: Model<Membership>,
  ) { }

  async seed(): Promise<any> {
    const users = await this.userModel.find({});
    const membershipCards = await this.membershipCardModel.find({});
    const memberships = await this.membershipModel.find({});
    
    const payments = DataFactory.createForClass(Payment).generate(2000).map((payment) => {
      payment.user = users[Math.floor(Math.random() * users.length)]._id;
      payment.membership = memberships[Math.floor(Math.random() * memberships.length)]._id;
      payment.membership_card = membershipCards[Math.floor(Math.random() * membershipCards.length)]._id;
      return payment;
    });

    return this.paymentModel.insertMany(payments);
  }

  async drop(): Promise<any> {
    return this.paymentModel.deleteMany({});
  }
}
