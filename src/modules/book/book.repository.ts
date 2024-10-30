import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { Book } from './book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { log } from 'console';

export class BookRepository {
  constructor(@InjectModel(Book.name) private readonly bookModel: Model<Book>) { }

  async findAll() {
    return this.bookModel.find().exec();
  }

  async create(book: CreateBookDto) {
    const newBook = new this.bookModel(book);
    return newBook.save();
  }

  async findById(id: string) {
    return this.bookModel.findById({ book_title: new mongoose.Types.ObjectId(id) }).exec();
  }

  async update(id: string, book: UpdateBookDto) {
    return this.bookModel.findByIdAndUpdate(id, book, { new: true }).exec();
  }

  async delete(id: string) {
    return this.bookModel.findByIdAndDelete(id).exec();
  }

  async findBooksByTitleId(bookTitleId: string) {
    return this.bookModel.aggregate([
      {
        $match: {
          book_title: new mongoose.Types.ObjectId(bookTitleId),
        },
      },
      {
        $lookup: {
          from: 'booktitles',
          localField: 'book_title',
          foreignField: '_id',
          as: 'bookTitleInfo',
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'bookTitleInfo.categories',
          foreignField: '_id',
          as: 'categoryDetails',
        },
      },
      { $unwind: '$bookTitleInfo' },
      {
        $group: {
          _id: '$bookTitleInfo._id',
          bookTitleId: { $first: '$bookTitleInfo._id' },
          title: { $first: '$bookTitleInfo.title' },
          description: { $first: '$bookTitleInfo.description' },
          author: { $first: '$bookTitleInfo.author' },
          ISBN: { $first: '$bookTitleInfo.ISBN' },
          price: { $first: '$bookTitleInfo.price' },
          cover_image: { $first: '$bookTitleInfo.cover_image' },
          categories: { $first: '$categoryDetails' },
          copies: {
            $push: {
              id: '$_id',
              uniqueId: '$uniqueId',
              section: '$section',
              shelf: '$shelf',
              floor: '$floor',
              position: '$position',
              status: '$status',
              times_borrowed: '$times_borrowed',
              created_at: '$created_at',
              updated_at: '$updated_at',
            }
          },
          totalCount: { $sum: 1 },
          availableCount: {
            $sum: { $cond: [{ $eq: ['$status', 'available'] }, 1, 0] }
          },
          borrowedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'borrowing'] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          _id: 0,
          bookTitleId: 1,
          title: 1,
          description: 1,
          author: 1,
          ISBN: 1,
          price: 1,
          cover_image: 1,
          categories: 1,
          copies: 1,
          availableCount: 1,
          totalCount: 1,
          borrowedCount: 1,
        },
      },
    ]);
  }
  
  async findBooksByTitleIds(bookTitleId: string) {
    return this.bookModel.find({ book_title: new mongoose.Types.ObjectId(bookTitleId) }).exec();
  }
  async findRandomAvailableCopy(bookTitleId: string): Promise<any | null> {
    const availableCopies = await this.bookModel.aggregate([
      { $match: { book_title: new Types.ObjectId(bookTitleId), status: 'available' } },
      { $sample: { size: 1 } },
    ]);
    
    return availableCopies[0] || null;
  }

  async updateCopyStatus(copyId: Types.ObjectId, status: string) {
    return this.bookModel.updateOne(
      { _id: copyId },
      { $set: { status: status } },
    );
  }
  async UpdateStatusBook(bookId: string, status: string): Promise<Book | null> {
    return this.bookModel.findByIdAndUpdate(
      bookId,
      { status, updated_at: new Date() },
      { new: true },
    ).exec();
  }
}
