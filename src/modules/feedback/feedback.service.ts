import { Injectable } from '@nestjs/common';
import { FeedbackRepository } from './feedback.repository';
import { BookTitleRepository } from 'modules/book-title/book-title.repository';
import { CreateFeedbackDto } from './dto/feedback.dto';
import { Feedback } from './feedback.schema';

@Injectable()
export class FeedbackService {
  constructor(
    private readonly feedbackRepository: FeedbackRepository,
    private readonly bookTitleRepository: BookTitleRepository,

  ) {}

  async findFeedbacksByBookTitleId(bookTitleId: string, page: number = 1, pageSize: number = 10) {
    return this.bookTitleRepository.findFeedbacksByTitleId(bookTitleId, page, pageSize);
  }
  async createFeedback(userId: string, bookTitleId: string, feedbackDto: CreateFeedbackDto): Promise<Feedback> {
    const feedback = await this.feedbackRepository.createFeedback(userId, bookTitleId, feedbackDto);
    await this.bookTitleRepository.addFeedbackToBookTitle(bookTitleId, feedback._id.toString());

    return feedback;
  }
}