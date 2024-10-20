import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookTitle, BookTitleSchema } from './book-title.schema';
import { BookTitleController } from './book-title.controller';
import { BookTitleService } from './book-title.service';
import { BookTitleRepository } from './book-title.repository';


@Global()
@Module({
    imports: [MongooseModule.forFeature([{ name: BookTitle.name, schema: BookTitleSchema }])],
    controllers: [BookTitleController],
    providers: [BookTitleService, BookTitleRepository],
})
export class BookTitleModule { }