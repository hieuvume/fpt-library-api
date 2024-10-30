import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { BookRepository } from './book.repository';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

import { error } from 'console';
import { isValidObjectId, Types } from 'mongoose';
import { BorrowRecordRepository } from 'modules/borrow-record/borrow-record.repository';
import { MembershipRepository } from 'modules/membership/membership.repository';

@Injectable()
export class BookService {
    constructor(
        private readonly bookRepository: BookRepository,
        private readonly borrowRecordRepository: BorrowRecordRepository,
        private readonly membershipRepository: MembershipRepository,
    ) { }

  async findAll() {
    return this.bookRepository.findAll();
  }

  async findAllPaginate(page: number = 1, limit: number = 5, sort: string, order: string): Promise<any> {
    return this.bookRepository.findAllPaginate(page, limit, sort, order);
  }

    async create(book: CreateBookDto) {
        return this.bookRepository.create(book); // Create a new book
    }


    async findById(id: string) {
        if (!isValidObjectId(id)) {
            throw new BadRequestException('Invalid ID format');
        }
        const book = await this.bookRepository.findById(id);
        if (!book) {
            throw new BadRequestException('Book not found');
        }

        return book.populate(
            {
                path: 'book_title',
                select: ['title', 'description', 'brief_content', 'cover_image'],
                populate: [{
                    path: 'categories',
                    select: ['title', 'description']

                },
                {
                    path: 'memberships'
                },
                {
                    path: 'feedbacks',
                    populate: {
                        path: 'user',
                        select: ['full_name', 'avatar_url']
                    },
                    select: ['content', 'rating'],
                }
                ],
            },


        );
    }
    async findBooksByTitleId(bookTitleId: string) {
        if (!isValidObjectId(bookTitleId)) {
            throw new BadRequestException('Invalid ID format');
        }
        return this.bookRepository.findBooksByTitleId(bookTitleId);
    }
    async update(id: string, book: UpdateBookDto) {
        return this.bookRepository.update(id, book);
    }

    async delete(id: string) {
        return this.bookRepository.delete(id); // Delete book by ID
    }
    async borrowBook(userId: string, bookTitleId: string , membershipCard: string) {
        const availableCopy = await this.bookRepository.findRandomAvailableCopy(bookTitleId);
        if (!availableCopy) {
            throw new NotFoundException('No available copies for this book.');
        }
        const hasBorrowed = await this.borrowRecordRepository.userHasBorrowedBookTitle(userId, bookTitleId);
        if (hasBorrowed) {
            throw new ForbiddenException('You can only borrow one copy of each book title at a time.');
        }
        const membershipRules = await this.membershipRepository.findmembershipByIds(membershipCard);
        await this.bookRepository.updateCopyStatus(availableCopy._id, 'pending');
        const borrowRecord = await this.borrowRecordRepository.createBorrowRecord(userId, availableCopy._id, bookTitleId,membershipRules.max_borrow_days);
        return borrowRecord;
    }

    async getBookAvailabilityInfo(bookTitleId: string) {
        const availableCopy = await this.bookRepository.findRandomAvailableCopy(bookTitleId);

        let earliestFreeTime: Date | null;

        if (availableCopy) {
            earliestFreeTime = new Date();
        } else {
            earliestFreeTime = await this.borrowRecordRepository.findEarliestFreeTime(bookTitleId);
            if (!earliestFreeTime) {
                throw new NotFoundException('No copies of this book are currently borrowed.');
            }
        }
        const activeOrderCount = await this.borrowRecordRepository.countActiveOrders(bookTitleId);
        return {
            earliestFreeTime,
            activeOrderCount,
        };
    }


}