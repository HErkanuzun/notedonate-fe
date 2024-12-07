import React, { useState } from 'react';
import { X, Upload, Save } from 'lucide-react';

interface NoteFormProps {
  onClose: () => void;
  onSubmit: (noteData: any) => void;
  isDark: boolean;
}

export const NoteForm: React.FC<NoteFormProps> = ({ onClose, onSubmit, isDark }) => {
  const [noteData, setNoteData] = useState({
    title: '',
    content: '',
    subject: '',
    grade_level: '',
    status: 'draft',
    tags: [] as string[],
  });
  const [noteFile, setNoteFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNoteFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', noteData.title);
    formData.append('content', noteData.content);
    formData.append('subject', noteData.subject);
    formData.append('grade_level', noteData.grade_level);
    formData.append('status', noteData.status);
    noteData.tags.forEach((tag) => {
      formData.append('tags[]', tag);
    });
    if (noteFile) {
      formData.append('file', noteFile);
    }
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`w-full max-w-4xl ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-6 max-h-[90vh] overflow-y-auto`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Not Oluştur
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-full ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            <X size={20} className={isDark ? 'text-gray-300' : 'text-gray-600'} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Başlık
            </label>
            <input
              type="text"
              value={noteData.title}
              onChange={(e) => setNoteData({ ...noteData, title: e.target.value })}
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              İçerik
            </label>
            <textarea
              value={noteData.content}
              onChange={(e) => setNoteData({ ...noteData, content: e.target.value })}
              rows={6}
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Ders
              </label>
              <input
                type="text"
                value={noteData.subject}
                onChange={(e) => setNoteData({ ...noteData, subject: e.target.value })}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Sınıf Seviyesi
              </label>
              <select
                value={noteData.grade_level}
                onChange={(e) => setNoteData({ ...noteData, grade_level: e.target.value })}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
                required
              >
                <option value="">Seçiniz</option>
                <option value="9">9. Sınıf</option>
                <option value="10">10. Sınıf</option>
                <option value="11">11. Sınıf</option>
                <option value="12">12. Sınıf</option>
                <option value="university">Üniversite</option>
              </select>
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Dosya Yükle
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Upload className={`mx-auto h-12 w-12 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                    <span>Dosya Seç</span>
                    <input
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.ppt,.pptx"
                    />
                  </label>
                </div>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  PDF, Word veya PowerPoint
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Durum
            </label>
            <select
              value={noteData.status}
              onChange={(e) => setNoteData({ ...noteData, status: e.target.value })}
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="draft">Taslak</option>
              <option value="published">Yayınla</option>
            </select>
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
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <Save size={16} />
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
