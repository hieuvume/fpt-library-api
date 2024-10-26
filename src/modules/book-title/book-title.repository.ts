import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import {
  BookTitle,
  BookTitleDocument,
} from "modules/book-title/book-title.schema";
import { PaginateModel, PaginateResult } from "mongoose";

@Injectable()
export class BookTitleRepository {
  constructor(
    @InjectModel(BookTitle.name)
    private bookTitleModel: PaginateModel<BookTitleDocument>
  ) {}

  async findAll(): Promise<BookTitle[]> {
    return this.bookTitleModel.find().exec();
  }

  async create(data: any): Promise<BookTitle> {
    const newBookTitle = new this.bookTitleModel(data);
    return newBookTitle.save();
  }

  async findById(id: string): Promise<BookTitle> {
    return this.bookTitleModel.findById(id).exec();
  }


  async searchByKeyword(keyword: string, page: number, limit: number) {
    const searchRegex = new RegExp(keyword, "i");
    return this.bookTitleModel.paginate(
      {
        $or: [
          { title: { $regex: searchRegex } },
          { description: { $regex: searchRegex } },
          { author: { $regex: searchRegex } },
        ],
      },
      {
        page,
        limit,
        populate: [{ path: "categories" }],
      }
    );
  }
}
