import { Injectable } from "@nestjs/common";
import { Seeder } from "nestjs-seeder";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { randomUUID } from "crypto";
import { Role } from "modules/role/role.schema";
import { MembershipCard } from "modules/membership-card/membership-card.schema";
import { Membership } from "modules/membership/membership.schema";
import { User } from "modules/user/user.schema";

@Injectable()
export class MembershipCardSeeder implements Seeder {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(MembershipCard.name) private readonly membershipCardModel: Model<MembershipCard>,
    @InjectModel(Membership.name) private readonly membershipModel: Model<Membership>
  ) {}

  async seed(): Promise<any> {
    const users = await this.userModel.find({});
    const defaultMembership = await this.membershipModel.find();

    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    for (const user of users) {
      const randomMembership = defaultMembership[Math.floor(Math.random() * defaultMembership.length)];
      const card = new this.membershipCardModel({
        user: user._id,
        membership: randomMembership._id,
        card_number: randomUUID(),
        start_date: new Date(),
        end_date: nextMonth,
        billing_cycle: "monthly",
        price: 0,
        status: "active",
        created_at: new Date()
      });

      await card.save();
      await this.userModel.updateOne({ _id: user._id }, { current_membership: card._id });
    }
  }

  async drop(): Promise<any> {
    return this.membershipCardModel.deleteMany({});
  }
}
