import { Injectable } from '@nestjs/common';
import { BorrowRecordRepository } from 'modules/borrow-record/borrow-record.repository';
import { BookTitleRepository } from './book-title.repository';

@Injectable()
export class BookTitleService {
  constructor(
    private readonly bookTitleRepository: BookTitleRepository,
    private readonly borrowRecordRepository: BorrowRecordRepository
  ) {}

  async findBestOfTheMonth(subMonth: number) {
    return this.borrowRecordRepository.findBestBookTitleOfTheMonth(subMonth);
  }

  async searchByKeyword(keyword: string, page: number, limit: number) {
    return this.bookTitleRepository.searchByKeyword(keyword, page, limit);
  }

  async getBookById(id: string) {
    return this.bookTitleRepository.findById(id);
  }

}