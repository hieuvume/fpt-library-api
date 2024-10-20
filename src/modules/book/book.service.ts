import { Injectable } from '@nestjs/common';
import { BookRepository } from './book.repository';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BookService {
    constructor(private readonly bookRepository: BookRepository) {}

    async findAll() {
        return this.bookRepository.findAll(); // Fetch all books
    }

    async create(book: CreateBookDto) {
        return this.bookRepository.create(book); // Create a new book
    }

    async findById(id: string) {
        return this.bookRepository.findById(id); // Find book by ID
    }

    async update(id: string, book: UpdateBookDto) {
        return this.bookRepository.update(id, book); // Update book by ID
    }

    async delete(id: string) {
        return this.bookRepository.delete(id); // Delete book by ID
    }
}
