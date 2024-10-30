import { Controller, Get, Post, Body, Param, HttpException, HttpStatus, Query, Req } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('dashboard/categories')
export class CategoryDashboardController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get("")
  async findAllCategory(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
    @Query("sort") sort: string,
    @Query("order") order: string
  ) {
    return this.categoryService.findAllCategory(
      page,
      limit,
      sort,
      order
    );
  }

  @Post()
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {

    if (this.categoryService.findByTitle(createCategoryDto.title)) {
        throw new HttpException({
            message: ['Title already exists'],
        }, HttpStatus.BAD_REQUEST);
    }

    return `This action adds a new category with title: ${createCategoryDto.title} and description: ${createCategoryDto.description}`;
  }


}