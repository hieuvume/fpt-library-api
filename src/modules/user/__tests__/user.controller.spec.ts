import { Test, TestingModule } from '@nestjs/testing';

import { AuthGuard } from 'modules/auth/guards/auth.guard';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { UpdateProfileDto } from '../dto/update-profile.dto';

describe('UserController', () => {
  let userController: UserController;
  let userService: Partial<Record<keyof UserService, jest.Mock>>;

  beforeEach(async () => {
    userService = {
      profile: jest.fn(),
      updateProfile: jest.fn(),
      updatePassword: jest.fn(),
      updateAvatar: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: userService }],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) }) // Giả lập AuthGuard
      .compile();

    userController = module.get<UserController>(UserController);
  });

  describe('profile', () => {
    it('should return user profile if user is authenticated', async () => {
      const mockUser = { id: '1', name: 'John Doe' };
      userService.profile.mockResolvedValue(mockUser);

      const req = { user: { id: '1' } };
      const result = await userController.profile(req);
      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      userService.profile.mockRejectedValue(new UnauthorizedException());

      const req = { user: { id: '1' } };
      await expect(userController.profile(req)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('updateProfile', () => {
    it('should update user profile if data is valid', async () => {
      const updateData: UpdateProfileDto = { 
        full_name: 'Jane Doe', 
        phone_number: '1234567890', 
        gender: 'female', 
        address: '123 Main St', 
        date_of_birth: new Date('1990-01-01') 
      };
      const mockUpdatedUser = { id: '1', ...updateData };
      userService.updateProfile.mockResolvedValue(mockUpdatedUser);

      const req = { user: { id: '1' } };
      const result = await userController.updateProfile(req, updateData);
      expect(result).toEqual(mockUpdatedUser);
    });

    it('should throw BadRequestException if data is invalid', async () => {
      userService.updateProfile.mockRejectedValue(new BadRequestException());

      const req = { user: { id: '1' } };
      const invalidData: UpdateProfileDto = { 
        full_name: '', 
        phone_number: '', 
        gender: '', 
        address: '', 
        date_of_birth: new Date() 
      }; // giả định tên trống là không hợp lệ
      await expect(
        userController.updateProfile(req, invalidData),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('updatePassword', () => {
    it('should update password if current password is correct', async () => {
      userService.updatePassword.mockResolvedValue(true);

      const req = { user: { id: '1' } };
      const result = await userController.updatePassword(
        req,
        'current_password',
        'new_password',
      );
      expect(result).toBe(true);
    });

    it('should throw UnauthorizedException if current password is incorrect', async () => {
      userService.updatePassword.mockRejectedValue(new UnauthorizedException());

      const req = { user: { id: '1' } };
      await expect(
        userController.updatePassword(req, 'wrong_password', 'new_password'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('updateAvatar', () => {
    it('should update avatar if user is authenticated', async () => {
      const mockUpdatedUser = { id: '1', avatar_url: 'new_avatar_url' };
      userService.updateAvatar.mockResolvedValue(mockUpdatedUser);

      const req = { user: { id: '1' } };
      const result = await userController.updateAvatar(req, 'new_avatar_url');
      expect(result).toEqual(mockUpdatedUser);
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      userService.updateAvatar.mockRejectedValue(new UnauthorizedException());

      const req = { user: { id: '1' } };
      await expect(
        userController.updateAvatar(req, 'new_avatar_url'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
