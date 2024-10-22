import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Book, BookSchema } from './book.schema';
import { BookService } from './book.service';
import { BookDashboardController } from './book.dashboard.controller';
import { BookRepository } from './book.repository';
import { BookController } from './book.controller';

@Module({
    imports: [MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }])],
    controllers: [BookController],
    providers: [BookService, BookRepository],
    exports:[BookRepository]
})
export class BookModule {}
