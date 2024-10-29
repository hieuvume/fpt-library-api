import { Controller, Get, Post, Body, Param, Query, Req } from "@nestjs/common";
import { BookTitleService } from "./book-title.service";

@Controller("book-titles")
export class BookTitleController {
  constructor(private readonly bookTitleService: BookTitleService) {}

    @Get('best-of-the-month')
    async findBestOfTheMonth(@Req() req) {
        // sleep
        await new Promise(resolve => setTimeout(resolve, 1000));
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
  @Post("add")
  async addBook(@Body() book) {}
}
