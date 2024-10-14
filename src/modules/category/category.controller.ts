import { Controller, Get, Post, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

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