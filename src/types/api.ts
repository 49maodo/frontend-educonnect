export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone?: string;
  password: string;
  password_confirmation: string;
}

export interface School {
  id: number;
  name: string;
  description: string;
  city: string;
  country: string;
  address: string;
  website: string;
  phone: string;
  accreditations: string;
  is_active: boolean;
  application_fee_amount: string;
  diplomas?: Diploma[];
  created_at: string | null;
  updated_at: string | null;
}

export interface Diploma {
  id: number;
  school_id: number;
  name: string;
  level: string;
  field: string;
  duration: number;
  price: string;
  start_date: string;
  application_deadline: string;
  conditions: string;
  description: string;
  is_active: boolean;
  school?: School;
  created_at: string | null;
  updated_at: string | null;
}

export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export interface Application {
  id: number;
  status: ApplicationStatus | null;
  student_notes: string | null;
  admin_notes: string | null;
  user_id: number;
  diploma_id: number;
  diploma: Diploma;
  created_at: string | null;
  updated_at: string | null;
}

export interface ApplicationRequest {
  diploma_id: number;
  student_notes?: string;
}

export interface ApiResponse<T> {
  data: T;
}

export interface AuthResponse {
  status: string;
  message: string;
  user: string;
  token: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}