import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { News, NewsSchema } from './news.schema';
import { NewsService } from './news.service';
import { NewsRepository } from './news.repository';
import { NewsController } from './news.controller';

@Module({
    imports: [MongooseModule.forFeature([{ name: News.name, schema: NewsSchema }])],
    controllers: [NewsController],
    providers: [NewsService, NewsRepository],
})
export class NewsModule { }