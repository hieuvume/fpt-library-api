import { BadRequestException, Injectable } from "@nestjs/common";
import { BorrowRecordRepository } from "modules/borrow-record/borrow-record.repository";
import { BookTitleRepository } from "./book-title.repository";
import { UserRepository } from "modules/user/user.repository";
import { BookRepository } from "modules/book/book.repository";
import { Types } from "mongoose";

@Injectable()
export class BookTitleService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly bookTitleRepository: BookTitleRepository,
    private readonly borrowRecordRepository: BorrowRecordRepository,
    private readonly bookRepository: BookRepository
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

  async getBookDetails(id: string) {
    return this.bookTitleRepository.getBookDetails(id);
  }

  async borrowBook(userId: string, bookTitleId: string) {
    const user = await this.userRepository.getProfile(userId);
    const {
      max_borrow_books_per_time,
      max_reserve_books_per_montly,
      hold_allowed,
    } = user?.current_membership?.membership;
    const bookTitle =
      await this.bookTitleRepository.getBookDetails(bookTitleId);

    // check membership
    const isInclude = bookTitle.memberships.some(
      (membership) =>
        user?.current_membership?.membership?._id?.toString() ===
        membership._id?.toString()
    );
    if (!isInclude) {
      throw new BadRequestException("You are not eligible to borrow this book");
    }

    if (user?.current_membership?.end_date < new Date()) {
      throw new BadRequestException("Your membership has expired");
    }

    // check if user has borrowed this book
    const isBorrowed = await this.borrowRecordRepository.findBorrowingByUser(
      userId,
      bookTitleId
    );
    if (isBorrowed) {
      throw new BadRequestException(
        "You already have a pending or active borrowing request for this book"
      );
    }

    // check if book is available
    const availables =
      await this.bookRepository.findAvailableBooksByTitleId(bookTitleId);
    if (availables.length === 0) {
      throw new BadRequestException("This book is not available for borrowing");
    }

    // check if user has reached the limit max_borrow_books_per_time
    const borrowingCount =
      await this.borrowRecordRepository.countBorrowingByUser(userId);
    if (borrowingCount >= max_borrow_books_per_time) {
      throw new BadRequestException("You have reached the borrowing limit");
    }

    // check if user has reached the limit max_reserve_books_per_montly
    const reserveCount =
      await this.borrowRecordRepository.countReserveByUser(userId);
    if (reserveCount >= max_reserve_books_per_montly) {
      throw new BadRequestException("You have reached the reservation limit");
    }

    // borrow book
    if (hold_allowed) {
      await this.bookRepository.update(availables[0]._id.toString(), {
        status: "borrowed",
      });
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + user?.current_membership?.membership?.max_borrow_days);

    const borrowRecord = await this.borrowRecordRepository.create({
      user: new Types.ObjectId(userId),
      book_title: new Types.ObjectId(bookTitleId),
      book: hold_allowed ? availables[0]._id : null,
      status: hold_allowed ? "holding" : "pending",
      borrow_date: new Date(),
      due_date: dueDate
    });

    return borrowRecord;
  }
  async getAll(query  :Record<string, any>) {
    return this.bookTitleRepository.getAll(query);
  }
}
