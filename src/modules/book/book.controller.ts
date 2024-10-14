import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { BookService } from './book.service';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get('all')
  async findAllBooks() {
    return this.bookService.findAll();
  }

  @Post('add')
  async addBook(@Body() book) {
    
  }

}