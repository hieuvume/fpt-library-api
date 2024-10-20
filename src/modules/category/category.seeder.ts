import { Injectable } from '@nestjs/common';
import { Seeder, DataFactory } from 'nestjs-seeder';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './category.schema';

@Injectable()
export class CategorySeeder implements Seeder {
  constructor(@InjectModel(Category.name) private readonly categoryModel: Model<Category>) {}

  async seed(): Promise<any> {
    const categories = DataFactory.createForClass(Category).generate(5);
    return this.categoryModel.insertMany(categories);
  }

  async drop(): Promise<any> {
    return this.categoryModel.deleteMany({});
  }
}
