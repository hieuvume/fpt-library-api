import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book, BookDocument } from './book.schema';

@Injectable()
export class BookRepository {
  constructor(@InjectModel(Book.name) private bookModel: Model<BookDocument>) {}

  async findAll(): Promise<Book[]> {
    return this.bookModel.find().exec();
  }

  async create(data: any): Promise<Book> {
    const newBook = new this.bookModel(data);
    return newBook.save();
  }

  async findById(id: string): Promise<Book> {
    return this.bookModel.findById(id).exec();
  }
}