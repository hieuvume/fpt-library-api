import { Injectable, NotFoundException } from '@nestjs/common';
import { MembershipRepository } from './membership.repository';
import { BookTitleRepository } from 'modules/book-title/book-title.repository';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { Membership } from './membership.schema';

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
  async findOne(id: string) {
    const membership = await this.membershipRepository.findById(id);
    if (!membership) {
        throw new NotFoundException("Membership not found");
      }
    return membership;
  }

  async findMemberShip(query) :Promise<any> {
    return this.membershipRepository.getMembership(query);
  }
  async update(id: string, data: UpdateMembershipDto): Promise<Membership> {
    const membership = await this.membershipRepository.findById(id);
    if (!membership) {
      throw new NotFoundException("Membership not found");
    }
    return this.membershipRepository.update(id, data);
  }
  async getAll() {
    return this.membershipRepository.getAll();
  }
  
}