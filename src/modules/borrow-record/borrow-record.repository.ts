import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model, PaginateModel, Types } from "mongoose";
import { BorrowRecord, BorrowRecordDocument } from "./borrow-record.schema";
import { type } from "os";
import { populate } from "dotenv";
import path from "path";

@Injectable()
export class BorrowRecordRepository {
  constructor(
    @InjectModel(BorrowRecord.name)
    private borrowRecordModel: PaginateModel<BorrowRecordDocument>
  ) {}

  async findAll(): Promise<BorrowRecord[]> {
    return this.borrowRecordModel.find().exec();
  }

  async findCurrentLoans(userId: string) {
    return this.borrowRecordModel
      .find({
        user: new Types.ObjectId(userId),
        status: "approved",
      })
      .populate("book_title")
      .exec();
  }

  async findAllByUserId(
    userId: string,
    page: number,
    limit: number,
    sortField: string,
    sortOrder: string
  ) {
    const sort: Record<string, any> = {};
    sort[sortField] = sortOrder === "asc" ? 1 : -1;

    return this.borrowRecordModel.paginate(
      {
        user: new Types.ObjectId(userId),
      },
      {
        page,
        limit,
        populate: [{ path: "book_title" }],
        sort,
      }
    );
  }

  async create(data: any): Promise<BorrowRecord> {
    const newBorrowRecord = new this.borrowRecordModel(data);
    return newBorrowRecord.save();
  }

  async findById(id: string): Promise<BorrowRecord> {
    return this.borrowRecordModel.findById(id).exec();
  }

  async findBestBookTitleOfTheMonth() {
    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );
    const endOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      0
    );
    return this.borrowRecordModel
      .aggregate([
        {
          $match: {

            borrow_date: { $gte: startOfMonth, $lte: endOfMonth },
          },
        },
        {
          $group: {

            _id: "$book_title",
            totalBorrows: { $sum: 1 },
          },
        },
        {
          $sort: { totalBorrows: -1 },
        },
        {
 
          $limit: 15,
        },
        {
      
          $lookup: {
            from: "booktitles",
            localField: "_id", 
            foreignField: "_id", 
            as: "book_info", 
          },
        },
        {

          $unwind: "$book_info",
        },
        {

          $project: {
            _id: 1, // Bỏ _id mặc định
            book_title_name: "$book_info.title", 
            author: "$book_info.author",
            cover_image: "$book_info.cover_image", 
            totalBorrows: 1, 
          },
        },
      ])
      .exec();
  }
  async findOneByUserAndBook(
    userId: string,
    bookId: string,
    isReturned: boolean = true,
  ): Promise<BorrowRecord | null> {
    return this.borrowRecordModel.findOne({
      user: new mongoose.Types.ObjectId(userId),
      book: new mongoose.Types.ObjectId(bookId),
      is_returned: isReturned,
    }).exec();
  }
}
