import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BookTitle, BookTitleDocument } from 'modules/book-title/book-title.schema';
import { BookTitleRepository } from './book-title.repository';

@Injectable()
export class BookTitleService {
  constructor(private readonly bookTitleRepository: BookTitleRepository) {}
}