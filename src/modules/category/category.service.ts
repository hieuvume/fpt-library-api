import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoryRepository } from './category.repository';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async findAllCategory(page: number = 1,limit: number = 5, sort: string, order: string): Promise<any> {
    return this.categoryRepository.findAllCategory(page, limit, sort, order);
  }

  async findByTitle(title: string) {
    return this.categoryRepository.findOneByTitle(title);
  }

}