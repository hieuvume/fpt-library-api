import { Injectable } from '@nestjs/common';
import { Seeder, DataFactory } from 'nestjs-seeder';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BookTitle } from './book-title.schema';
import { BookTitleFactory } from './book-title.factory';
import { Category } from 'modules/category/category.schema';

@Injectable()
export class BookTitleSeeder implements Seeder {
  constructor(
    @InjectModel(BookTitle.name) private readonly bookTitleModel: Model<BookTitle>,
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>, // Inject Category Model
  ) {}

  async seed(): Promise<any> {
    // Lấy danh sách Category đã seed trước đó
    const categories = await this.categoryModel.find();

    // Tạo 10 BookTitle giả và liên kết với các Category
    const bookTitles = DataFactory.createForClass(BookTitle).generate(50).map((bookTitle) => {
      bookTitle.categories = categories
        .slice(0, Math.floor(Math.random() * categories.length) + 1)
        .map((category) => category._id);
      return bookTitle;
    });

    // Lưu vào DB
    return this.bookTitleModel.insertMany(bookTitles);
  }

  async drop(): Promise<any> {
    // Xóa dữ liệu hiện có trong bảng BookTitle trước khi seed
    return this.bookTitleModel.deleteMany({});
  }
}
