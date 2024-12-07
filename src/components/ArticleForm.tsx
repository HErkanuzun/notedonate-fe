import React, { useState } from 'react';
import { X, Upload, Save } from 'lucide-react';

interface ArticleFormProps {
  onClose: () => void;
  onSubmit: (articleData: any) => void;
  isDark: boolean;
}

export const ArticleForm: React.FC<ArticleFormProps> = ({ onClose, onSubmit, isDark }) => {
  const [articleData, setArticleData] = useState({
    title: '',
    content: '',
    categories: [] as string[],
    status: 'draft',
  });
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', articleData.title);
    formData.append('content', articleData.content);
    formData.append('status', articleData.status);
    articleData.categories.forEach((category) => {
      formData.append('categories[]', category);
    });
    if (coverImage) {
      formData.append('cover_image', coverImage);
    }
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`w-full max-w-4xl ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-6 max-h-[90vh] overflow-y-auto`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Makale Oluştur
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
              value={articleData.title}
              onChange={(e) => setArticleData({ ...articleData, title: e.target.value })}
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
              value={articleData.content}
              onChange={(e) => setArticleData({ ...articleData, content: e.target.value })}
              rows={10}
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Kapak Görseli
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md">
              {previewUrl ? (
                <div className="space-y-1 text-center">
                  <img src={previewUrl} alt="Preview" className="mx-auto h-32 w-auto" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                      <span>Görseli Değiştir</span>
                      <input type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                    </label>
                  </div>
                </div>
              ) : (
                <div className="space-y-1 text-center">
                  <Upload className={`mx-auto h-12 w-12 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                      <span>Görsel Yükle</span>
                      <input type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Durum
            </label>
            <select
              value={articleData.status}
              onChange={(e) => setArticleData({ ...articleData, status: e.target.value })}
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
