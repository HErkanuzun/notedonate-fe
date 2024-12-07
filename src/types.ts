export interface Note {
  id: number;
  type: string;
  attributes: {
    title: string;
    content: string;
    user_id: number;
    file_path: string;
    category: string;
    status: string;
    cover_image: string;
    storage_path: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    author: string;
    university: string;
    department: string;
    subject: string;
    semester: string;
    year: string;
    likes: number;
    downloads: number;
  };
}

export interface Exam {
  id: number;
  type: string;
  attributes: {
    title: string;
    description: string;
    total_marks: number;
    duration: number;
    status: string;
    subject: string;
    cover_image: string;
    created_at: string;
    updated_at: string;
    university: string;
    department: string;
    author: string;
    questions_count: number;
    questions?: Question[];
  };
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface Article {
  id: number;
  title: string;
  author: string;
  date: string;
  likes: number;
  downloads: number;
  content: string;
  tags: string[];
  isFavorite?: boolean;
  featured_image: string;
  storage_link: string;
  university: string;
  department: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  organizer: string;
  university: string;
  department?: string;
  type: 'academic' | 'social' | 'career' | 'other';
  imageUrl?: string;
  registrationUrl?: string;
  isOnline: boolean;
  isFeatured: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  profile_photo_url: string;
  bio?: string;
  university?: string;
  department?: string;
  joinDate: string;
  notes: Note[];
  exams: Exam[];
  articles?: Article[];
  favorites?: {
    notes: number[];
    exams: number[];
    articles: number[];
  };
  followers: number;
  following: number;
}

export interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface AuthResponse {
  status: boolean;
  message: string;
  user?: User;
  token?: string;
}

export interface FilterOptions {
  university?: string;
  department?: string;
  year?: string;
  semester?: string;
  sortBy?: 'date' | 'likes' | 'downloads';
  sortOrder?: 'asc' | 'desc';
  type?: string;
  startDate?: string;
  endDate?: string;
}