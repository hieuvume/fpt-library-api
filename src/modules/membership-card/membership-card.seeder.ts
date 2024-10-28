import { Injectable } from "@nestjs/common";
import { Seeder, DataFactory } from "nestjs-seeder";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from "bcryptjs";
import { Role } from "modules/role/role.schema";
import { faker } from "@faker-js/faker";
import { MembershipCard } from "modules/membership-card/membership-card.schema";
import { Membership } from "modules/membership/membership.schema";
import { User } from "modules/user/user.schema";
import { randomUUID } from "crypto";

@Injectable()
export class MembershipCardSeeder implements Seeder {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(MembershipCard.name) private readonly membershipCardModel: Model<MembershipCard>,
    @InjectModel(Membership.name) private readonly membershipModel: Model<Membership>
  ) {}

  async seed(): Promise<any> {
    const users = await this.userModel.find({});
    const defaultMembership = await this.membershipModel.findOne({});

    const cards = []
    users.map((user) => {
      cards.push({
        user: user._id,
        membership: defaultMembership._id,
        card_number: randomUUID(),
        start_date: new Date(),
        price: 0,
        status: "active",
        created_at: new Date()
      })
    });

    return this.membershipCardModel.insertMany(cards);
  }

  async drop(): Promise<any> {
    return this.membershipCardModel.deleteMany({});
  }
}
