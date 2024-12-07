import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Tag, User, Heart, Download, Share2, Calendar, Building2, GraduationCap } from 'lucide-react';
import { Article } from '../types';

interface ArticleCardProps {
  article: Article;
  isDark: boolean;
}

function ArticleCard({ article, isDark }: ArticleCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/articles/${article.id}`)}
      className={`cursor-pointer group relative overflow-hidden rounded-xl transition-all duration-300 
        transform hover:-translate-y-2 ${isDark ? 'bg-gray-800/50' : 'bg-white/50'}
        backdrop-blur-xl border border-opacity-20 ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        } shadow-lg hover:shadow-xl p-6`}
    >
      <div className="aspect-video overflow-hidden">
        {article.featured_image && (
          <img 
            src={article.featured_image} 
            alt={article.title}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
          />
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm mb-2">
        <span className={`px-3 py-1 rounded-full ${isDark ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
          {article.attributes?.category?.name || 'Uncategorized'}
        </span>
      </div>

      <h3 className="text-xl font-semibold mb-2 line-clamp-2">
        {article.title}
      </h3>

      {article.abstract && (
        <p className="text-sm opacity-75 mb-4 line-clamp-3">
          {article.abstract}
        </p>
      )}

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm opacity-75">
          <Building2 size={16} />
          <span>{article.university || ''}</span>
        </div>
        <div className="flex items-center gap-2 text-sm opacity-75">
          <GraduationCap size={16} />
          <span>{article.department || ''}</span>
        </div>
        <div className="flex items-center gap-2 text-sm opacity-75">
          <User size={16} />
          <span>{article.creator?.name || 'Anonymous'}</span>
        </div>
        <div className="flex items-center gap-2 text-sm opacity-75">
          <Tag size={16} />
          <span>{article.tags?.join(', ') || 'No tags'}</span>
        </div>
        <div className="flex items-center gap-2 text-sm opacity-75">
          <Clock size={16} />
          <span>Created {new Date(article.created_at).toLocaleDateString('tr-TR')}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm opacity-75">
        <span>{article.read_time || '5'} min read</span>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-1 text-sm">
          <Heart size={16} />
          <span>{article.likes_count || 0}</span>
        </div>
        
        <div className="flex items-center gap-1 text-sm">
          <Download size={16} />
          <span>{article.downloads_count || 0}</span>
        </div>
        
        <div className="flex items-center gap-1 text-sm">
          <Share2 size={16} />
          <span>Paylaş</span>
        </div>
      </div>
    </div>
  );
}

export default ArticleCard;