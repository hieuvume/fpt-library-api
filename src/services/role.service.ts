import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument } from 'schemas/role.schema';

@Injectable()
export class RoleService {
  constructor(@InjectModel(Role.name) private roleModel: Model<RoleDocument>) {}

  async findAll(): Promise<Role[]> {
    return this.roleModel.find().exec();
  }

  async create(data: any): Promise<Role> {
    const newRole = new this.roleModel(data);
    return newRole.save();
  }

  async findById(id: string): Promise<Role> {
    return this.roleModel.findById(id).exec();
  }
}