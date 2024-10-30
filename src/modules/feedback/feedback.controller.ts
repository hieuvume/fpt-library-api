import { Controller, Get, Post, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { AuthGuard } from 'modules/auth/guards/auth.guard';
import { FeedbackGuard } from './guards/feedbackGuard';
import { CreateFeedbackDto } from './dto/feedback.dto';

@Controller('feebacks')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) { }
  @Get('/:id')
  async getFeedbacksByBookTitleId(
    @Param('id') id: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ) {
    return this.feedbackService.findFeedbacksByBookTitleId(id, page, pageSize);
  }
  @Post('/comment')
  @UseGuards(AuthGuard, FeedbackGuard)
  async createFeedback(@Req() req, @Body() feedbackDto: CreateFeedbackDto) {
    const userId = req.user._id;  
    const bookTitleId = req.body.book_title_id;  
    const feedback = await this.feedbackService.createFeedback(userId, bookTitleId, feedbackDto);
    
    return {
      message: 'Feedback created successfully',
      feedback,
    };
  }
}