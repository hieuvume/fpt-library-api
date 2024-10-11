import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BorrowRecord, BorrowRecordDocument } from 'schemas/borrow-record.schema';

@Injectable()
export class BorrowRecordService {
  constructor(@InjectModel(BorrowRecord.name) private borrowRecordModel: Model<BorrowRecordDocument>) {}

  async findAll(): Promise<BorrowRecord[]> {
    return this.borrowRecordModel.find().exec();
  }

  async create(data: any): Promise<BorrowRecord> {
    const newBorrowRecord = new this.borrowRecordModel(data);
    return newBorrowRecord.save();
  }

  async findById(id: string): Promise<BorrowRecord> {
    return this.borrowRecordModel.findById(id).exec();
  }
}