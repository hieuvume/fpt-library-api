import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { Role } from 'modules/role/role.schema';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<User> {
    return this.userModel.findById(id).populate('role');
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).populate('role');
  }

  async create(data: { email: string; password: string; full_name: string; phone_number: string; role: Role }): Promise<User> {
    const newUser = new this.userModel(data);
    return newUser.save();
  }

  async updatePassword(id: ObjectId, password: string) {
    return this.userModel.updateOne({ _id: id }, { password }).exec();
  }


}