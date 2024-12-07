import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Award, Building2, GraduationCap } from 'lucide-react';
import { Note } from '../types';

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1623074716850-ba4c90d49f2f?q=80&w=2598&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

interface NoteCardProps {
  note: Note;
  isDark: boolean;
}

function NoteCard({ note, isDark }: NoteCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/notes/${note.id}`)}
      className={`cursor-pointer group relative overflow-hidden rounded-xl transition-all duration-300 
        transform hover:-translate-y-2 ${isDark ? 'bg-gray-800/50' : 'bg-white/50'}
        backdrop-blur-xl border border-opacity-20 ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        } shadow-lg hover:shadow-xl p-6`}
    >
      <div className="aspect-video overflow-hidden">
        <img 
          src={note.attributes?.cover_image || DEFAULT_IMAGE} 
          alt={note.attributes?.title || 'Note Image'}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm mb-2">
        <span className={`px-3 py-1 rounded-full ${
          isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'
        }`}>
          {note.attributes?.subject || 'General'}
        </span>
        <span className={`px-3 py-1 rounded-full ${
          isDark ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-600'
        }`}>
          {note.attributes?.semester || ''} {note.attributes?.year || ''}
        </span>
      </div>

      <h3 className="text-xl font-semibold mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
        {note.attributes?.title || 'Untitled Note'}
      </h3>

      {note.attributes?.description && (
        <p className="text-sm opacity-75 mb-4 line-clamp-2">
          {note.attributes.description}
        </p>
      )}

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm opacity-75">
          <Building2 size={16} />
          <span>{note.attributes?.university || 'University not set'}</span>
        </div>
        <div className="flex items-center gap-2 text-sm opacity-75">
          <GraduationCap size={16} />
          <span>{note.attributes?.department || 'Department not set'}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm opacity-75 mb-4">
        <span>{note.attributes?.author || 'Anonymous'}</span>
        <span>•</span>
        <span>Created {new Date(note.attributes?.created_at || Date.now()).toLocaleDateString('tr-TR')}</span>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-1 text-sm">
          <Award size={16} />
          <span>{note.attributes?.likes || 0}</span>
        </div>
        
        <div className="flex items-center gap-1 text-sm">
          <Clock size={16} />
          <span>{note.attributes?.downloads || 0}</span>
        </div>
        
        <div className="flex items-center gap-1 text-sm">
          <Award size={16} />
          <span>Paylaş</span>
        </div>
      </div>
    </div>
  );
}

export default NoteCard;