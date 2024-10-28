import { Injectable } from '@nestjs/common';
import { Seeder, DataFactory } from 'nestjs-seeder';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { News } from './news.schema';

@Injectable()
export class NewsSeeder implements Seeder {
  constructor(@InjectModel(News.name) private readonly newsModel: Model<News>) {}

  async seed(): Promise<any> {
    const news = DataFactory.createForClass(News).generate(15);
    return this.newsModel.insertMany(news);
  }

  async drop(): Promise<any> {
    return this.newsModel.deleteMany({});
  }
}
