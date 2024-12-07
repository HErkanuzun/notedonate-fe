import React from 'react';
import { Clock, Award, Building2, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Exam } from '../types';

interface ExamCardProps {
  exam: Exam;
  isDark: boolean;
}

function ExamCard({ exam, isDark }: ExamCardProps) {
  const navigate = useNavigate();
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return isDark ? 'bg-green-900/30 text-green-500' : 'bg-green-100 text-green-600';
      case 'completed':
        return isDark ? 'bg-blue-900/30 text-blue-500' : 'bg-blue-100 text-blue-600';
      default:
        return isDark ? 'bg-yellow-900/30 text-yellow-500' : 'bg-yellow-100 text-yellow-600';
    }
  };

  return (
    <div
      onClick={() => navigate(`/exams/${exam.id}`)}
      className={`cursor-pointer rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-white/50'} backdrop-blur-xl border border-opacity-20 ${isDark ? 'border-gray-700' : 'border-gray-200'} p-6 hover:shadow-lg transition-all duration-200`}
    >
      <div className="flex flex-wrap items-center gap-2 text-sm mb-2">
        <span className={`px-3 py-1 rounded-full ${getStatusColor(exam.attributes?.status || '')}`}>
          {exam.attributes?.status ? exam.attributes.status.charAt(0).toUpperCase() + exam.attributes.status.slice(1) : 'Scheduled'}
        </span>
      </div>
      
      <h3 className="text-xl font-semibold mb-2 line-clamp-2">
        {exam.attributes?.title || 'Untitled Exam'}
      </h3>
      
      {exam.attributes?.description && (
        <p className="text-sm opacity-75 mb-4 line-clamp-2">
          {exam.attributes.description}
        </p>
      )}

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm opacity-75">
          <Clock size={16} />
          <span>{exam.attributes?.duration ? `${exam.attributes.duration} minutes` : 'Duration not set'}</span>
        </div>
        <div className="flex items-center gap-2 text-sm opacity-75">
          <Award size={16} />
          <span>{exam.attributes?.total_marks ? `${exam.attributes.total_marks} marks` : 'Marks not set'}</span>
        </div>
        <div className="flex items-center gap-2 text-sm opacity-75">
          <Building2 size={16} />
          <span>{exam.attributes?.university || 'University not set'}</span>
        </div>
        <div className="flex items-center gap-2 text-sm opacity-75">
          <GraduationCap size={16} />
          <span>{exam.attributes?.department || 'Department not set'}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm opacity-75">
        <span>Created {new Date(exam.attributes?.created_at || Date.now()).toLocaleDateString('tr-TR')}</span>
      </div>
    </div>
  );
}

export default ExamCard;