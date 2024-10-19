import { CanActivate, ExecutionContext, Injectable, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { UserRepository } from 'modules/user/user.repository';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'modules/auth/constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private userRepository: UserRepository, private jwtService: JwtService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('role guard');
    const requiredRoles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    let user = null;
    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: jwtConstants.secret
        }
      );
      user = await this.userRepository.findById(payload.sub);
    } catch (error) {
      throw new UnauthorizedException();
    }
    
    if (!user) {
      throw new UnauthorizedException();
    }

    if (!requiredRoles) {
      return true;
    }

    if (!user.role) {
      throw new ForbiddenException('No role assigned');
    }

    const hasRole = requiredRoles.includes(user.role.role_name);
    if (!hasRole) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

}
