import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument } from './role.schema';

@Injectable()
export class RoleRepository {
  constructor(@InjectModel(Role.name) private roleModel: Model<RoleDocument>) { }

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

  async findByName(role_name: string): Promise<Role> {
    return this.roleModel.findOne({
      role_name
    }).exec();
  }

  async initIfEmpty() {
    const roles = await this.roleModel.find().exec();
    if (roles.length === 0) {
      const data = [
        {
          role_name: 'USER',
        },
        {
          role_name: 'LIBRARIAN',
        },
        {
          role_name: 'OWNER',
        },
        {
          role_name: 'ADMIN',
        },
      ];
      return this.roleModel.insertMany(data);
    }
    return roles
  }


}