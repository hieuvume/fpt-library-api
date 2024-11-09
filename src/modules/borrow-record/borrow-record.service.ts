import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { BookRepository } from "modules/book/book.repository";
import { UserRepository } from "modules/user/user.repository";
import { BorrowRecordRepository } from "./borrow-record.repository";
import { BorrowRecord } from "./borrow-record.schema";

@Injectable()
export class BorrowRecordService {
  private readonly logger = new Logger(BorrowRecordService.name);

  constructor(
    private readonly borrowRecordRepository: BorrowRecordRepository,
    private readonly bookRepository: BookRepository,
    private readonly userRepository: UserRepository
  ) {}

  async findHistoriesBook(
    userId: string,
    query: Record<string, any>
  ): Promise<any> {
    return this.borrowRecordRepository.findAllByUserId(userId, query);
  }

  async findCurrentLoans(userId: string): Promise<any> {
    return this.borrowRecordRepository.findCurrentLoans(userId);
  }

  async findBorrowRecordByUserAndBookTitle(
    userId: string,
    bookTitleId: string,
    isReturned: boolean = true
  ): Promise<BorrowRecord | null> {
    const books = await this.bookRepository.findBooksByTitleIds(bookTitleId);
    const bookIds = books.map((book) => book._id.toString());
    for (const bookId of bookIds) {
      const borrowRecord =
        await this.borrowRecordRepository.findOneByUserAndBook(
          userId,
          bookId,
          isReturned
        );
      if (borrowRecord) {
        return borrowRecord;
      }
    }
    return null;
  }

  async findById(id: string) {
    return this.borrowRecordRepository.findById(id);
  }

  async cancelBorrow(id: string) {
    const borrowRecord = await this.findById(id);
    if (!borrowRecord) {
      throw new NotFoundException("Borrow record not found");
    }
    if (
      borrowRecord.status !== "pending" &&
      borrowRecord.status !== "holding"
    ) {
      throw new NotFoundException("Cannot cancel borrow record");
    }
    if (borrowRecord.book) {
      await this.bookRepository.update(borrowRecord.book._id.toString(), {
        status: "available",
      });
    }

    return this.borrowRecordRepository.cancelBorrow(id);
  }
  async findAllLoans(query: Record<string, any>) {
    return this.borrowRecordRepository.findAllLoans(query);
  }
  async getOverviewStatistics() {
    return this.borrowRecordRepository.getOverviewStatistics();
  }
  async getStatusStatistics() {
    return this.borrowRecordRepository.getStatusStatistics();
  }
  async findBorrowRecordByID(id: string) {
    return this.borrowRecordRepository.findBorrowRecordByID(id);
  }
  async findBookByBookTitle(bookTitleId: string) {
    return this.bookRepository.findBookByBookTitle(bookTitleId);
  }
  async updateStatusBook(
    borrowId: string,
    bookId: string,
    beforeStatus: string,
    userId: string,
    librarianId: string
  ) {
    const user = await this.userRepository.getProfile(userId);
    const book = await this.bookRepository.findById(bookId);

    if (!book) {
      throw new NotFoundException("Book not found.");
    }

    const borrowRecord = await this.borrowRecordRepository.updateStatusBook(
      borrowId,
      user?.current_membership?.membership?.max_borrow_days,
      librarianId,
      beforeStatus,
      book
    );

    if (!borrowRecord) {
      throw new NotFoundException("Borrow record not found.");
    }
    if (borrowRecord.book) {
      const book = await this.bookRepository.updateStatusBook(borrowRecord._id.toString(), 'borrowed');
    } else {
      const book = await this.bookRepository.updateStatusBook(bookId, 'borrowed');
      if (!book) {
        throw new NotFoundException("Book not found.");
      }
    }
    return {
      borrowRecordStatus: borrowRecord,
    };
  }

  async processOverdueRecords() {
    const now = new Date();
    const cutoffTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Lấy danh sách các bản ghi mượn có trạng thái "pending" hoặc "holding" và đã quá 24 giờ
    const overdueRecords =
      await this.borrowRecordRepository.findOverduePendingOrHolding(cutoffTime);

    for (const record of overdueRecords) {
      // Cập nhật trạng thái của BorrowRecord thành "canceled"
      await this.borrowRecordRepository.updateStatus(
        record._id.toString(),
        "canceled"
      );

      // Nếu BorrowRecord có liên kết với một cuốn sách, cập nhật trạng thái của Book thành "available"
      if (record.book) {
        await this.bookRepository.update(record.book.toString(), {
          status: "available",
        });
      }
    }

    if (overdueRecords.length > 0) {
      this.logger.log(
        `Canceled ${overdueRecords.length} overdue borrow records and updated book status.`
      );
    }
  }

  async rejectBorrow(borrowId: string, note: string, librarianId: string) {
    const borrowRecord = await this.borrowRecordRepository.findBorrowRecordByID(borrowId)
    if (!borrowRecord) {
      throw new NotFoundException("Borrow record not found.");
    }

    if (borrowRecord.book) {
      const book = await this.bookRepository.updateStatusBook(borrowRecord.book._id.toString(), 'available');
    }
    
    borrowRecord.note = note;
    borrowRecord.status = 'rejected';
    await borrowRecord.save();
  
    return borrowRecord
  }

  async returnedBorrow(borrowId: string, afterStatus: string) {
    const borrowRecord = await this.borrowRecordRepository.findBorrowRecordByID(borrowId)
    if (!borrowRecord) {
      throw new NotFoundException("Borrow record not found.");
    }

    const book = await this.bookRepository.updateStatusBook(borrowRecord.book._id.toString(), 'available');
    
    borrowRecord.after_status = afterStatus;
    borrowRecord.status = 'returned';
    await borrowRecord.save();
  
    return borrowRecord
  }

  async lostedBorrow(boorowId: string, penaltyTotal: number) {
    const borrowRecord = await this.borrowRecordRepository.findBorrowRecordByID(boorowId)
    if (!borrowRecord) {
      throw new NotFoundException("Borrow record not found.");
    }

    const book = await this.bookRepository.updateStatusBook(borrowRecord.book._id.toString(), 'losted');
    
    borrowRecord.penatly_total = penaltyTotal;
    borrowRecord.status = 'losted';
    await borrowRecord.save();
  
    return borrowRecord
  }

  @Cron(CronExpression.EVERY_HOUR)
  async cancelOverduePendingHoldingRecords() {
    await this.processOverdueRecords();
  }

  async runCancelOverdueRecordsManually() {
    await this.processOverdueRecords();
  }
}
