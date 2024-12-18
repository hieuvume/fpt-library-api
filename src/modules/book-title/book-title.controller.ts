import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { BookTitleService } from "./book-title.service";
import { AuthGuard } from "modules/auth/guards/auth.guard";

@Controller("book-titles")
export class BookTitleController {
  constructor(private readonly bookTitleService: BookTitleService) {}

  @Get("best-of-the-month")
  async findBestOfTheMonth(@Req() req) {
    const subMonth = req.query.subMonth || 0;
    return this.bookTitleService.findBestOfTheMonth(subMonth);
  }

  @Get("search")
  async search(
    @Query("keyword") keyword,
    @Query("page") page,
    @Query("limit") limit
  ) {
    return this.bookTitleService.searchByKeyword(keyword, page, limit);
  }

  @Get(":id")
  async getBookById(@Param("id") id) {
    return this.bookTitleService.getBookById(id);
  }

  @Get(":id/details")
  async getBookDetails(@Param("id") id) {
    return this.bookTitleService.getBookDetails(id);
  }

  @UseGuards(AuthGuard)
  @Post(":id/borrow")
  async borrowBook(@Req() req, @Param("id") id) {
    return this.bookTitleService.borrowBook(req.user.id, id);
  }

  @Post("add")
  async addBook(@Body() book) {}
}
