import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book } from './book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

export class BookRepository {
    constructor(@InjectModel(Book.name) private readonly bookModel: Model<Book>) {}

    async findAll() {
        return this.bookModel.find().exec();
    }

    async create(book: CreateBookDto) {
        const newBook = new this.bookModel(book);
        return newBook.save();
    }

    async findById(id: string) {
        return this.bookModel.findById(id).exec();
    }

    async update(id: string, book: UpdateBookDto) {
        return this.bookModel.findByIdAndUpdate(id, book, { new: true }).exec();
    }

    async delete(id: string) {
        return this.bookModel.findByIdAndDelete(id).exec();
    }
}
