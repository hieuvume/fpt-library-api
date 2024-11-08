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
    borrowStatus: string,
    bookStatus: string,
    userId: string,
    requestUserId: string
  ) {
    const user = await this.userRepository.getProfile(userId);
    const borrowRecord = await this.borrowRecordRepository.UpdateStatusBook(
      borrowId,
      borrowStatus,
      user?.current_membership?.membership?.max_borrow_days,
      requestUserId
    );
    if (!borrowRecord) {
      throw new NotFoundException("Borrow record not found.");
    }
    const book = await this.bookRepository.UpdateStatusBook(bookId, bookStatus);
    if (!book) {
      throw new NotFoundException("Book not found.");
    }
    return {
      borrowRecordStatus: borrowRecord,
      bookStatus: book,
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

  @Cron(CronExpression.EVERY_HOUR)
  async cancelOverduePendingHoldingRecords() {
    await this.processOverdueRecords();
  }

  async runCancelOverdueRecordsManually() {
    await this.processOverdueRecords();
  }
}
