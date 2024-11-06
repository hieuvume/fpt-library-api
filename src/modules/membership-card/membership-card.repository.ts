import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId, Types } from "mongoose";
import {
  MembershipCard,
  MembershipCardDocument,
} from "./membership-card.schema";

@Injectable()
export class MembershipCardRepository {
  constructor(
    @InjectModel(MembershipCard.name)
    private membershipCardModel: Model<MembershipCardDocument>
  ) { }

  async findAll(): Promise<MembershipCard[]> {
    return this.membershipCardModel.find().exec();
  }

  async update(id: string, data: any): Promise<MembershipCard> {
    return this.membershipCardModel.findByIdAndUpdate(id, data, { new: true });
  }

  async create(data: any): Promise<MembershipCard> {
    const newMembershipCard = new this.membershipCardModel(data);
    return newMembershipCard.save();
  }

  async findById(id: string): Promise<MembershipCard> {
    return this.membershipCardModel.findById(id).exec();
  }

  async findByUserId(userId: string): Promise<MembershipCard | null> {
    return this.membershipCardModel
      .findOne({
        user_id: new Types.ObjectId(userId),
      })
      .populate("membership")
      .exec();
  }

  async delete(id: string) {
    return this.membershipCardModel.findByIdAndDelete(id).exec();
  }


  async getMembershipStatistics() {
    const membershipStats = await this.membershipCardModel.aggregate([
      {
        $group: {
          _id: {
            membership: '$membership',
            billing_cycle: '$billing_cycle'
          },
          count: { $sum: 1 } 
        }
      },
      {
        $lookup: {
          from: 'memberships',              
          localField: '_id.membership',     
          foreignField: '_id',              
          as: 'membership_info'             
        }
      },
      {
        $unwind: '$membership_info'       
      },
      {
        $project: {
          _id: 0,
          membership: '$membership_info.name',
          billing_cycle: '$_id.billing_cycle',
          count: 1
        }
      }
    ]);
    const total_count = membershipStats.reduce((acc, item) => acc + item.count, 0);
    return {
      total_count,
      membershipStats
    };
  }
  
}
