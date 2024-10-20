import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Book, BookSchema } from './book.schema';
import { BookService } from './book.service';
import { BookDashboardController } from './book.dashboard.controller';
import { BookRepository } from './book.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }])],
  controllers: [BookDashboardController],
  providers: [BookService, BookRepository],
})
export class BookModule {}
