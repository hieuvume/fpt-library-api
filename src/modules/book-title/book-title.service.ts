import { Injectable } from '@nestjs/common';
import { BorrowRecordRepository } from 'modules/borrow-record/borrow-record.repository';
import { BookTitleRepository } from './book-title.repository';

@Injectable()
export class BookTitleService {
  constructor(
    private readonly bookTitleRepository: BookTitleRepository,
    private readonly borrowRecordRepository: BorrowRecordRepository
  ) {}

  async findBestOfTheMonth() {
    return this.borrowRecordRepository.findBestBookTitleOfTheMonth();
  }

  async searchByKeyword(keyword: string, page: number, limit: number) {
    return this.bookTitleRepository.searchByKeyword(keyword, page, limit);
  }

}