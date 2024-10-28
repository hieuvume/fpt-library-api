import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { BookTitleService } from './book-title.service';

@Controller('book-titles')
export class BookTitleController {
    constructor(private readonly bookService: BookTitleService) { }

    @Get('best-of-the-month')
    async findBestOfTheMonth(@Req() req) {
        // sleep
        await new Promise(resolve => setTimeout(resolve, 1000));
        const subMonth = req.query.subMonth || 0;
        return this.bookService.findBestOfTheMonth(subMonth);
    }

    @Post('add')
    async addBook(@Body() book) {

    }

}