import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { MembershipService } from './membership.service';

@Controller('membership')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @Get()
  async findAll() {
    return await this.membershipService.findAll();
  }


}