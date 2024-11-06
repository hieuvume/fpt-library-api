import { Controller, Get, Post, Body, Param, Query, Put } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { UpdateMembershipDto } from './dto/update-membership.dto';

@Controller('membership-dashboard')
export class MembershipDashboardController {
  constructor(private readonly membershipService: MembershipService) {}
  
  @Get('/list')
  async findAll(@Query() query) {
    return await this.membershipService.findMemberShip(query);
  }
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.membershipService.findOne(id);
  }
  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateMembershipDto) {
    return await this.membershipService.update(id, data);
  }

}