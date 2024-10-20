import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BookTitle, BookTitleDocument } from 'modules/book-title/book-title.schema';
import { BorrowRecord, BorrowRecordDocument } from 'modules/borrow-record/borrow-record.schema';

@Injectable()
export class BookTitleRepository {
  constructor(
    @InjectModel(BookTitle.name) private bookTitleModel: Model<BookTitleDocument>,
  ) { }

  async findAll(): Promise<BookTitle[]> {
    return this.bookTitleModel.find().exec();
  }

  async create(data: any): Promise<BookTitle> {
    const newBookTitle = new this.bookTitleModel(data);
    return newBookTitle.save();
  }

  async findById(id: string): Promise<BookTitle> {
    return this.bookTitleModel.findById(id).exec();
  }

}