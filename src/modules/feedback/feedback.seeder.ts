import { Injectable } from '@nestjs/common';
import { Seeder, DataFactory } from 'nestjs-seeder';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Feedback } from './feedback.schema';
import { BookTitle } from 'modules/book-title/book-title.schema';
import { User } from 'modules/user/user.schema';

@Injectable()
export class FeedbackSeeder implements Seeder {
  constructor(
    @InjectModel(Feedback.name) private readonly feedbackModel: Model<Feedback>,
    @InjectModel(BookTitle.name) private readonly bookTitleModel: Model<BookTitle>,
    @InjectModel(User.name) private readonly userModel: Model<User>,

  ) {}

  async seed(): Promise<any> {
    const users = await this.userModel.find();
    const books = await this.bookTitleModel.find();
  
    const records = DataFactory.createForClass(Feedback).generate(books.length);
  
    for (const record of records) {
      // Gán người dùng ngẫu nhiên và sách ngẫu nhiên cho phản hồi
      record.user = users[Math.floor(Math.random() * users.length)];
      record.book_title = books[Math.floor(Math.random() * books.length)]._id;
  
      // Lưu phản hồi trước
      const savedFeedback = await this.feedbackModel.create(record);
  
      // Cập nhật danh sách phản hồi của sách
      await this.bookTitleModel.updateOne(
        { _id: savedFeedback.book_title },  // Tìm cuốn sách bằng ID
        { $push: { feedbacks: savedFeedback._id } }  // Thêm feedback vào mảng feedbacks
      );
    }
  
    return records;
  }

  async drop(): Promise<any> {
    return this.feedbackModel.deleteMany({});
  }
}
