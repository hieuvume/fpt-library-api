import { Injectable } from '@nestjs/common';
import { Seeder, DataFactory } from 'nestjs-seeder';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book } from './book.schema';
import { BookFactory } from './book.factory';
import { BookTitle } from 'modules/book-title/book-title.schema';

@Injectable()
export class BookSeeder implements Seeder {
  constructor(
    @InjectModel(Book.name) private readonly bookModel: Model<Book>,
    @InjectModel(BookTitle.name) private readonly bookTitleModel: Model<BookTitle>,
  ) {}

  async seed(): Promise<any> {
    const bookTitles = await this.bookTitleModel.find();

    // Tạo 10 Book giả và liên kết với BookTitle
    const books = DataFactory.createForClass(Book).generate(100).map((book) => {
      book.book_title = bookTitles[Math.floor(Math.random() * bookTitles.length)]._id;
      return book;
    });

    // Lưu dữ liệu vào DB
    return this.bookModel.insertMany(books);
  }

  async drop(): Promise<any> {
    // Xóa dữ liệu hiện có trước khi seed
    return this.bookModel.deleteMany({});
  }
}
