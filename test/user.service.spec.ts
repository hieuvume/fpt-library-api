import { Test, TestingModule } from '@nestjs/testing';

import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UserService } from 'modules/user/user.service';
import { UserRepository } from 'modules/user/user.repository';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Partial<Record<keyof UserRepository, jest.Mock>>;

  beforeEach(async () => {
    userRepository = {
      findUserById: jest.fn(),
      updateUser: jest.fn(),
      updatePassword: jest.fn(),
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepository, useValue: userRepository },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  describe('profile', () => {
    it('should return user profile if user exists', async () => {
      const mockUser = { id: '1', name: 'John Doe' };
      userRepository.findUserById.mockResolvedValue(mockUser);

      const result = await userService.profile('1');
      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException if user does not exist', async () => {
      userRepository.findUserById.mockResolvedValue(null);

      await expect(userService.profile('1')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('updateAvatar', () => {
    it('should update avatar if user exists', async () => {
      const mockUser = { id: '1', avatar_url: 'old_avatar_url' };
      userRepository.findUserById.mockResolvedValue(mockUser);
      userRepository.updateUser.mockResolvedValue({ ...mockUser, avatar_url: 'new_avatar_url' });

      const result = await userService.updateAvatar('1', 'new_avatar_url');
      expect(result.avatar_url).toBe('new_avatar_url');
    });

    it('should throw UnauthorizedException if user does not exist', async () => {
      userRepository.findUserById.mockResolvedValue(null);

      await expect(
        userService.updateAvatar('1', 'new_avatar_url'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('updateProfile', () => {
    it('should update profile data if user exists', async () => {
      const mockUser = { id: '1', name: 'John Doe' };
      const updateData = { name: 'Jane Doe' };
      userRepository.findUserById.mockResolvedValue(mockUser);
      userRepository.updateUser.mockResolvedValue({ ...mockUser, ...updateData });

      const result = await userService.updateProfile('1', updateData);
      expect(result.full_name).toBe('Jane Doe');
    });

    it('should throw UnauthorizedException if user does not exist', async () => {
      userRepository.findUserById.mockResolvedValue(null);

      await expect(userService.updateProfile('1', { name: 'Jane Doe' })).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('updatePassword', () => {
    it('should update password if current password matches', async () => {
      const mockUser = { _id: '1', password: 'hashed_password' };
      userRepository.findUserById.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('new_hashed_password');
      userRepository.updatePassword.mockResolvedValue(true);

      const result = await userService.updatePassword('1', 'current_password', 'new_password');
      expect(userRepository.updatePassword).toHaveBeenCalledWith('1', 'new_hashed_password');
    });

    it('should throw BadRequestException if current password does not match', async () => {
      const mockUser = { _id: '1', password: 'hashed_password' };
      userRepository.findUserById.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(
        userService.updatePassword('1', 'wrong_password', 'new_password'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw UnauthorizedException if user does not exist', async () => {
      userRepository.findUserById.mockResolvedValue(null);

      await expect(
        userService.updatePassword('1', 'current_password', 'new_password'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const mockUsers = [{ id: '1', name: 'John Doe' }, { id: '2', name: 'Jane Doe' }];
      userRepository.findAll.mockResolvedValue(mockUsers);

      const result = await userService.findAll();
      expect(result).toEqual(mockUsers);
    });
  });
});
