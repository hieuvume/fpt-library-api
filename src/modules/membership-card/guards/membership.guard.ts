// guards/membership.guard.ts
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { MembershipCardService } from 'modules/membership-card/membership-card.service';

@Injectable()
export class MembershipGuard implements CanActivate {
  constructor(private readonly membershipCardService: MembershipCardService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.id) {
      throw new ForbiddenException('User is not authenticated');
    }


    await this.membershipCardService.validateUserMembership(user.id);

    return true;
  }
}
