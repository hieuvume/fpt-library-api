export class BorrowRecordDto {
    borrowDate: Date;
    dueDate: Date;
    returnDate: Date | null;
    isReturned: boolean;
    penalty: number;
    book: {
      title: string;
      author: string[];
      categories: string[];
      memberships: {
        name: string;
        priceMonthly: number;
        priceYearly: number;
      }[];
      section: string;
      shelf: string;
      floor: number;
      position: number;
    };
  }
  