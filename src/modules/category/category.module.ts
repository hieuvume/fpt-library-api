import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './category.schema';
import { CategoryService } from './category.service';
import { CategoryRepository } from './category.repository';
import { CategoryController } from './category.controller';

@Module({
    imports: [MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }])],
    controllers: [CategoryController],
    providers: [CategoryService, CategoryRepository],
})
export class CategoryModule { }