import { Injectable } from "@nestjs/common";
import { Seeder, DataFactory } from "nestjs-seeder";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";
import { User } from "./user.schema";
import * as bcrypt from "bcryptjs";
import { Role } from "modules/role/role.schema";
import { faker, fakerVI } from "@faker-js/faker";
import { MembershipCard } from "modules/membership-card/membership-card.schema";
import { Membership } from "modules/membership/membership.schema";

@Injectable()
export class UserSeeder implements Seeder {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
    @InjectModel(MembershipCard.name)
    private readonly membershipCardModel: Model<MembershipCard>,
    @InjectModel(Membership.name)
    private readonly membershipModel: Model<Membership>
  ) {}

  async seed(): Promise<any> {
    const userRole = await this.roleModel.findOne({ role_name: "USER" });
    const ownerRole = await this.roleModel.findOne({ role_name: "OWNER" });
    const adminRole = await this.roleModel.findOne({ role_name: "ADMIN" });
    const librarianRole = await this.roleModel.findOne({
      role_name: "LIBRARIAN",
    });

    const initUsers = [
      this.initUser("admin@readora.me", "Admin", adminRole._id),
      this.initUser("owner@readora.me", "Owner", ownerRole._id),
      this.initUser("librarian@readora.me", "Librarian", librarianRole._id),
    ];

    const users = DataFactory.createForClass(User).generate(100);
    users.map((user) => {
      user.role = userRole._id;
    });

    await this.userModel.insertMany([...users, ...initUsers]);
  }

  initUser(email: string, fullName: string, roleId: ObjectId) {
    return {
      email: email,
      password: bcrypt.hashSync("123123", 10),
      date_of_birth: faker.date.past(),
      full_name: fullName,
      phone_number: "0123456789",
      role: roleId,
      avatar_url: fakerVI.image.avatar(),
    };
  }

  async drop(): Promise<any> {
    return this.userModel.deleteMany({});
  }
}
