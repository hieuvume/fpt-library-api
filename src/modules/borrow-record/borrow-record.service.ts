import { Injectable } from '@nestjs/common';
import { BorrowRecordRepository } from './borrow-record.repository';

@Injectable()
export class BorrowRecordService {
  constructor(private readonly borrowRecordRepository: BorrowRecordRepository) {}

  async findHistoriesBook(userId: string, page: number = 1, limit: number = 5, sort: string, order: string): Promise<any> {
    return this.borrowRecordRepository.findAllByUserId(userId, page, limit, sort, order);
  }

  async findCurrentLoans (userId: string): Promise<any> {
    return this.borrowRecordRepository.findCurrentLoans(userId);
  }
  
}
