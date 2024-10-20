import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Query } from '@nestjs/common';

@Controller('dashboard/books')
export class BookDashboardController {
    constructor(private readonly bookService: BookService) {}

    @Get('')
    async list(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
        const data = await this.bookService.getBooks({ page, limit });
        return {
            books: data.books || [],  // Default to empty array
            totalBooks: data.totalBooks || 0,  // Default to 0
            currentPage: page,
            totalPages: Math.ceil(data.totalBooks / limit),
        };
    }
    

    @Post('')
    async store(@Body() book: CreateBookDto) {
        return this.bookService.create(book); // Create a new book
    }

    @Get(':id')
    async show(@Param('id') id: string) {
        return this.bookService.findById(id); // Find book by ID
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() book: UpdateBookDto) {
        return this.bookService.update(id, book); // Update book by ID
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.bookService.delete(id); // Delete book by ID
    }
    
}
