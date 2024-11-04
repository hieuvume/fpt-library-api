import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Category, CategorySchema } from "./category.schema";
import { CategoryService } from "./category.service";
import { CategoryRepository } from "./category.repository";
import { CategoryController } from "./category.controller";
import { CategoryDashboardController } from "./category.dashboard.controller";

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  controllers: [CategoryController, CategoryDashboardController],
  providers: [CategoryService, CategoryRepository],
  exports: [CategoryService, CategoryRepository],
})
export class CategoryModule {}
