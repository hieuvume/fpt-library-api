import { Controller, Get, Post, Body, Param, Query } from "@nestjs/common";
import { BookTitleService } from "./book-title.service";

@Controller("book-titles")
export class BookTitleController {
  constructor(private readonly bookTitleService: BookTitleService) {}

  @Get("best-of-the-month")
  async findBestOfTheMonth() {
    return this.bookTitleService.findBestOfTheMonth();
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
  @Post("add")
  async addBook(@Body() book) {}
}
