import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Membership, MembershipDocument } from './membership.schema';
import mongoose, { PaginateModel, Types } from "mongoose";
@Injectable()
export class MembershipRepository {
  constructor(@InjectModel(Membership.name)
   private membershipModel: PaginateModel<MembershipDocument>
  ) {}

  async findAll() {
    return this.membershipModel.find().exec();
  }
  async getMembership(
    query: Record<string, any>
  ){
    const { page, limit, sort, order, ...rest } = query;  
    const sortRecord: Record<string, any> = {};
    sortRecord[sort] = order === "asc" ? 1 : -1;
    return this.membershipModel.paginate(
      {},
      {
        page,
        limit,
        sort: sortRecord,
      }
    );
  }

  async create(data: any): Promise<Membership> {
    const newMembership = new this.membershipModel(data);
    return newMembership.save();
  }

  async findById(id: string): Promise<Membership> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException("Invalid book title id");
    }
    return this.membershipModel.findById(id).exec();
  }

  async findDefaultMembership(): Promise<Membership> {
    return this.membershipModel.findOne().exec();
  }

  async update(id: string, data: any): Promise<Membership> {
    return this.membershipModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }
  async getAll() {
    return this.membershipModel.find().exec();
  }

}