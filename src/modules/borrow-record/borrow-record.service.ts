import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BorrowRecordRepository } from './borrow-record.repository';

@Injectable()
export class BorrowRecordService {
  constructor(private readonly borrowRecordRepository: BorrowRecordRepository) {}
}