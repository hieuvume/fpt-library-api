import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Feedback, FeedbackDocument } from './feedback.schema';
import { CreateFeedbackDto } from './dto/feedback.dto';

@Injectable()
export class FeedbackRepository {
  constructor(@InjectModel(Feedback.name) private feedbackModel: Model<FeedbackDocument>) {}

  async findAll(): Promise<Feedback[]> {
    return this.feedbackModel.find().exec();
  }

  async create(data: any): Promise<Feedback> {
    const newFeedback = new this.feedbackModel(data);
    return newFeedback.save();
  }

  async findById(id: string): Promise<Feedback> {
    return this.feedbackModel.findById(id).exec();
  }

  async findFeedbacksByBookTitleId(bookTitleId: string): Promise<Feedback[]> {
    return this.feedbackModel.find({ bookTitle: bookTitleId }).exec();
  }

  async createFeedback(userId: string, bookTitleId: string, feedbackDto: CreateFeedbackDto): Promise<Feedback> {
    const feedback = new this.feedbackModel({
      ...feedbackDto,           // Bao gồm rating từ feedbackDto
      user: userId,
      book_title: bookTitleId,
      created_at: new Date(),
      updated_at:new Date(),
    });
    return feedback.save();
  }
}