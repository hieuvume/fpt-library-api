import { BadRequestException, Injectable } from '@nestjs/common';
import { BorrowRecordRepository } from './borrow-record.repository';
import { BorrowRecordDto } from './dto/borrow-record.dto'; // Import the DTO
import { th } from '@faker-js/faker';
import { BorrowRecord } from './borrow-record.schema';
import { BookRepository } from 'modules/book/book.repository';

@Injectable()
export class BorrowRecordService {
  constructor(private readonly borrowRecordRepository: BorrowRecordRepository,
    private readonly bookRepository: BookRepository,
  ) { }

  async findHistoriesBook(userId: string, page: number = 1, limit: number = 5): Promise<any> {
    const totalRecords = await this.borrowRecordRepository.countByUserId(userId);

    const totalPages = Math.ceil(totalRecords / limit);
    const records = await this.borrowRecordRepository.findAllByUserId(userId, page, limit);

    if (!records || records.length === 0) {
      throw new BadRequestException('No records found');
    }
    return {
      data: records.map(record => ({
        borrowDate: record.borrow_date,
        dueDate: record.due_date,
        returnDate: record.return_date,
        isReturned: record.is_returned,
        penalty: record.penatly_total,
        book: {
          title: record.book.book_title.title,
          author: record.book.book_title.author,
          description: record.book.book_title.description,
          categories: record.book.book_title.categories.map(category => category.title),
          memberships: record.book.book_title.memberships.map(membership => ({
            name: membership.name,
            priceMonthly: membership.price_monthly,
            priceYearly: membership.price_yearly,
          })),
          librarian: {
            name: record.librarian.full_name,
            email: record.librarian.email,
            phone: record.librarian.phone_number,
            address: record.librarian.address,
            avatar: record.librarian.avatar_url,
          },
          section: record.book.section,
          shelf: record.book.shelf,
          floor: record.book.floor,
          position: record.book.position,
        }
      })),
      totalPages,
      currentPage: page,
    };
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
