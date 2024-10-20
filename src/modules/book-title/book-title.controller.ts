import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { BookTitleService } from './book-title.service';


// gobal

@Controller('book')
export class BookTitleController {
  constructor(private readonly bookTitleService: BookTitleService) {}

}