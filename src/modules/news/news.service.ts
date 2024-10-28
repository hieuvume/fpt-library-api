import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NewsRepository } from './news.repository';

@Injectable()
export class NewsService {
  constructor(private readonly newsRepository: NewsRepository) {}

  async findAll() {
    return this.newsRepository.findAll();
  }

  async findByTitle(title: string) {
    return this.newsRepository.findByTitle(title);
  }

}