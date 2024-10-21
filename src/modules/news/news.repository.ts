import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { News, NewsDocument } from './news.schema';

@Injectable()
export class NewsRepository {
  constructor(@InjectModel(News.name) private categoryModel: Model<NewsDocument>) {}

  async findAll(): Promise<News[]> {
    return this.categoryModel.find().exec();
  }

  async create(data: any): Promise<News> {
    const newNews = new this.categoryModel(data);
    return newNews.save();
  }

  async findById(id: string): Promise<News> {
    return this.categoryModel.findById(id).exec();
  }

  async findByTitle(title: string): Promise<News> {
    return this.categoryModel.findOne({ title }).exec();
  }
}