import { seeder } from "nestjs-seeder";
import { MongooseModule } from "@nestjs/mongoose";
import { Category, CategorySchema } from "modules/category/category.schema";
import { BookTitle, BookTitleSchema } from "modules/book-title/book-title.schema";
import { Book, BookSchema } from "modules/book/book.schema";
import { CategorySeeder } from "modules/category/category.seeder";
import { BookTitleSeeder } from "modules/book-title/book-title.seeder";
import { BookSeeder } from "modules/book/book.seeder";
import { Role, RoleSchema } from "modules/role/role.schema";
import { BorrowRecord, BorrowRecordSchema } from "modules/borrow-record/borrow-record.schema";
import { UserSeeder } from "modules/user/user.seeder";
import { User, UserSchema } from "modules/user/user.schema";
import { BorrowRecordSeeder } from "modules/borrow-record/user.seeder";

seeder({
    imports: [
        MongooseModule.forRoot("mongodb://localhost:27017", {
            user: 'root',
            dbName: 'library',
            pass: '123456',
        }),
        MongooseModule.forFeature([
            { name: Category.name, schema: CategorySchema },
            { name: BookTitle.name, schema: BookTitleSchema },
            { name: Book.name, schema: BookSchema },
            { name: Role.name, schema: RoleSchema },
            { name: User.name, schema: UserSchema },
            { name: BorrowRecord.name, schema: BorrowRecordSchema },
        ]),
    ],
}).run([UserSeeder, CategorySeeder, BookTitleSeeder, BookSeeder, BorrowRecordSeeder]);
