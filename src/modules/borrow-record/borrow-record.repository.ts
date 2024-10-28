import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BorrowRecord, BorrowRecordDocument } from './borrow-record.schema';

@Injectable()
export class BorrowRecordRepository {
  constructor(@InjectModel(BorrowRecord.name) private borrowRecordModel: Model<BorrowRecordDocument>) {}

  async findAll(): Promise<BorrowRecord[]> {
    return this.borrowRecordModel.find().exec();
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

    // Truy vấn để tìm sách "Best Of The Month"
    return this.borrowRecordModel.aggregate([
      {
        $match: {
          // Lọc các bản ghi trong tháng hiện tại
          borrow_date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          // Nhóm theo `book_title` (book_title là ObjectId)
          _id: "$book_title",
          total_borrows: { $sum: 1 }, // Đếm số lượt mượn
        },
      },
      {
        // Sắp xếp theo số lần mượn giảm dần
        $sort: { total_borrows: -1 },
      },
      {
        // Lấy 5 cuốn sách được mượn nhiều nhất
        $limit: 15,
      },
      {
        // Sử dụng $lookup để lấy thông tin từ bảng BookTitle
        $lookup: {
          from: "booktitles", // Tên collection của BookTitle trong MongoDB (theo mặc định của Mongoose)
          localField: "_id",  // _id từ bước group (là book_title trong BorrowRecord)
          foreignField: "_id", // So khớp với _id của BookTitle
          as: "book_info", // Kết quả lưu vào trường "book_info"
        },
      },
      {
        // Giải nén thông tin sách (book_info là một mảng do $lookup tạo ra)
        $unwind: "$book_info",
      },
      {
        // Định dạng lại kết quả trả về
        $project: {
          _id: "$book_info._id", // Bỏ _id mặc định
          book_title_name: "$book_info.title", // Lấy tiêu đề sách từ book_info
          author: "$book_info.author", // Lấy tác giả từ book_info
          cover_image: "$book_info.cover_image", // Lấy hình bìa từ book_info
          total_borrows: 1, // Giữ lại tổng số lượt mượn
        },
      },
    ]).exec();
    
    
  }

}