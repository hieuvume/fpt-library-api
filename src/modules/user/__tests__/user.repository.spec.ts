import { Test, TestingModule } from '@nestjs/testing';

import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Role } from '../../role/role.schema';
import { MembershipCard } from '../../membership-card/membership-card.schema';
import { BookRepository } from 'modules/book/book.repository';
import { UserRepository } from '../user.repository';
import { User, UserDocument } from '../user.schema';

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let userModel: Model<UserDocument>;
  let bookRepository: BookRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        { provide: getModelToken(User.name), useValue: Model },
        { provide: BookRepository, useValue: {} },
      ],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
    userModel = module.get<Model<UserDocument>>(getModelToken(User.name));
    bookRepository = module.get<BookRepository>(BookRepository);
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const mockUsers = [{ id: '1', name: 'John Doe' }, { id: '2', name: 'Jane Doe' }];
      jest.spyOn(userModel, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUsers),
      } as any);

      const result = await userRepository.findAll();
      expect(result).toEqual(mockUsers);
    });
  });

  describe('getProfile', () => {
    it('should return user profile with populated fields', async () => {
      const mockUser = { id: '1', name: 'John Doe', role: {} };
      jest.spyOn(userModel, 'findById').mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockUser),
      } as any);

      const result = await userRepository.getProfile('1');
      expect(result).toEqual(mockUser);
    });
  });

  describe('findById', () => {
    it('should find user by id and populate role', async () => {
      const mockUser = { id: '1', name: 'John Doe', role: {} };
      jest.spyOn(userModel, 'findById').mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockUser),
      } as any);

      const result = await userRepository.findById('1');
      expect(result).toEqual(mockUser);
    });
  });

  describe('findUserById', () => {
    it('should find user by id with populated role and membership', async () => {
      const mockUser = { id: '1', name: 'John Doe', role: {}, current_membership: {} };
      jest.spyOn(userModel, 'findById').mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockUser),
      } as any);

      const result = await userRepository.findUserById('1');
      expect(result).toEqual(mockUser);
    });
  });

  describe('findOneByEmail', () => {
    it('should find user by email and populate role', async () => {
      const mockUser = { id: '1', email: 'test@example.com', role: {} };
      jest.spyOn(userModel, 'findOne').mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockUser),
      } as any);

      const result = await userRepository.findOneByEmail('test@example.com');
      expect(result).toEqual(mockUser);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
        const mockUser = {
            id: '1',
            email: 'test@example.com',
            password: 'password',
            full_name: 'John Doe',
            phone_number: '123456789',
            role: { _id: new Types.ObjectId(), role_name: 'user' } as unknown as Role, 
            avatar_url: 'avatar_url.jpg',
          };
      jest.spyOn(userModel.prototype, 'save').mockResolvedValue(mockUser);

      const result = await userRepository.create(mockUser);
      expect(result).toEqual(mockUser);
    });
  });

  describe('updatePassword', () => {
    it('should update password for user by id', async () => {
      jest.spyOn(userModel, 'updateOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue({ matchedCount: 1 }),
      } as any);

      const result = await userRepository.updatePassword('1' as any, 'new_password');
      expect(result).toEqual({ matchedCount: 1 });
    });
  });

  describe('updateUser', () => {
    it('should update user by id with provided data', async () => {
      const mockUser = { id: '1', name: 'Updated Name' };
      jest.spyOn(userModel, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      } as any);

      const result = await userRepository.updateUser('1', { name: 'Updated Name' });
      expect(result).toEqual(mockUser);
    });
  });

  describe('updateCurrentMembership', () => {
    it('should update current membership for user', async () => {
      jest.spyOn(userModel, 'updateOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
      } as any);

      const result = await userRepository.updateCurrentMembership('1', { _id: 'membershipId' } as unknown as MembershipCard);
      expect(result).toEqual({ modifiedCount: 1 });
    });
  });
});
