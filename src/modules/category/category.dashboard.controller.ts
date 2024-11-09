import { Controller, Get, Post, Delete, Body, Param, HttpException, HttpStatus, Query, Req, Put } from '@nestjs/common';
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

  @Get("/get")
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    if (this.categoryService.findByTitle(createCategoryDto.title)) {
      const title=this.categoryService.findByTitle(createCategoryDto.title)
      console.log(title)
      return this.categoryService.findByTitle(createCategoryDto.title);
        // throw new HttpException({
        //     message: ['Title already exists'],
        // }, HttpStatus.BAD_REQUEST);
    } 

    return `This action adds a new category with title: ${createCategoryDto.title} and description: ${createCategoryDto.description}`;
  }

  @Post('')
    async store(@Body() category: CreateCategoryDto) {
        return this.categoryService.create(category); // Create a new category
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.categoryService.delete(id); // Delete category by ID
    }
    @Put(':id')
    async update(@Param('id') id: string, @Body() category: CreateCategoryDto) {
        return this.categoryService.update(id, category); // Update category by ID
    }

}