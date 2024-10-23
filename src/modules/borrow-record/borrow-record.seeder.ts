import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BookTitle } from 'modules/book-title/book-title.schema';
import { Book } from 'modules/book/book.schema';
import { User } from 'modules/user/user.schema';
import { Model } from 'mongoose';
import { DataFactory, Seeder } from 'nestjs-seeder';
import { BorrowRecord } from './borrow-record.schema';

@Injectable()
export class BorrowRecordSeeder implements Seeder {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Book.name) private readonly bookModel: Model<Book>,
    @InjectModel(BookTitle.name) private readonly bookTitleModel: Model<BookTitle>,
    @InjectModel(BorrowRecord.name) private readonly borrowRecordModel: Model<BorrowRecord>,
  ) { }

  async seed(): Promise<any> {
    const records = DataFactory.createForClass(BorrowRecord).generate(100);
    records.forEach(async (record) => {
      const randomLibrarian = librarianUsers[Math.floor(Math.random() * librarianUsers.length)];
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomBook = books[Math.floor(Math.random() * books.length)];
      record.user = randomUser._id;
      record.book = randomBook._id;
      record.book_title = randomBook.book_title._id;
      record.librarian = randomLibrarian._id;
      ///test
    });

    return this.borrowRecordModel.insertMany(records);
  }

  async drop(): Promise<any> {
    return this.borrowRecordModel.deleteMany({});
  }
}
