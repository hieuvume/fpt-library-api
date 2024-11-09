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
  
  @Controller("book-titles-dashboard")
  export class BookTitleDashboradController {
    constructor(private readonly bookTitleService: BookTitleService) {}
    @Get('get-all')
    //@UseGuards(AuthGuard)
    async getAll(@Query() query) {
      return this.bookTitleService.getAll(query);
    }
    
  }
  