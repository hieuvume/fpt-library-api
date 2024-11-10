import { Injectable } from "@nestjs/common";
import { BookRepository } from "modules/book/book.repository";
import { BorrowRecordRepository } from "modules/borrow-record/borrow-record.repository";
import { UserRepository } from "modules/user/user.repository";

@Injectable()
export class DashboardService {
  constructor(
    private readonly bookRepository: BookRepository,
    private readonly borrowRecordRepository: BorrowRecordRepository,
    private readonly userRepository: UserRepository
  ) {}

  async getAdminDashboardStats() {
    const totalBooks = await this.getTotalBooks();
    const totalUsers = await this.getTotalUsers();
    const borrowedBooks = await this.getBorrowedBooks();
    const availableBooks = await this.getAvailableBooks();

    return {
      totalBooks,
      totalUsers,
      borrowedBooks,
      availableBooks,
    };
  }

  private async getTotalBooks(): Promise<number> {
    return await this.bookRepository.count();
  }

  private async getTotalUsers(): Promise<number> {
    return await this.userRepository.count();
  }

  private async getBorrowedBooks(): Promise<number> {
    return await this.borrowRecordRepository.count({
      where: { isReturned: false },
    });
  }

  private async getAvailableBooks(): Promise<number> {
    const totalBooks = await this.getTotalBooks();
    const borrowedBooks = await this.getBorrowedBooks();
    return totalBooks - borrowedBooks;
  }

  async getLibrarianDashboardStats() {
    const borrowedBooks = await this.getBorrowedBooks();
    const overdueBooks = await this.getOverdueBooks();
    const waitingBooks = await this.getWaitingBooks();
    const totalReturnedBooks = await this.getTotalReturnedBooks();
    const newBooks = await this.getNewBooks();
    const newUsers = await this.getNewUsers();
    const totalBorrowRecords = await this.getTotalBorrowRecords();
    const returnedBooksThisMonth = await this.getReturnedBooksThisMonth();

    return {
      borrowedBooks,
      overdueBooks,
      waitingBooks,
      totalReturnedBooks,
      newBooks,
      newUsers,
      totalBorrowRecords,
      returnedBooksThisMonth,
      overdueRate: overdueBooks / borrowedBooks,
    };
  }

  private async getOverdueBooks(): Promise<number> {
    const today = new Date();
    return await this.borrowRecordRepository.count({
      where: {
        returnDate: { $lt: today }, // Ngày trả sách đã qua
        isReturned: false,           // Sách chưa được trả
      },
    });
  }

  private async getWaitingBooks(): Promise<number> {
    return await this.borrowRecordRepository.count({
      where: {
        isApproved: false, // Sách đang chờ phê duyệt
        isReturned: false, // Và chưa được trả
      },
    });
  }

  // Tổng số sách đã trả lại
  private async getTotalReturnedBooks(): Promise<number> {
    return await this.borrowRecordRepository.count({ where: { isReturned: true } });
  }

  // Tổng số sách mới thêm vào thư viện
  private async getNewBooks(): Promise<number> {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    return await this.bookRepository.count({ where: { createdAt: { $gte: lastMonth } } });
  }

  // Tổng số người dùng mới đăng ký
  private async getNewUsers(): Promise<number> {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    return await this.userRepository.count({ where: { createdAt: { $gte: lastMonth } } });
  }

  // Tổng số phiếu mượn trong tháng
  private async getTotalBorrowRecords(): Promise<number> {
    const currentMonth = new Date();
    currentMonth.setDate(1); // Đặt ngày 1 của tháng
    return await this.borrowRecordRepository.count({
      where: { borrowDate: { $gte: currentMonth } },
    });
  }

  // Sách trả lại trong tháng này
  private async getReturnedBooksThisMonth(): Promise<number> {
    const currentMonth = new Date();
    currentMonth.setDate(1); // Đặt ngày 1 của tháng
    return await this.borrowRecordRepository.count({
      where: { returnDate: { $gte: currentMonth }, isReturned: true },
    });
  }
  
}
