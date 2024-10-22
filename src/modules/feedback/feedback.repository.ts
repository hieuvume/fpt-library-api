import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Feedback, FeedbackDocument } from './feedback.schema';

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
}