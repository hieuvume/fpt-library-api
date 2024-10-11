import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MembershipCard, MembershipCardDocument } from 'schemas/membership-card.schema';

@Injectable()
export class MembershipCardService {
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
}