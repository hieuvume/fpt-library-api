import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { BorrowRecordRepository } from './borrow-record.repository';
import { BorrowRecord } from './borrow-record.schema';
import { BookRepository } from 'modules/book/book.repository';
import { MembershipCardRepository } from 'modules/membership-card/membership-card.repository';
import { MembershipRepository } from 'modules/membership/membership.repository';

@Injectable()
export class BorrowRecordService {
  constructor(private readonly borrowRecordRepository: BorrowRecordRepository,
    private readonly bookRepository: BookRepository,
    private readonly membershipCardRepository: MembershipCardRepository,
    private readonly membershipRepository: MembershipRepository,

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

  async findAllLoans(page: number, limit: number) {
    return this.borrowRecordRepository.findAllLoans(page, limit);
  }
  async updateStatusBook(borrowId: string, bookId: string, borrowStatus: string, bookStatus: string,userId: string,requestUserId: string) {
    const activeCard = await this.membershipCardRepository.findByUserId(userId);
 
    const membershipRules = await this.membershipRepository.findmembershipById(activeCard.membership._id);
    if (!membershipRules) {
      throw new ForbiddenException("Invalid membership card type.");
    }
    const validStatuses = ['pending', 'holding', 'borrowing', 'returned', 'lost', 'rejected'];
    if (!validStatuses.includes(borrowStatus)) {
      throw new BadRequestException('Invalid borrow record status.');
    }
    const borrowRecord = await this.borrowRecordRepository.UpdateStatusBook(borrowId, borrowStatus,membershipRules.max_borrow_days,requestUserId);
    if (!borrowRecord) {
      throw new NotFoundException('Borrow record not found.');
    }
    const book = await this.bookRepository.UpdateStatusBook(bookId, bookStatus);
    if (!book) {
      throw new NotFoundException('Book not found.');
    }
    

    return {
      borrowRecordStatus: borrowRecord,
      bookStatus: book,
    };
  }
  async findById(id: string) {
    return this.borrowRecordRepository.findBorrowRecordByID(id);
  }
}
