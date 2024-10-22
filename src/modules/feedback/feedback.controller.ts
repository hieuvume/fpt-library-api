import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { FeedbackService } from './feedback.service';

@Controller('feebacks')
export class FeedbackController {
  constructor(private readonly membershipController: FeedbackService) {}


}