import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BorrowRecord, BorrowRecordDocument } from './borrow-record.schema';
import { type } from 'os';
import { populate } from 'dotenv';
import path from 'path';

@Injectable()
export class BorrowRecordRepository {
  constructor(@InjectModel(BorrowRecord.name) private borrowRecordModel: Model<BorrowRecordDocument>) { }

  async findAll(): Promise<BorrowRecord[]> {
    return this.borrowRecordModel.find().exec();
  }
  async findAllByUserId(userId: string, page: number, limit: number): Promise<BorrowRecord[]> {
    const skip = (page - 1) * limit; 

    return this.borrowRecordModel
      .find({ user: new Types.ObjectId(userId) })
      .skip(skip) 
      .limit(limit) 
      .populate({
        path: 'book',
        populate: {
          path: 'book_title',
          populate: [
            { path: 'categories' },
            { path: 'memberships' },
          ],
        },
      })
      .exec();
  }
  async create(data: any): Promise<BorrowRecord> {
    const newBorrowRecord = new this.borrowRecordModel(data);
    return newBorrowRecord.save();
  }

  async findById(id: string): Promise<BorrowRecord> {
    return this.borrowRecordModel.findById(id).exec();
  }
}