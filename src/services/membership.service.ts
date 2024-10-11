import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Membership, MembershipDocument } from 'schemas/membership.schema';

@Injectable()
export class MembershipService {
  constructor(@InjectModel(Membership.name) private membershipModel: Model<MembershipDocument>) {}

  async findAll(): Promise<Membership[]> {
    return this.membershipModel.find().exec();
  }

  async create(data: any): Promise<Membership> {
    const newMembership = new this.membershipModel(data);
    return newMembership.save();
  }

  async findById(id: string): Promise<Membership> {
    return this.membershipModel.findById(id).exec();
  }
}