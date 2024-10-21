import { Injectable } from '@nestjs/common';
import { Seeder, DataFactory } from 'nestjs-seeder';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import * as bcrypt from 'bcryptjs';
import { Role } from 'modules/role/role.schema';

@Injectable()
export class UserSeeder implements Seeder {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
  ) {}

  async seed(): Promise<any> {
    const userRole = await this.roleModel.findOne({ role_name: 'USER' });
    const adminRole = await this.roleModel.findOne({ role_name: 'ADMIN' });

    this.userModel.create({
      email: 'admin@readora.me',
      password: bcrypt.hashSync('123123', 10),
      full_name: 'Admin',
      phone_number: '0123456789',
      role: adminRole._id,
      avatar_url: 'https://avatars.githubusercontent.com/u/91399314'
    })

    const users = DataFactory.createForClass(User).generate(100);

    users.map(user => {
      user.role = userRole._id;
    })

    return this.userModel.insertMany(users);
  }

  async drop(): Promise<any> {
    return this.userModel.deleteMany({});
  }
}
