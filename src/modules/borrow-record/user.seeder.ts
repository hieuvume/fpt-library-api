import { Injectable } from '@nestjs/common';
import { Seeder, DataFactory } from 'nestjs-seeder';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BorrowRecord } from './borrow-record.schema';
import { User } from 'modules/user/user.schema';
import { Book } from 'modules/book/book.schema';
import { BookTitle } from 'modules/book-title/book-title.schema';

@Injectable()
export class BorrowRecordSeeder implements Seeder {
  constructor(
    @InjectModel(BorrowRecord.name) private readonly borrowRecordModel: Model<BorrowRecord>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Book.name) private readonly bookModel: Model<Book>,
    @InjectModel(BookTitle.name) private readonly bookTitleModel: Model<BookTitle>,
  ) {}

  async seed(): Promise<any> {
    const librarians = await this.userModel.find()
      .populate({
        path: 'role',
        match: { role_name: 'LIBRARIAN' } 
      })
      .exec();
    const librarianUsers = librarians.filter((user) => user.role !== null);

    if (!librarianUsers.length) {
      throw new Error('No librarians found, please seed some users with the librarian role first.');
    }
    const users = await this.userModel.find();
    const books = await this.bookModel.find().populate('book_title').exec();
    const records = DataFactory.createForClass(BorrowRecord).generate(100);
    records.forEach(async (record) => {
      const randomLibrarian = librarianUsers[Math.floor(Math.random() * librarianUsers.length)];
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomBook = books[Math.floor(Math.random() * books.length)];
      record.user = randomUser._id;
      record.book = randomBook._id;
      record.book_title = randomBook.book_title._id;
      record.librarian = randomLibrarian._id;
    });

    return this.borrowRecordModel.insertMany(records);
  }

  async drop(): Promise<any> {
    return this.borrowRecordModel.deleteMany({});
  }
}
