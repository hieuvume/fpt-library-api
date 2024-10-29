import { Controller, Get, Post, Body, Param, Delete, Put, Query, Req } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('dashboard/books') // Ensure this path is correct
export class BookDashboardController {
    constructor(private readonly bookService: BookService) { }

    @Get('')
    async list(
        @Req() req,
        @Query("page") page: number = 1,
        @Query("limit") limit: number = 10,
        @Query("sort") sort: string,
        @Query("order") order: string
      ) {
        return this.bookService.findAllPaginate(
          page,
          limit,
          sort,
          order
        );
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
