import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { BookService } from './book.service';

// gobal

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}
  
  @Get('all')
  async findAllBooks() {
    return this.bookService.findAll();
  }
  @Get(':id')
  async findBook(@Param('id') id:string) {
    return this.bookService.findById(id);
  }
  @Post('add')
  async addBook(@Body() book) {
    
  }

}