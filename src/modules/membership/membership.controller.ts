import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { MembershipService } from './membership.service';

@Controller('roles')
export class MembershipController {
  constructor(private readonly membershipController: MembershipService) {}


}