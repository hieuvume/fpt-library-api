import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import {
  BookTitle,
  BookTitleDocument,
} from "modules/book-title/book-title.schema";
import { CategoryRepository } from "modules/category/category.repository";
import { Category } from "modules/category/category.schema";
import mongoose, {
  ObjectId,
  PaginateModel,
  PaginateResult,
  Types,
} from "mongoose";

@Injectable()
export class BookTitleRepository {
  constructor(
    @InjectModel(BookTitle.name)
    private bookTitleModel: PaginateModel<BookTitleDocument>,
    private categoryRepository: CategoryRepository
  ) {}

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

  async searchByKeyword(keyword: string, page: number, limit: number) {
    const searchRegex = new RegExp(keyword, "i");

    const matchedCategories = await this.categoryRepository.find({
      title: { $regex: searchRegex },
    });
    const categoryIds = matchedCategories.map((category) => category._id);

    return this.bookTitleModel.paginate(
      {
        $or: [
          { title: { $regex: searchRegex } },
          { description: { $regex: searchRegex } },
          { author: { $regex: searchRegex } },
          { "categories.title": { $regex: searchRegex } },
          { categories: { $in: categoryIds } },
        ],
      },
      {
        page,
        limit,
        populate: [{ path: "categories" }, { path: "memberships" }],
      }
    );
  }

  async getBookDetails(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException("Invalid book title id");
    }
    const bookTitle = await this.bookTitleModel
      .findById(id)
      .populate("categories")
      .populate("memberships")
      .populate([
        {
          path: "books",
          model: "Book",
        },
        {
          path: "feedbacks",
          populate: [
            {
              path: "user",
              select: "_id full_name avatar_url",
            },
          ],
        },
      ])
      .exec();
    if (!bookTitle) {
      throw new NotFoundException("Book title not found");
    }
    return bookTitle;
  }

  async findFeedbacksByTitleId(
    bookTitleId: string,
    page: number = 1,
    pageSize: number = 10
  ) {
    return this.bookTitleModel.paginate(
      { _id: bookTitleId },
      {
        page,
        limit: pageSize,
        populate: {
          path: "feedbacks",
          populate: {
            path: "user",
            select: "_id full_name avatar_url",
          },
        },
        select: "-_id feedbacks",
      }
    );
  }

  async addFeedbackToBookTitle(
    bookTitleId: string,
    feedbackId: string
  ): Promise<BookTitle> {
    const bookTitle = await this.bookTitleModel.findByIdAndUpdate(
      bookTitleId,
      { $addToSet: { feedbacks: new Types.ObjectId(feedbackId) } },
      { new: true }
    );

    if (!bookTitle) {
      throw new NotFoundException("Book title not found");
    }

    return bookTitle;
  }

  async countByMembershipId(membershipId: ObjectId): Promise<number> {
    return this.bookTitleModel
      .countDocuments({
        memberships: membershipId,
      })
      .exec();
  }

}
