import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
  Delete,
  HttpException,
  HttpStatus,
  NotFoundException,
  Put,
} from "@nestjs/common";
import { BookTitleService } from "./book-title.service";
import { AuthGuard } from "modules/auth/guards/auth.guard";
import { UpdateBookTitleDto } from "./dto/update-book-title.dto";
import { BookTitle } from "./book-title.schema";

@Controller("book-titles-dashboard")
export class BookTitleDashboradController {
  constructor(private readonly bookTitleService: BookTitleService) { }
  @Get('get-all')
  //@UseGuards(AuthGuard)
  async getAll(@Query() query) {
    return this.bookTitleService.getAll(query);
  }
  @Get('get-by-id/:id')
  async getById(@Param('id') id: string) {
    return this.bookTitleService.getBookDetails(id);
  }
  @Delete(":id/categories/:categoryId")
  async removeCategoryFromBookTitle(
    @Param("id") bookTitleId: string,
    @Param("categoryId") categoryId: string
  ) {
    const result = await this.bookTitleService.removeCategory(bookTitleId, categoryId);
    if (!result) {
      throw new HttpException("Category or Book Title not found", HttpStatus.NOT_FOUND);
    }
    return { message: "Category removed successfully" };
  }
  @Delete(":id/memberships/:membershipId")
  async removeMembershipFromBookTitle(
    @Param("id") bookTitleId: string,
    @Param("membershipId") membershipId: string
  ) {
    const result = await this.bookTitleService.removeMembership(bookTitleId, membershipId);
    if (!result) {
      throw new HttpException("Membership or Book Title not found", HttpStatus.NOT_FOUND);
    }
    return { message: "Membership removed successfully" };
  }
  @Put('update-bookTitle/:id')
  async updateBookTitle(
    @Param('id') id: string,
    @Body() updateBookTitleDto: any,
  ): Promise<BookTitle> {
    return this.bookTitleService.findByIdAndUpdate(id, updateBookTitleDto);
  }
}
