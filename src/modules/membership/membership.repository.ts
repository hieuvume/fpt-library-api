import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";
import { Membership, MembershipDocument } from "./membership.schema";
import { UpdateMemberShipDto } from "./dto/update-membership.dto";
import { CreateMembershipDto } from "./dto/create-membership.dto";

@Injectable()
export class MembershipRepository {
  constructor(
    @InjectModel(Membership.name)
    private membershipModel: Model<MembershipDocument>
  ) {}

  async findAll() {
    return this.membershipModel.find().exec();
  }

  async create(data: any): Promise<Membership> {
    const newMembership = new this.membershipModel(data);
    return newMembership.save();
  }

  async findById(id: string): Promise<Membership> {
    return this.membershipModel.findById(id).exec();
  }

  async findDefaultMembership(): Promise<Membership> {
    return this.membershipModel.findOne().exec();
  }

  //crud with admin

  async paginateMemberships(page: number, pageSize: number): Promise<{memberships: Membership[], totalMemberships: number}> {
    const totalMemberships = await this.membershipModel.countDocuments();
    const startIndex = (page - 1) * pageSize;
    const memberships = await this.membershipModel
    .aggregate([
      { $sort: { created_at: -1 } }, // Sắp xếp theo trường created_at giảm dần
      { $skip: startIndex },
      { $limit: pageSize },
    ])
    .exec();
    return {
      memberships,
      totalMemberships
    }
  }


  async findByName(name: string): Promise<Membership | null> {
    return this.membershipModel.findOne({ name }).exec();
  }

  async createByAdmin(membership: CreateMembershipDto): Promise<Membership> {
    const newMembership = new this.membershipModel(membership);
    return newMembership.save();
  }

  async findByNameContains(name: string): Promise<Membership[]> {
    return this.membershipModel
      .find({ name: { $regex: name, $options: "i" } })
      .exec();
  }

  async update(
    id: string,
    membership: UpdateMemberShipDto
  ): Promise<Membership | null> {
    const updatedMembership = await this.membershipModel
      .findByIdAndUpdate(id, membership, { new: true })
      .exec();

    return updatedMembership;
  }

  async delete(id: string): Promise<Membership | null> {
    return this.membershipModel.findByIdAndDelete(id).exec();
  }
}
