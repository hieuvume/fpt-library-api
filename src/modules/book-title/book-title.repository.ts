import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import {
  BookTitle,
  BookTitleDocument,
} from "modules/book-title/book-title.schema";
import mongoose, { ObjectId, PaginateModel, PaginateResult, Types } from "mongoose";

@Injectable()
export class BookTitleRepository {
  constructor(
    @InjectModel(BookTitle.name)
    private bookTitleModel: PaginateModel<BookTitleDocument>
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


  async searchByKeyword(keyword: string, page: number, limit: number) {
    const searchRegex = new RegExp(keyword, "i");
    return this.bookTitleModel.paginate(
      {
        $or: [
          { title: { $regex: searchRegex } },
          { description: { $regex: searchRegex } },
          { author: { $regex: searchRegex } },
        ],
      },
      {
        page,
        limit,
        populate: [{ path: "categories" }],
      }
    );
  }

  async findFeedbacksByTitleId(bookTitleId: string, page: number = 1, pageSize: number = 10) {
    return this.bookTitleModel.paginate(
      { _id: bookTitleId },
      {
        page,
        limit: pageSize,
        populate: {
          path: 'feedbacks',
          populate: {
            path: 'user',
            select: '_id full_name avatar_url',
          },
        },
        select: '-_id feedbacks',
      },
    );
  }

  async addFeedbackToBookTitle(bookTitleId: string, feedbackId: string): Promise<BookTitle> {
    const bookTitle = await this.bookTitleModel.findByIdAndUpdate(
      bookTitleId,
      { $addToSet: { feedbacks: new Types.ObjectId(feedbackId) } },
      { new: true },
    );

    if (!bookTitle) {
      throw new NotFoundException('Book title not found');
    }

    return bookTitle;
  }

  async countByMembershipId(membershipId: ObjectId): Promise<number> {
    return this.bookTitleModel.countDocuments({
      memberships: membershipId,
    }).exec();
  }

}
