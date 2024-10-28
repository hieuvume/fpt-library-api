import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MembershipCard, MembershipCardDocument } from './membership-card.schema';

@Injectable()
export class MembershipCardRepository {
  constructor(@InjectModel(MembershipCard.name) private membershipCardModel: Model<MembershipCardDocument>) {}

  async findAll(): Promise<MembershipCard[]> {
    return this.membershipCardModel.find().exec();
  }

  async create(data: any): Promise<MembershipCard> {
    const newMembershipCard = new this.membershipCardModel(data);
    return newMembershipCard.save();
  }

  async findById(id: string): Promise<MembershipCard> {
    return this.membershipCardModel.findById(id).exec();
  }
  async findActiveCardByUserId(userId: string): Promise<MembershipCard | null> {
    return this.membershipCardModel.findOne({
      user_id: new Types.ObjectId(userId),
    }).exec();
  }
}