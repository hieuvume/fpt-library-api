import { BadRequestException, Injectable } from '@nestjs/common';
import { BookRepository } from './book.repository';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class BookService {
  constructor(private readonly bookRepository: BookRepository) {}

  async findAll() {
    return this.bookRepository.findAll();
  }

  async findAllPaginate(page: number = 1, limit: number = 5, sort: string, order: string): Promise<any> {
    return this.bookRepository.findAllPaginate(page, limit, sort, order);
  }

  async create(book: CreateBookDto) {
    return this.bookRepository.create(book);
  }

  async findById(id: string) {
    if (!isValidObjectId(id)) {
        throw new BadRequestException('Invalid ID format');
    }
    
    // const book = await this.bookRepository.bookModel
    //     .findById(id)
    //     .populate({
    //         path: 'book_title',
    //         select: ['title', 'description', 'brief_content', 'cover_image'],
    //         populate: [
    //             {
    //                 path: 'categories',
    //                 select: ['title', 'description'],
    //             },
    //             {
    //                 path: 'memberships',
    //             },
    //             {
    //                 path: 'feedbacks',
    //                 populate: {
    //                     path: 'user',
    //                     select: ['full_name', 'avatar_url'],
    //                 },
    //                 select: ['content', 'rating'],
    //             },
    //         ],
    //     })
    //     .exec();
    const book = null;

    if (!book) {
        throw new BadRequestException('Book not found');
    }

    return book;
}


  async findBooksByTitleId(bookTitleId: string) {
    if (!isValidObjectId(bookTitleId)) {
      throw new BadRequestException('Invalid ID format');
    }
    return this.bookRepository.findBooksByTitleId(bookTitleId);
  }

  async update(id: string, book: UpdateBookDto) {
    return this.bookRepository.update(id, book);
  }

  async delete(id: string) {
    return this.bookRepository.delete(id);
  }
}
