import { Injectable } from '@nestjs/common';
import { BorrowRecordRepository } from './borrow-record.repository';

@Injectable()
export class BorrowRecordService {
  constructor(private readonly borrowRecordRepository: BorrowRecordRepository) {}

}