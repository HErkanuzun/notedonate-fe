import React, { useState } from 'react';
import { X, Plus, Save } from 'lucide-react';

interface ExamFormProps {
  onClose: () => void;
  onSubmit: (examData: any) => void;
  isDark: boolean;
}

export const ExamForm: React.FC<ExamFormProps> = ({ onClose, onSubmit, isDark }) => {
  const [step, setStep] = useState(1);
  const [examData, setExamData] = useState({
    title: '',
    description: '',
    type: 'multiple_choice',
    exam_date: '',
    duration: 60,
    total_questions: 0,
  });

  const [questions, setQuestions] = useState<Array<{
    question: string;
    options: string[];
    correct_answer: string;
    points: number;
  }>>([]);

  const handleExamDataSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (examData.total_questions > 0) {
      setStep(2);
    }
  };

  const handleAddQuestion = () => {
    if (questions.length < examData.total_questions) {
      setQuestions([
        ...questions,
        {
          question: '',
          options: ['', '', '', ''],
          correct_answer: '',
          points: 1,
        },
      ]);
    }
  };

  const handleQuestionChange = (index: number, field: string, value: any) => {
    const newQuestions = [...questions];
    if (field === 'options') {
      newQuestions[index].options[value.index] = value.option;
    } else {
      (newQuestions[index] as any)[field] = value;
    }
    setQuestions(newQuestions);
  };

  const handleSubmit = () => {
    onSubmit({
      ...examData,
      questions,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`w-full max-w-4xl ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-6 max-h-[90vh] overflow-y-auto`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {step === 1 ? 'Sınav Oluştur' : 'Soruları Ekle'}
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-full ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            <X size={20} className={isDark ? 'text-gray-300' : 'text-gray-600'} />
          </button>
        </div>

        {step === 1 ? (
          <form onSubmit={handleExamDataSubmit} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Sınav Adı
              </label>
              <input
                type="text"
                value={examData.title}
                onChange={(e) => setExamData({ ...examData, title: e.target.value })}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Açıklama
              </label>
              <textarea
                value={examData.description}
                onChange={(e) => setExamData({ ...examData, description: e.target.value })}
                rows={3}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Sınav Türü
              </label>
              <select
                value={examData.type}
                onChange={(e) => setExamData({ ...examData, type: e.target.value })}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="multiple_choice">Çoktan Seçmeli</option>
                <option value="true_false">Doğru/Yanlış</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Sınav Tarihi
              </label>
              <input
                type="datetime-local"
                value={examData.exam_date}
                onChange={(e) => setExamData({ ...examData, exam_date: e.target.value })}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Süre (dakika)
              </label>
              <input
                type="number"
                value={examData.duration}
                onChange={(e) => setExamData({ ...examData, duration: parseInt(e.target.value) })}
                min="1"
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Soru Sayısı
              </label>
              <input
                type="number"
                value={examData.total_questions}
                onChange={(e) => setExamData({ ...examData, total_questions: parseInt(e.target.value) })}
                min="1"
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
                required
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 rounded-lg ${
                  isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Devam Et
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {questions.length}/{examData.total_questions} soru eklendi
              </p>
              <button
                onClick={handleAddQuestion}
                disabled={questions.length >= examData.total_questions}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                <Plus size={16} />
                Soru Ekle
              </button>
            </div>

            <div className="space-y-8">
              {questions.map((question, index) => (
                <div key={index} className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="mb-4">
                    <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {index + 1}. Soru
                    </label>
                    <textarea
                      value={question.question}
                      onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                      rows={2}
                      className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                        isDark ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex gap-2 items-center">
                        <input
                          type="radio"
                          name={`correct_${index}`}
                          checked={question.correct_answer === option}
                          onChange={() => handleQuestionChange(index, 'correct_answer', option)}
                          className="h-4 w-4 text-blue-600"
                        />
                        <input
                          type="text"
                          value={option}
                          onChange={(e) =>
                            handleQuestionChange(index, 'options', {
                              index: optionIndex,
                              option: e.target.value,
                            })
                          }
                          placeholder={`${optionIndex + 1}. Seçenek`}
                          className={`flex-1 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                            isDark ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300 text-gray-900'
                          }`}
                          required
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mt-2">
                    <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Puan
                    </label>
                    <input
                      type="number"
                      value={question.points}
                      onChange={(e) => handleQuestionChange(index, 'points', parseInt(e.target.value))}
                      min="1"
                      className={`mt-1 block w-24 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                        isDark ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      required
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className={`px-4 py-2 rounded-lg ${
                  isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Geri
              </button>
              <button
                onClick={handleSubmit}
                disabled={questions.length < examData.total_questions}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                <Save size={16} />
                Kaydet
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
