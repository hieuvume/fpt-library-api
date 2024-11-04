import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { PaginateModel, Types } from "mongoose";
import { BorrowRecord, BorrowRecordDocument } from "./borrow-record.schema";

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
        status: {
          $in: ["pending", "holding", "borrowing"],
        },
      })
      .populate("book_title")
      .limit(5)
      .exec();
  }

  async findAllByUserId(userId: string, query) {
    const { page, limit, sort, order, ...rest } = query;
    const sortRecord: Record<string, any> = {};
    sortRecord[sort] = order === "asc" ? 1 : -1;

    return this.borrowRecordModel.paginate(
      {
        user: new Types.ObjectId(userId),
      },
      {
        page,
        limit,
        populate: [
          {
            path: "book_title",
            select: "_id title author cover_image",
            populate: [
              {
                path: "books",
                model: "Book",
                select: "floor position section shelf status",
              },
            ],
          },
          {
            path: "book",
            select: "_id uniqueId floor position section shelf status",
          },
        ],
        sort: sortRecord,
      }
    );
  }

  async create(data: any) {
    const newBorrowRecord = new this.borrowRecordModel(data);
    return newBorrowRecord.save();
  }

  async findById(id: string) {
    return this.borrowRecordModel.findById(id).populate("book").exec();
  }

  async findBestBookTitleOfTheMonth(subMonth: number) {
    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth() - subMonth - 3,
      1
    );
    const endOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth() - subMonth + 1,
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
            _id: "$book_info._id", // Bỏ _id mặc định
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
    isReturned: boolean = true
  ): Promise<BorrowRecord | null> {
    return this.borrowRecordModel
      .findOne({
        user: new mongoose.Types.ObjectId(userId),
        book: new mongoose.Types.ObjectId(bookId),
        is_returned: isReturned,
      })
      .exec();
  }

  async findBorrowingByUser(userId: string, bookTitleId: string) {
    return this.borrowRecordModel
      .findOne({
        user: new mongoose.Types.ObjectId(userId),
        book_title: new mongoose.Types.ObjectId(bookTitleId),
        status: { $in: ["pending", "holding", "borrowing"] },
      })
      .exec();
  }

  async countBorrowingByUser(userId: string) {
    return this.borrowRecordModel
      .countDocuments({
        user: new mongoose.Types.ObjectId(userId),
        status: {
          $in: ["pending", "holding", "borrowing"],
        },
      })
      .exec();
  }

  async countReserveByUser(userId: string) {
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
      .countDocuments({
        user: new mongoose.Types.ObjectId(userId),
        status: {
          $in: ["pending", "holding", "borrowing", "returned", "losted"],
        },
        borrow_date: {
          $gte: startOfMonth,
          $lte: endOfMonth,
        },
      })
      .exec();
  }

  async cancelBorrow(id: string) {
    return this.borrowRecordModel.findByIdAndUpdate(
      id,
      {
        status: "canceled",
      },
      { new: true }
    );
  }
}
