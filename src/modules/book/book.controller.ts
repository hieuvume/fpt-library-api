import { Controller, Get, Post, Body, Param, UseGuards, Req, NotFoundException } from '@nestjs/common';
import { BookService } from './book.service';
import { AuthGuard } from 'modules/auth/guards/auth.guard';
import { MembershipGuard } from 'modules/membership-card/guards/membership.guard';

// gobal

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) { }

  @Get('all')
  async findAllBooks() {
    return this.bookService.findAll();
  }
  @Get(':id')
  async findBook(@Param('id') id: string) {
    return this.bookService.findById(id);
  }

  @Get('details/:bookTitleId')
  async getBooksByTitleId(@Param('bookTitleId') bookTitleId: string) {
    return await this.bookService.findBooksByTitleId(bookTitleId);
  }
  @Get(':bookTitleId/availability-info')
  async getBookAvailabilityInfo(@Param('bookTitleId') bookTitleId: string) {
    try {
      const { earliestFreeTime, activeOrderCount } = await this.bookService.getBookAvailabilityInfo(bookTitleId);
      return { earliestFreeTime, activeOrderCount };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Book title not found or not currently borrowed.');
      }
      throw error;
    }
  }
  @Post('add')
  async addBook(@Body() book) {

  }
  @UseGuards(AuthGuard, MembershipGuard)
  @Post("borrow")
  async borrowBook(
    @Req() req,
    @Body("bookTitleId") bookTitleId: string,
  ) {
    return this.bookService.borrowBook(req.user.id, bookTitleId);

  }


}