import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { BookTitleService } from './book-title.service';

@Controller('book-title')
export class BookTitleController {
    constructor(private readonly bookService: BookTitleService) { }

    @Get('best-of-the-month')
    async findBestOfTheMonth() {
        
        return this.bookService.findBestOfTheMonth();
    }

    @Post('add')
    async addBook(@Body() book) {

    }

}