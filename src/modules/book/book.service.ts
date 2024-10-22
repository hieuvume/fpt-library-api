import { BadRequestException, Injectable } from '@nestjs/common';
import { BookRepository } from './book.repository';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { isValidObjectId } from 'mongoose';
import { error } from 'console';

@Injectable()
export class BookService {
    constructor(private readonly bookRepository: BookRepository) { }

    async findAll() {
        return this.bookRepository.findAll(); // Fetch all books
    }

    async create(book: CreateBookDto) {
        return this.bookRepository.create(book); // Create a new book
    }

    async findById(id: string) {
        
        if (!isValidObjectId(id)) {
            throw new BadRequestException('Invalid ID format');
        }
        const book = await this.bookRepository.findById(id);
        if (!book) {
            throw new BadRequestException('Book not found');
        }

        return book.populate(
            {
                path: 'book_title',
                populate: [{
                    path: 'categories'
                },
                {
                    path: 'memberships'

                }]
            },

        );
    }

    async update(id: string, book: UpdateBookDto) {
        return this.bookRepository.update(id, book); // Update book by ID
    }

    async delete(id: string) {
        return this.bookRepository.delete(id); // Delete book by ID
    }
}