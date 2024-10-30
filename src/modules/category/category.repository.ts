import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel } from 'mongoose';
import { Category, CategoryDocument } from './category.schema';

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectModel(Category.name)
    private categoryModel: PaginateModel<CategoryDocument>
  ) { }

  async findAll(): Promise<Category[]> {
    return this.categoryModel.find().exec();
  }

  async findAllCategory(
    page: number,
    limit: number,
    sortField: string,
    sortOrder: string
  ) {
    const sort: Record<string, any> = {};
    sort[sortField] = sortOrder === "asc" ? 1 : -1;

    return this.categoryModel.paginate(
      {},
      {
        page,
        limit,
        // populate: [{ path: "title" }],
        sort,
      }
    );
  }

  async create(data: any): Promise<Category> {
    const newCategory = new this.categoryModel(data);
    return newCategory.save();
  }

  async findById(id: string): Promise<Category> {
    return this.categoryModel.findById(id).exec();
  }

  async findByTitle(title: string): Promise<Category> {
    return this.categoryModel.findOne({ title }).exec();
  }
}