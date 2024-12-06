import { collection, addDoc, getDocs, query, where, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { Exam } from '../types';
import { v4 as uuidv4 } from 'uuid';
import api from './api';
import { FilterOptions } from '../types';

interface GetAllExamsParams {
  page?: number;
  filters?: FilterOptions;
}

interface ExamResponse {
  data: {
    exams: any[];
    meta: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
  };
}

class ExamService {
  static async getAllExams({ page = 1, filters = {} }: GetAllExamsParams): Promise<ExamResponse> {
    const queryParams = new URLSearchParams();
    
    // Add pagination
    queryParams.append('page', page.toString());
    
    // Add filters
    if (filters.search) {
      queryParams.append('search', filters.search);
    }
    if (filters.university) {
      queryParams.append('university', filters.university);
    }
    if (filters.department) {
      queryParams.append('department', filters.department);
    }
    if (filters.year) {
      queryParams.append('year', filters.year.toString());
    }
    if (filters.semester) {
      queryParams.append('semester', filters.semester);
    }

    const response = await api.get(`/public/exams?${queryParams.toString()}`);
    return response;
  }

  static async getExamById(id: string) {
    const response = await api.get(`/exams/${id}`);
    return response.data;
  }

  static async createExam(examData: any) {
    const response = await api.post('/exams', examData);
    return response.data;
  }

  static async updateExam(id: string, examData: any) {
    const response = await api.put(`/exams/${id}`, examData);
    return response.data;
  }

  static async deleteExam(id: string) {
    const response = await api.delete(`/exams/${id}`);
    return response.data;
  }

  static async uploadExam = async (exam: Omit<Exam, 'id'>, file: File) => {
    try {
      // PDF dosyasını Storage'a yükle
      const fileId = uuidv4();
      const fileRef = ref(storage, `exams/${fileId}`);
      await uploadBytes(fileRef, file);
      const fileUrl = await getDownloadURL(fileRef);

      // Exam verisini Firestore'a ekle
      const examData = {
        ...exam,
        fileUrl,
        uploadDate: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'exams'), examData);
      return { id: docRef.id, ...examData };
    } catch (error) {
      console.error('Exam upload error:', error);
      throw error;
    }
  };

  static async getExams = async (userId?: string) => {
    try {
      let q = collection(db, 'exams');
      
      if (userId) {
        q = query(q, where('authorId', '==', userId));
      }
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Exam[];
    } catch (error) {
      console.error('Get exams error:', error);
      throw error;
    }
  };

  static async updateExamFirestore = async (examId: string, updates: Partial<Exam>) => {
    try {
      const examRef = doc(db, 'exams', examId);
      await updateDoc(examRef, updates);
    } catch (error) {
      console.error('Update exam error:', error);
      throw error;
    }
  };

  static async deleteExamFirestore = async (examId: string) => {
    try {
      await deleteDoc(doc(db, 'exams', examId));
    } catch (error) {
      console.error('Delete exam error:', error);
      throw error;
    }
  };
}

export default ExamService;