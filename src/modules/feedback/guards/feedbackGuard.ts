import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException,
  } from '@nestjs/common';
  import { BorrowRecordService } from 'modules/borrow-record/borrow-record.service';
  
  @Injectable()
  export class FeedbackGuard implements CanActivate {
    constructor(private readonly borrowRecordService: BorrowRecordService) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const user = request.user; 
      const bookId: string = request.body.book_title_id;
      const borrowRecord = await this.borrowRecordService.findBorrowRecordByUserAndBookTitle(
        user.id,
        bookId,
      );
  
      if (!borrowRecord) {
        throw new ForbiddenException('You can only provide feedback on books you have borrowed.');
      }
  
      return true;
    }
  }
  