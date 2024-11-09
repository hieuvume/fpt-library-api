import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { PaginateModel, Types } from "mongoose";
import { Book } from "./book.schema";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";

@Injectable()
export class BookRepository {
  constructor(
    @InjectModel(Book.name) private readonly bookModel: PaginateModel<Book>
  ) {}

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
      {},
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
    return this.bookModel
      .findByIdAndUpdate(new Types.ObjectId(id), book, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Book | null> {
    return this.bookModel.findByIdAndDelete(id).exec();
  }

  async findBooksByTitleIds(bookTitleId: string) {
    return this.bookModel
      .find({ book_title: new Types.ObjectId(bookTitleId) })
      .exec();
  }

  async findByIdWithPopulate(id: string) {
    return this.bookModel
      .findById(id)
      .populate({
        path: "book_title",
        select: ["title", "description", "brief_content", "cover_image"],
        populate: [
          {
            path: "categories",
            select: ["title", "description"],
          },
          {
            path: "memberships",
          },
          {
            path: "feedbacks",
            populate: {
              path: "user",
              select: ["full_name", "avatar_url"],
            },
            select: ["content", "rating"],
          },
        ],
      })
      .exec();
  }

  async findByBookTitleId(bookTitleId: string) {
    return this.bookModel
      .find({ book_title: new Types.ObjectId(bookTitleId) })
      .exec();
  }

  async findAvailableBooksByTitleId(bookTitleId: string) {
    return this.bookModel
      .find({
        book_title: new Types.ObjectId(bookTitleId),
        status: "available",
      })
      .exec();
  }

  async findBookByBookTitle(bookTitleId: string) {
    if (!Types.ObjectId.isValid(bookTitleId)) {
      throw new ForbiddenException("Invalid ID");
    }
    return this.bookModel.find({
      book_title: new Types.ObjectId(bookTitleId),
      status: "available"
    }).exec();
  }
  async updateStatusBook(bookId: string, status: string): Promise<Book | null> {
    return this.bookModel.findByIdAndUpdate(
      bookId,
      { status, updated_at: new Date() },
      { new: true },
    ).exec();
  }
}
