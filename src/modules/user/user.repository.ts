import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BookRepository } from "modules/book/book.repository";
import { Role } from "modules/role/role.schema";
import { Model, ObjectId, PaginateModel } from "mongoose";
import { User, UserDocument } from "./user.schema";
import { MembershipCard } from "modules/membership-card/membership-card.schema";

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private userModel: PaginateModel<UserDocument>,
    private readonly bookRepository: BookRepository
  ) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async getProfile(id: string) {
    return this.userModel
      .findById(id)
      .populate([
        { path: "role" },
        { path: "current_membership", populate: { path: "membership" } },
      ])
      .exec();
  }

  async findById(id: string) {
    return this.userModel.findById(id).populate("role");
  }

  async findUserById(id: string) {
    return this.userModel
      .findById(id)
      .populate("role")
      .populate({
        path: "current_membership",
        populate: {
          path: "membership",
        },
      })
      .exec();
  }

  async findOneByEmail(email: string) {
    return this.userModel.findOne({ email }).populate("role");
  }

  async create(data: {
    email: string;
    password: string;
    full_name: string;
    phone_number: string;
    role: Role;
    avatar_url: string
  }) {
    const newUser = new this.userModel(data);
    return newUser.save();
  }

  async updatePassword(id: ObjectId, password: string) {
    return this.userModel.updateOne({ _id: id }, { password }).exec();
  }

  async updateUser(id: string, data: any) {
    return this.userModel.findByIdAndUpdate({ _id: id }, data).exec();
  }

  async updateCurrentMembership(
    userId: string,
    membershipCard: MembershipCard
  ) {
    return this.userModel
      .updateOne({ _id: userId }, { current_membership: membershipCard._id })
      .exec();
  }


  async count(conditions: any = {}) {
    return this.userModel.countDocuments(conditions).exec();
  }
  async findAllUser(query: Record<string, any>) {
    const { page, limit, sort, order, ...rest } = query;
    const sortRecord: Record<string, any> = {};
    sortRecord[sort] = order === "asc" ? 1 : -1;
    return this.userModel.paginate(
      {},
      {
        page,
        limit,
        sort: sortRecord,
        populate:"role"
      }

 ) };
}
