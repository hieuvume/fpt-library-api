import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { RoleService } from './role.service';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get('')
  async findAll() {
    return this.roleService.initIfEmpty();
  }

}