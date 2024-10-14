import { Injectable } from '@nestjs/common';
import { MembershipCardRepository } from './membership-card.repository';

@Injectable()
export class MembershipCardService {
  constructor(private readonly membershipCardRepository: MembershipCardRepository) {}
}