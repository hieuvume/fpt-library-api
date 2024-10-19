import { DataFactory } from 'nestjs-seeder';
import { BookTitle } from './book-title.schema';
import { faker } from '@faker-js/faker';
import { Types } from 'mongoose';

export class BookTitleFactory implements DataFactory {
  create() {
    return {
      title: faker.lorem.words(3),
      description: faker.lorem.sentences(2),
      brief_content: faker.lorem.sentences(1),
      categories: [new Types.ObjectId(), new Types.ObjectId()], // Tạo ObjectId giả
      author: [faker.person.fullName()], // Thay thế name.fullName() bằng person.fullName()
      ISBN: faker.string.uuid(), // Thay faker.datatype.uuid() bằng faker.string.uuid()
      memberships: [new Types.ObjectId(), new Types.ObjectId()],
      price: faker.number.int({ min: 10000, max: 50000 }), // Thay faker.datatype.number() bằng faker.number.int()
    };
  }
}
