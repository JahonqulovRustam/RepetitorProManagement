
export type Role = 'superadmin' | 'teacher' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  phone: string;
  email: string;
  username: string;
  password?: string;
  joinedDate: string;
}

export interface Student {
  id: string;
  name: string;
  phone: string;
  groupId: string;
  joiningDate: string;
  status: 'active' | 'inactive' | 'deleted';
  balance: number;
  username?: string;
  password?: string;
}

export interface Group {
  id: string;
  name: string;
  subject: string;
  schedule: string;
  teacherId: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  groupId: string;
  date: string;
  status: 'present' | 'absent' | 'late';
}

export interface Assignment {
  id: string;
  groupId: string;
  title: string;
  description: string;
  deadline: string;
  fileUrl?: string;
  submissions: Submission[];
}

export interface Submission {
  id: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  fileUrl: string;
  comment?: string;
  status: 'pending' | 'reviewed';
}

export interface Payment {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  date: string;
  status: 'paid' | 'debt';
  month: string;
}

export interface Material {
  id: string;
  name: string;
  type: string;
  size: string;
  groupId: string;
  teacherId: string;
  uploadDate: string;
  fileData?: string; // Base64 formatidagi fayl kontenti
  fileName?: string;
}

export interface AppNotification {
  id: string;
  type: 'assignment_submission' | 'payment_received' | 'system';
  title: string;
  message: string;
  date: string;
  read: boolean;
  link?: string;
}

