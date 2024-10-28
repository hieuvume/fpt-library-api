import { Injectable } from '@nestjs/common';
import { MembershipRepository } from './membership.repository';
import { BookTitleRepository } from 'modules/book-title/book-title.repository';

@Injectable()
export class MembershipService {
  constructor(
    private readonly membershipRepository: MembershipRepository,
    private readonly bookTitleRepository: BookTitleRepository
  ) { }

  async findAll() {
    const memberships = await this.membershipRepository.findAll();
    const membershipWithBookCounts = await Promise.all(
      memberships.map(async (membership) => {
        const resources_count = await this.bookTitleRepository.countByMembershipId(membership._id)

        return {
          ...membership.toObject(),
          resources_count,
        };
      }),
    );
    return membershipWithBookCounts;
  }

}