import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { PaginateModel, Types } from 'mongoose';
import { Book } from './book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BookRepository {
  constructor(@InjectModel(Book.name) private readonly bookModel: PaginateModel<Book>) { }

  async findAll(): Promise<Book[]> {
    return this.bookModel.find().exec();
  }

  async findAllPaginate(
    page: number,
    limit: number,
    sortField: string,
    sortOrder: string
  ) {
    const sort: Record<string, any> = {};
    sort[sortField] = sortOrder === "asc" ? 1 : -1;

    return this.bookModel.paginate(
      {
      },
      {
        page,
        limit,
        populate: [{ path: "book_title" }],
        sort,
      }
    );
  }

  async create(book: CreateBookDto): Promise<Book> {
    const newBook = new this.bookModel(book);
    return newBook.save();
  }

  async findById(id: string): Promise<Book | null> {
    return this.bookModel.findById(id).exec();
  }

  async update(id: string, book: UpdateBookDto): Promise<Book | null> {
    return this.bookModel.findByIdAndUpdate(new Types.ObjectId(id), book, { new: true }).exec();
  }

  async delete(id: string): Promise<Book | null> {
    return this.bookModel.findByIdAndDelete(id).exec();
  }

  async findBooksByTitleId(bookTitleId: string) {
    return this.bookModel.aggregate([
      { $match: { book_title: new Types.ObjectId(bookTitleId) } },
      { $lookup: { from: 'booktitles', localField: 'book_title', foreignField: '_id', as: 'bookTitleInfo' } },
      { $lookup: { from: 'categories', localField: 'bookTitleInfo.categories', foreignField: '_id', as: 'categoryDetails' } },
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
            },
          },
          totalCount: { $sum: 1 },
          availableCount: { $sum: { $cond: [{ $eq: ['$status', 'available'] }, 1, 0] } },
          borrowedCount: { $sum: { $cond: [{ $eq: ['$status', 'borrowed'] }, 1, 0] } },
        },
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
    return this.bookModel.find({ book_title: new Types.ObjectId(bookTitleId) }).exec();
  }
  async findByIdWithPopulate(id: string) {
    return this.bookModel.findById(id).populate({
      path: 'book_title',
      select: ['title', 'description', 'brief_content', 'cover_image'],
      populate: [
        {
          path: 'categories',
          select: ['title', 'description'],
        },
        {
          path: 'memberships',
        },
        {
          path: 'feedbacks',
          populate: {
            path: 'user',
            select: ['full_name', 'avatar_url'],
          },
          select: ['content', 'rating'],
        },
      ],
    }).exec();
  }

}

