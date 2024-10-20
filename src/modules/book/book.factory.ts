import { DataFactory } from 'nestjs-seeder';
import { Book } from './book.schema';
import { faker } from '@faker-js/faker';
import { Types } from 'mongoose';

export class BookFactory implements DataFactory {
  create() {
    return {
      book_title: new Types.ObjectId(),
      uniqueId: faker.string.uuid(), // Thay faker.datatype.uuid() bằng faker.string.uuid()
      section: faker.string.alphanumeric(3), // Thay faker.random.alphaNumeric() bằng faker.string.alphanumeric()
      shelf: faker.string.alphanumeric(3), // Thay faker.random.alphaNumeric() bằng faker.string.alphanumeric()
      floor: faker.number.int({ min: 1, max: 5 }), // Thay faker.datatype.number() bằng faker.number.int()
      position: faker.number.int({ min: 1, max: 20 }), // Thay faker.datatype.number() bằng faker.number.int()
      status: 'available', // Hoặc có thể là 'borrowed', 'reserved'
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
    };
  }
}
