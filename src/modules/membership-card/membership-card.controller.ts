import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { MembershipCardService }from './membership-card.service';
@Controller('roles')
export class MembershipCardController {
  constructor(private readonly membershipCardService: MembershipCardService) {}


}