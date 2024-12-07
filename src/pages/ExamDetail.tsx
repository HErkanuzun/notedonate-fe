import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ThumbsUp, Download, Share2, Calendar, Play } from 'lucide-react';
import * as ExamService from '../services/api/ExamService';
import { Exam } from '../types';
import LoadingCard from '../components/LoadingCard';

interface ExamDetailProps {
  isDark: boolean;
}

function ExamDetail({ isDark }: ExamDetailProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [exam, setExam] = useState<Exam | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        setIsLoading(true);
        const response = await ExamService.getExam(Number(id));
        setExam(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchExam();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingCard isDark={isDark} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className={`p-4 rounded-lg ${isDark ? 'bg-red-900/50 text-red-200' : 'bg-red-100 text-red-800'}`}>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-800'}`}>
          <p>Exam not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className={`mb-6 flex items-center gap-2 px-4 py-2 rounded-lg
          ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}
          transition-colors duration-200`}
      >
        <ArrowLeft size={20} />
        Back
      </button>

      {/* Main Content */}
      <div className={`rounded-xl overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <span className={`px-3 py-1 rounded-full text-sm
              ${isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
              {exam.attributes.subject}
            </span>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Calendar size={16} />
              {new Date(exam.attributes.created_at).toLocaleDateString()}
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2">{exam.attributes.title}</h1>
          <p className="text-gray-600 dark:text-gray-300">{exam.attributes.description}</p>
        </div>

        {/* Details */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <h3 className="font-semibold mb-2">Exam Details</h3>
              <div className="space-y-2">
                <p>Duration: {exam.attributes.duration} minutes</p>
                <p>Total Marks: {exam.attributes.total_marks}</p>
                <p>Questions: {exam.attributes.questions_count}</p>
              </div>
            </div>
            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <h3 className="font-semibold mb-2">Institution Details</h3>
              <div className="space-y-2">
                <p>University: {exam.attributes.university}</p>
                <p>Department: {exam.attributes.department}</p>
                <p>Author: {exam.attributes.author}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <button className="flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
              <Play size={20} />
              Start Exam
            </button>
            <button className="flex items-center gap-2 px-6 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700">
              <Download size={20} />
              Download
            </button>
            <button className="flex items-center gap-2 px-6 py-3 rounded-lg bg-purple-600 text-white hover:bg-purple-700">
              <Share2 size={20} />
              Share
            </button>
            <button className="flex items-center gap-2 px-6 py-3 rounded-lg bg-red-600 text-white hover:bg-red-700">
              <ThumbsUp size={20} />
              Like
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExamDetail;