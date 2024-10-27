import { ForbiddenException, Injectable } from '@nestjs/common';
import { MembershipCardRepository } from './membership-card.repository';
import { MembershipCard } from './membership-card.schema';

@Injectable()
export class MembershipCardService {
  constructor(private readonly membershipCardRepository: MembershipCardRepository) { }

  async validateUserMembership(userId: string): Promise<MembershipCard> {
    const activeCard = await this.membershipCardRepository.findActiveCardByUserId(userId);

    if (!activeCard) {
      throw new ForbiddenException('You need an active membership to borrow books.');
    }

    if (activeCard.end_date < new Date()) {
      throw new ForbiddenException('Your membership has expired. Please renew your membership to borrow books.');
    }

    if (activeCard.status !== 'active') {
      throw new ForbiddenException('Your membership card is not active. Please activate it to borrow books.');
    }

    return activeCard;
  }
}
