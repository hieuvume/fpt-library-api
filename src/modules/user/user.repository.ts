import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async create(data: any): Promise<User> {
    const newUser = new this.userModel(data);
    return newUser.save();
  }
  //handler error if user not found  or not exist
  
  async findById(id: string): Promise<User> {
    const thisUser = await this.userModel.findById(id).exec();
    if (!thisUser) {
      throw new NotFoundException('User not found');
    
  }
  return thisUser;
}
}