import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { NewsService } from "./news.service";

@Controller("news")
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  // @Get("")
  // async findAllNews() {
  //   return this.newsService.findAll();
  // }

  @Get(":page/:pageSize")
  async paginateWithAggregation(
    @Param("page") page: string,
    @Param("pageSize") pageSize: string
  ) {
    // Chuyển đổi từ string sang number
    const pageNumber = parseInt(page, 10);
    const pageSizeNumber = parseInt(pageSize, 10);

    // Kiểm tra xem pageNumber và pageSizeNumber có hợp lệ không
    if (
      isNaN(pageNumber) ||
      isNaN(pageSizeNumber) ||
      pageNumber <= 0 ||
      pageSizeNumber <= 0
    ) {
      throw new HttpException(
        "Invalid page or pageSize",
        HttpStatus.BAD_REQUEST
      );
    }

    return this.newsService.paginateWithAggregation(pageNumber, pageSizeNumber);
  }

  @Get("/threeNews")
  async getThreeNews() {
    return this.newsService.getThreeNews();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const news = await this.newsService.findById(id);
    if (!news) {
      return {
        message: "News not found",
        statusCode: HttpStatus.NOT_FOUND,
      }
    }
    return news;
  }
}