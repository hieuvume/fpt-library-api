import { BadRequestException, Injectable } from '@nestjs/common';
import { BorrowRecordRepository } from './borrow-record.repository';
import { BorrowRecordDto } from './dto/borrow-record.dto'; // Import the DTO
import { th } from '@faker-js/faker';

@Injectable()
export class BorrowRecordService {
  constructor(private readonly borrowRecordRepository: BorrowRecordRepository) {}

  async findAll(userId: string, page: number = 1, limit: number = 10): Promise<BorrowRecordDto[]> {
    const records = await this.borrowRecordRepository.findAllByUserId(userId, page, limit);
    
    if (!records || records.length === 0) {
      throw new BadRequestException('No records found');
    }

    return records.map(record => ({
      borrowDate: record.borrow_date,
      dueDate: record.due_date,
      returnDate: record.return_date,
      isReturned: record.is_returned,
      penalty: record.penatly_total,
      book: {
        title: record.book.book_title.title,
        author: record.book.book_title.author,
        categories: record.book.book_title.categories.map(category => category.title),
        memberships: record.book.book_title.memberships.map(membership => ({
          name: membership.name,
          priceMonthly: membership.price_monthly,
          priceYearly: membership.price_yearly,
        })),
        section: record.book.section,
        shelf: record.book.shelf,
        floor: record.book.floor,
        position: record.book.position,
      }
    }));
  }
}
