import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NewsRepository } from './news.repository';

@Injectable()
export class NewsService {
  constructor(private readonly categoryRepository: NewsRepository) {}

  async findByTitle(title: string) {
    return this.categoryRepository.findByTitle(title);
  }

}