import { Book, Member, IssuedBook, Reservation, Fine, LibraryNotification, SystemOperator } from './types';

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'B-101',
    title: 'Introduction to Algorithms, Fourth Edition',
    author: 'Thomas H. Cormen, Charles E. Leiserson',
    category: 'Computer Science',
    isbn: '978-0262046305',
    publisher: 'MIT Press',
    publishYear: '2022',
    copies: 15,
    available: 12,
    location: 'Shelf CS-04',
    description: 'A comprehensive update to the leading algorithms text, with new chapters on bipartiteness, online algorithms, and machine learning.',
    coverColor: 'from-blue-700 to-indigo-950'
  },
  {
    id: 'B-102',
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    category: 'Computer Science',
    isbn: '978-0132350884',
    publisher: 'Prentice Hall',
    publishYear: '2008',
    copies: 10,
    available: 8,
    location: 'Shelf CS-02',
    description: 'Even bad code can function. But if code isn\'t clean, it can bring a development organization to its knees. This book teaches you how to write professional, readable code.',
    coverColor: 'from-emerald-700 to-teal-950'
  },
  {
    id: 'B-103',
    title: 'Principles of Modern Engineering Mechanics',
    author: 'J. L. Meriam, L. G. Kraige',
    category: 'Engineering',
    isbn: '978-1118885840',
    publisher: 'John Wiley & Sons',
    publishYear: '2016',
    copies: 8,
    available: 6,
    location: 'Shelf EN-01',
    description: 'Known for its accuracy, clarity, and dependability, Meriam and Kraige\'s Engineering Mechanics has provided a solid foundation of mechanics principles for more than 60 years.',
    coverColor: 'from-amber-700 to-amber-950'
  },
  {
    id: 'B-104',
    title: 'High-Output Management',
    author: 'Andrew S. Grove',
    category: 'Management',
    isbn: '978-0679762881',
    publisher: 'Vintage Books',
    publishYear: '1995',
    copies: 12,
    available: 11,
    location: 'Shelf MG-05',
    description: 'The essential handbook of doing business, creating and running a company, and managing people, from the former chairman and CEO of Intel.',
    coverColor: 'from-purple-700 to-fuchsia-950'
  },
  {
    id: 'B-105',
    title: 'Quantum Physics: A Fundamental Approach',
    author: 'Robert Eisberg, Robert Resnick',
    category: 'Science',
    isbn: '978-0471873730',
    publisher: 'Wiley',
    publishYear: '1985',
    copies: 6,
    available: 5,
    location: 'Shelf SC-08',
    description: 'Presents a clear and comprehensive introduction to the principles and concepts of quantum mechanics with applications across diverse scientific sub-disciplines.',
    coverColor: 'from-cyan-750 to-blue-900'
  },
  {
    id: 'B-106',
    title: 'The Story of Art',
    author: 'E.H. Gombrich',
    category: 'Arts & Humanities',
    isbn: '978-0714832470',
    publisher: 'Phaidon Press',
    publishYear: '1995',
    copies: 5,
    available: 4,
    location: 'Shelf AH-03',
    description: 'One of the most famous and popular books on art ever written, which has been a world bestseller for over four decades, guiding readers through the history of visual creation.',
    coverColor: 'from-rose-700 to-red-950'
  }
];

export const INITIAL_MEMBERS: Member[] = [
  {
    id: 'M-301',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@university.edu',
    phone: '+91 98765 43210',
    type: 'Student',
    department: 'Computer Science',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120',
    joinDate: '2024-08-15'
  },
  {
    id: 'M-302',
    name: 'Dr. Priya Nair',
    email: 'priya.nair@university.edu',
    phone: '+91 94440 12345',
    type: 'Faculty',
    department: 'Engineering',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
    joinDate: '2020-06-20'
  },
  {
    id: 'M-303',
    name: 'Rohan Deshmukh',
    email: 'rohan.d@university.edu',
    phone: '+91 88776 55432',
    type: 'Student',
    department: 'Management',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
    joinDate: '2025-01-10'
  },
  {
    id: 'M-304',
    name: 'Ananya Roy',
    email: 'ananya.roy@university.edu',
    phone: '+91 77609 88321',
    type: 'Student',
    department: 'Science',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120',
    joinDate: '2023-09-02'
  },
  {
    id: 'M-305',
    name: 'Prof. Amit Verma',
    email: 'amit.verma@university.edu',
    phone: '+91 93120 44556',
    type: 'Faculty',
    department: 'Computer Science',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120',
    joinDate: '2019-11-12'
  },
  {
    id: 'M-306',
    name: 'Vikram Singh',
    email: 'vikram.s@university.edu',
    phone: '+91 99881 12233',
    type: 'Student',
    department: 'Arts & Humanities',
    status: 'Inactive',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
    joinDate: '2022-07-22'
  }
];

export const INITIAL_ISSUES: IssuedBook[] = [
  {
    id: 'TX-501',
    bookId: 'B-101',
    bookTitle: 'Introduction to Algorithms, Fourth Edition',
    author: 'Thomas H. Cormen, Charles E. Leiserson',
    memberId: 'M-301',
    memberName: 'Aarav Sharma',
    issueDate: '2026-05-18',
    dueDate: '2026-06-02',
    status: 'Issued',
    fineAmount: 0
  },
  {
    id: 'TX-502',
    bookId: 'B-102',
    bookTitle: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    memberId: 'M-303',
    memberName: 'Rohan Deshmukh',
    issueDate: '2026-05-10',
    dueDate: '2026-05-24',
    status: 'Issued',
    fineAmount: 150
  },
  {
    id: 'TX-503',
    bookId: 'B-104',
    bookTitle: 'High-Output Management',
    author: 'Andrew S. Grove',
    memberId: 'M-302',
    memberName: 'Dr. Priya Nair',
    issueDate: '2026-05-25',
    dueDate: '2026-06-25',
    status: 'Issued',
    fineAmount: 0
  },
  {
    id: 'TX-504',
    bookId: 'B-103',
    bookTitle: 'Principles of Modern Engineering Mechanics',
    author: 'J. L. Meriam, L. G. Kraige',
    memberId: 'M-304',
    memberName: 'Ananya Roy',
    issueDate: '2026-04-12',
    dueDate: '2026-04-26',
    returnDate: '2026-04-25',
    status: 'Returned',
    fineAmount: 0
  },
  {
    id: 'TX-505',
    bookId: 'B-105',
    bookTitle: 'Quantum Physics: A Fundamental Approach',
    author: 'Robert Eisberg, Robert Resnick',
    memberId: 'M-305',
    memberName: 'Prof. Amit Verma',
    issueDate: '2026-05-01',
    dueDate: '2026-05-31',
    returnDate: '2026-05-30',
    status: 'Returned',
    fineAmount: 0
  }
];

export const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 'RES-801',
    bookId: 'B-101',
    bookTitle: 'Introduction to Algorithms, Fourth Edition',
    memberId: 'M-304',
    memberName: 'Ananya Roy',
    reserveDate: '2026-05-30',
    status: 'Ready for Pickup'
  },
  {
    id: 'RES-802',
    bookId: 'B-102',
    bookTitle: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    memberId: 'M-302',
    memberName: 'Dr. Priya Nair',
    reserveDate: '2026-05-31',
    status: 'Pending'
  },
  {
    id: 'RES-803',
    bookId: 'B-106',
    bookTitle: 'The Story of Art',
    memberId: 'M-306',
    memberName: 'Vikram Singh',
    reserveDate: '2026-05-28',
    status: 'Cancelled'
  }
];

export const INITIAL_FINES: Fine[] = [
  {
    id: 'FN-901',
    memberId: 'M-303',
    memberName: 'Rohan Deshmukh',
    bookTitle: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    amount: 150,
    reason: '7 days overdue (₹10/day fine active + standard processing fee)',
    date: '2026-05-25',
    status: 'Pending'
  },
  {
    id: 'FN-902',
    memberId: 'M-301',
    memberName: 'Aarav Sharma',
    bookTitle: 'Principles of Modern Engineering Mechanics',
    amount: 320,
    reason: 'Damaged binding reported on return inspection',
    date: '2026-05-20',
    status: 'Pending'
  },
  {
    id: 'FN-903',
    memberId: 'M-306',
    memberName: 'Vikram Singh',
    bookTitle: 'The Story of Art',
    amount: 1980,
    reason: 'Unreturned book declared lost shelf replacement cost',
    date: '2026-05-15',
    status: 'Pending'
  },
  {
    id: 'FN-904',
    memberId: 'M-304',
    memberName: 'Ananya Roy',
    bookTitle: 'Quantum Physics: A Fundamental Approach',
    amount: 50,
    reason: '5 days overdue lookup',
    date: '2026-04-10',
    status: 'Paid'
  }
];

export const INITIAL_NOTIFICATIONS: LibraryNotification[] = [
  {
    id: 'NT-1',
    title: 'Fine Accrued',
    message: 'A fine of ₹150 has been accrued to Rohan Deshmukh for \'Clean Code\' overdue book.',
    type: 'alert',
    time: '2 hours ago',
    read: false
  },
  {
    id: 'NT-2',
    title: 'Reservation Ready',
    message: '\'Introduction to Algorithms\' is now available at the desk for Ananya Roy.',
    type: 'success',
    time: '5 hours ago',
    read: false
  },
  {
    id: 'NT-3',
    title: 'System Backup Complete',
    message: 'The cloud active directory and transactional backup finished successfully at 04:00 AM.',
    type: 'info',
    time: '11 hours ago',
    read: true
  },
  {
    id: 'NT-4',
    title: 'Overdue Warning Sent',
    message: 'Reminder email issued to student Aarav Sharma for due date on 2026-06-02.',
    type: 'warning',
    time: '1 day ago',
    read: true
  }
];

// Issue Trend Data (1 May to 30 May)
export const ISSUE_TREND_DATA = [
  { date: '1 May', issues: 12 },
  { date: '5 May', issues: 18 },
  { date: '10 May', issues: 24 },
  { date: '15 May', issues: 15 },
  { date: '20 May', issues: 32 },
  { date: '25 May', issues: 28 },
  { date: '30 May', issues: 41 },
];

export const CATEGORY_SPLITS = [
  { name: 'Computer Science', percentage: 35, color: '#3B82F6', total: 436 },
  { name: 'Engineering', percentage: 25, color: '#10B981', total: 311 },
  { name: 'Management', percentage: 15, color: '#8B5CF6', total: 187 },
  { name: 'Science', percentage: 15, color: '#06B6D4', total: 187 },
  { name: 'Arts & Humanities', percentage: 10, color: '#EF4444', total: 124 },
];

export const INITIAL_OPERATORS: SystemOperator[] = [
  { name: 'Sarah Jenkins', email: 'sarah.jenkins@bookvault.org', role: 'Head Librarian', pass: 'sarah_pass_2026' },
  { name: 'James Carter', email: 'james.carter@bookvault.org', role: 'Circulation Desk Staff', pass: 'james_circ_desk' },
  { name: 'Elena Rostova', email: 'elena.r@bookvault.org', role: 'Database Associate', pass: 'elena_db_pass' },
];

