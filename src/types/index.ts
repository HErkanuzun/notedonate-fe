export interface Note {
  id: number;
  title: string;
  content: string;
  university: {
    id: number;
    name: string;
  };
  department: {
    id: number;
    name: string;
  };
  year: string;
  semester: string;
  subject?: string;
  storage_link?: string;
  created_at: string;
  updated_at: string;
  // Computed properties
  likes?: number;
  downloads?: number;
  author?: string;
}

export interface Article {
  id: number;
  title: string;
  content: string;
  university?: string;
  department?: string;
  year?: string | number;
  semester?: string;
  subject?: string;
  storage_link?: string;
  created_at: string;
  updated_at: string;
  abstract?: string;
  image_url?: string;
  likes_count?: number;
  downloads_count?: number;
  author_id?: number;
  creator?: {
    id: number;
    name: string;
  };
  status?: string;
  featured_image?: string;
  excerpt?: string;
  published_at?: string;
  slug?: string;
}

export interface FilterOptions {
  university?: string;
  department?: string;
  year?: number | null;
  semester?: string;
  search?: string;
  sortBy?: 'date' | 'title' | 'university';
  sortOrder?: 'asc' | 'desc';
}

export interface Exam {
  id: string;
  title: string;
  subject?: string;
  description?: string;
  university?: string;
  department?: string;
  year?: number;
  semester?: string;
  fileUrl?: string;
  authorId: string;
  uploadDate: string;
  status: 'draft' | 'scheduled' | 'published';
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  university?: string;
  department?: string;
  avatar?: string;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}
