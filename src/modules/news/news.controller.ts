import { Controller, Get, Post, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { NewsService } from './news.service';

@Controller('news')
export class NewsController {
  constructor(private readonly categoryService: NewsService) {}

}