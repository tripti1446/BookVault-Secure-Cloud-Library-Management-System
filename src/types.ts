export type MemberType = 'Student' | 'Faculty';

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  isbn: string;
  publisher: string;
  publishYear: string;
  copies: number;
  available: number;
  location: string;
  description: string;
  coverColor: string; // Dynamic aesthetic visual fallback for book covers
}

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: MemberType;
  department: string;
  status: 'Active' | 'Inactive';
  avatar: string;
  joinDate: string;
}

export interface IssuedBook {
  id: string;
  bookId: string;
  bookTitle: string;
  author: string;
  memberId: string;
  memberName: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'Issued' | 'Returned' | 'Overdue';
  fineAmount: number;
}

export interface Reservation {
  id: string;
  bookId: string;
  bookTitle: string;
  memberId: string;
  memberName: string;
  reserveDate: string;
  status: 'Ready for Pickup' | 'Pending' | 'Cancelled';
}

export interface Fine {
  id: string;
  memberId: string;
  memberName: string;
  bookTitle: string;
  amount: number;
  reason: string;
  date: string;
  status: 'Pending' | 'Paid';
}

export interface LibraryNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  time: string;
  read: boolean;
}

export interface SystemOperator {
  name: string;
  email: string;
  role: string;
  pass: string;
}

