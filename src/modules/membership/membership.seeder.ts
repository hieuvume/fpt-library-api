import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Seeder } from 'nestjs-seeder';
import { Membership } from './membership.schema';

@Injectable()
export class MembershipSeeder implements Seeder {
  constructor(
    @InjectModel(Membership.name) private readonly membershipModel: Model<Membership>,
  ) {}

  async seed(): Promise<any> {
    // tự membership: 

    const memberships = []

    const basic = new this.membershipModel({
      name: 'Basic',
      price_monthly: 0,
      price_yearly: 0,
      max_borrow_days: 3,
      max_borrow_books_per_time: 1,
      max_reserve_books_per_montly: 2,
      color: '#000000',
    })

    const standard = new this.membershipModel({
      name: 'Standard',
      price_monthly: 49000,
      price_yearly: 529200,
      max_borrow_days: 7,
      max_borrow_books_per_time: 3,
      max_reserve_books_per_montly: 5,
      color: '#FF0000',
    })

    const pro = new this.membershipModel({
      name: 'Pro',
      price_monthly: 99000,
      price_yearly: 1069200,
      max_borrow_days: 10,
      max_borrow_books_per_time: 5,
      max_reserve_books_per_montly: 10,
      color: '#FFA500',
    })

    const premium = new this.membershipModel({
      name: 'Premium',
      price_monthly: 199000,
      price_yearly: 2149200,
      max_borrow_days: 14,
      max_borrow_books_per_time: 10,
      max_reserve_books_per_montly: 20,
      color: '#FFFF00',
    })

    memberships.push(basic, standard, pro, premium)

    return this.membershipModel.insertMany(memberships);
  }

  async drop(): Promise<any> {
    // Xóa dữ liệu hiện có trước khi seed
    return this.membershipModel.deleteMany({});
  }
}
