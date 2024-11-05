import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { News, NewsDocument } from "./news.schema";

@Injectable()
export class NewsRepository {
  constructor(@InjectModel(News.name) private newsModel: Model<NewsDocument>) {}

  async findAll(): Promise<News[]> {
    return this.newsModel.find().exec();
  }

  async create(data: any): Promise<News> {
    const newNews = new this.newsModel(data);
    return newNews.save();
  }

  async findById(id: string): Promise<News> {
    return this.newsModel.findById(id).exec();
  }

  async findByTitle(title: string): Promise<News> {
    return this.newsModel.findOne({ title }).exec();
  }

  async getThreeNews(): Promise<News[]> {
    return this.newsModel.find().sort({ created_at: -1 }).limit(3).exec();
  }

  async paginateWithAggregation(
    page: number,
    pageSize: number
  ): Promise<{ news: News[]; totalNews: number }> {
    const skip = (page - 1) * pageSize;

    // Đếm tổng số bản ghi mà không cần phân trang
    const totalNews = await this.newsModel.countDocuments();

    // Lấy các bản ghi tin tức theo phân trang
    const news = await this.newsModel
      .aggregate([
        { $sort: { created_at: -1 } }, // Sắp xếp mới nhất lên đầu
        { $skip: skip },
        { $limit: pageSize },
      ])
      .exec();

    // Trả về cả news và totalNews
    return { news, totalNews };
  }

}