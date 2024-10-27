import { Injectable } from '@nestjs/common';
import { BorrowRecordRepository } from './borrow-record.repository';

@Injectable()
export class BorrowRecordService {
  constructor(private readonly borrowRecordRepository: BorrowRecordRepository,
    private readonly bookRepository: BookRepository,
  ) { }

  async findHistoriesBook(userId: string, page: number = 1, limit: number = 5, sort: string, order: string): Promise<any> {
    return this.borrowRecordRepository.findAllByUserId(userId, page, limit, sort, order);
  }

  async findCurrentLoans (userId: string): Promise<any> {
    return this.borrowRecordRepository.findCurrentLoans(userId);
  }

  async findBorrowRecordByUserAndBookTitle(
    userId: string,
    bookTitleId: string,
    isReturned: boolean = true,
  ): Promise<BorrowRecord | null> {
    const books = await this.bookRepository.findBooksByTitleIds(bookTitleId);
    const bookIds = books.map(book => book._id.toString());
    for (const bookId of bookIds) {
      const borrowRecord = await this.borrowRecordRepository.findOneByUserAndBook(
        userId,
        bookId,
        isReturned,
      );
      if (borrowRecord) {
        return borrowRecord; 
      }
    }
    return null;
  }

}
