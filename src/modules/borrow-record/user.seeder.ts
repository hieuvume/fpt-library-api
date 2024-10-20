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

    const users = await this.userModel.find();
    const books = await this.bookModel.find().populate('book_title');

    records.forEach(async record => {
      record.user = users[Math.floor(Math.random() * users.length)];
      record.book = books[Math.floor(Math.random() * books.length)];
      record.book_title = record.book.book_title;
    });

    return this.borrowRecordModel.insertMany(records);
  }

  async drop(): Promise<any> {
    return this.borrowRecordModel.deleteMany({});
  }
}
