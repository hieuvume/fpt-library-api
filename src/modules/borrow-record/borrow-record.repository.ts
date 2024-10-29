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
  ) { }

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

  async findBestBookTitleOfTheMonth(subMonth: number) {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() - subMonth, 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() - subMonth + 1, 0);

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
    isReturned: boolean = true,
  ): Promise<BorrowRecord | null> {
    return this.borrowRecordModel.findOne({
      user: new mongoose.Types.ObjectId(userId),
      book: new mongoose.Types.ObjectId(bookId),
      is_returned: isReturned,
    }).exec();
  }
  async createBorrowRecord(userId: string, bookId: string, bookTitleId: string): Promise<BorrowRecord> {
    const newBorrowRecord = new this.borrowRecordModel({
      user: new Types.ObjectId(userId),
      book: new Types.ObjectId(bookId),
      book_title: new Types.ObjectId(bookTitleId),
      borrow_date: new Date(),
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      is_returned: false,
      return_date: new Date(),
      status: 'pending',
    });
    return newBorrowRecord.save();

  }
  async userHasBorrowedBookTitle(userId: string, bookTitleId: string): Promise<boolean> {
    const existingRecord = await this.borrowRecordModel.findOne({
      user: new Types.ObjectId(userId),
      book_title: new Types.ObjectId(bookTitleId),
      is_returned: false,
    }).exec();
    return !!existingRecord;
  }
  async findEarliestFreeTime(bookTitleId: string): Promise<Date | null> {
    const result = await this.borrowRecordModel.aggregate([
      {
        $match: {
          book_title: new Types.ObjectId(bookTitleId),
          is_returned: false,
        },
      },
      {
        $group: {
          _id: null,
          earliestDueDate: { $min: '$due_date' },
        },
      },
    ]);
    return result.length > 0 ? result[0].earliestDueDate : null;
  }
  async countActiveOrders(bookTitleId: string): Promise<number> {
    return this.borrowRecordModel.countDocuments({
      book_title: new Types.ObjectId(bookTitleId),
      status: 'pending',
      is_returned: false,
    }).exec();
  }
  async findAllLoans(page: number, limit: number): Promise<any> {
    const options = {
      page,
      limit,
      sort: { borrowDate: -1 },
      populate: [
        {
          path: 'user',
          select: ['full_name', 'email'],
        },
        {
          path: 'book',
          select: ['uniqueId', ],
        },
        {
          path: 'book_title',
          select: ['title', 'author', 'cover_image'],

        },
      ],
    };

    return this.borrowRecordModel.paginate({
      status: 'pending',
      is_returned: false,
    }, options);
  }
  
}
