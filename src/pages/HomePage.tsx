import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  GraduationCap, 
  Users, 
  TrendingUp, 
  Star, 
  Calendar, 
  MapPin, 
  Video, 
  ExternalLink,
  ArrowRight,
  FileText,
  Eye
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NoteCard from '../components/NoteCard';
import ExamCard from '../components/ExamCard';
import LoadingCard from '../components/LoadingCard';
import SliderCard from '../components/SliderCard';
import * as NoteService from '../services/api/NoteService';
import * as ExamService from '../services/api/ExamService';
import * as EventService from '../services/api/EventService';
import * as ArticleService from '../services/api/ArticleService';
import { Note, Exam, Event, Article } from '../types';

interface HomePageProps {
  isDark: boolean;
}

function HomePage({ isDark }: HomePageProps) {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [popularNotes, setPopularNotes] = useState<Note[]>([]);
  const [popularExams, setPopularExams] = useState<Exam[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [upcomingExams, setUpcomingExams] = useState<Exam[]>([]);
  const [popularArticles, setPopularArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeEventIndex, setActiveEventIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [notes, exams, events, articles] = await Promise.all([
          NoteService.getAllNotes(),
          ExamService.getAllExams(),
          EventService.getAllEvents(),
          ArticleService.getAllArticles()
        ]);
        
        // Veri yapısını kontrol et ve güvenli bir şekilde ayarla
        setPopularNotes(notes?.data?.notes || []);
        setPopularExams(exams?.data?.exams || []);
        setUpcomingEvents(events?.data?.events || []);
        setPopularArticles(articles?.data?.articles || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Hata durumunda boş array'ler kullan
        setPopularNotes([]);
        setPopularExams([]);
        setUpcomingEvents([]);
        setPopularArticles([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (upcomingEvents.length > 0) {
      const interval = setInterval(() => {
        setActiveEventIndex((current) => 
          current === upcomingEvents.length - 1 ? 0 : current + 1
        );
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [upcomingEvents]);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden mb-16">
        {/* Background Pattern */}
        <div className="absolute inset-0 z-0">
          <div className={`absolute inset-0 ${
            isDark 
              ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
              : 'bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50'
          }`} />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIG9wYWNpdHk9Ii4yIi8+PC9nPjwvc3ZnPg==')] opacity-30" />
        </div>

        <div className="relative container mx-auto px-4 pt-24 pb-16">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Akademik Başarının Yeni Adresi
            </h1>
            <p className={`text-xl md:text-2xl mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Notlarını paylaş, bilgini artır, başarıya ulaş. Binlerce öğrencinin bir parçası olduğu akademik topluluğa katıl.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isLoggedIn ? (
                <button
                  onClick={() => navigate('/profile')}
                  className="px-8 py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl
                    hover:from-green-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-200
                    flex items-center justify-center gap-2 text-lg font-medium shadow-lg"
                >
                  Profil
                  <ArrowRight className="animate-bounce" />
                </button>
              ) : (
                <button
                  onClick={() => navigate('/register')}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl
                    hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200
                    flex items-center justify-center gap-2 text-lg font-medium shadow-lg"
                >
                  Hemen Başla
                  <ArrowRight className="animate-bounce" />
                </button>
              )}
              <button
                onClick={() => navigate('/about')}
                className={`px-8 py-4 rounded-xl transform hover:scale-105 transition-all duration-200
                  flex items-center justify-center gap-2 text-lg font-medium
                  ${isDark 
                    ? 'bg-white/10 hover:bg-white/20 text-white' 
                    : 'bg-gray-900/5 hover:bg-gray-900/10 text-gray-900'
                  }`}
              >
                Daha Fazla Bilgi
              </button>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Notes Card */}
            <div className={`p-6 rounded-2xl backdrop-blur-xl transform hover:scale-105 transition-all duration-200
              ${isDark 
                ? 'bg-white/5 hover:bg-white/10 border border-white/10' 
                : 'bg-white/70 hover:bg-white/90 shadow-xl'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 
                flex items-center justify-center mb-4"
              >
                <BookOpen className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Ders Notları</h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Kaliteli ders notlarına anında erişim sağla, kendi notlarını paylaşarak katkıda bulun.
              </p>
            </div>

            {/* Exams Card */}
            <div className={`p-6 rounded-2xl backdrop-blur-xl transform hover:scale-105 transition-all duration-200
              ${isDark 
                ? 'bg-white/5 hover:bg-white/10 border border-white/10' 
                : 'bg-white/70 hover:bg-white/90 shadow-xl'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 
                flex items-center justify-center mb-4"
              >
                <GraduationCap className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Sınav Çözümleri</h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Geçmiş sınav sorularını çöz, çözümleri incele ve sınavlara daha iyi hazırlan.
              </p>
            </div>

            {/* Community Card */}
            <div className={`p-6 rounded-2xl backdrop-blur-xl transform hover:scale-105 transition-all duration-200
              ${isDark 
                ? 'bg-white/5 hover:bg-white/10 border border-white/10' 
                : 'bg-white/70 hover:bg-white/90 shadow-xl'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 
                flex items-center justify-center mb-4"
              >
                <Users className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Öğrenci Topluluğu</h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Diğer öğrencilerle etkileşime geç, sorular sor ve birlikte öğren.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Rest of the sections */}
      <div className="container mx-auto px-4">
        {/* Upcoming Events Section */}
        <SliderCard
          title="Yaklaşan Etkinlikler"
          icon={<Calendar className="text-purple-600" />}
          items={upcomingEvents}
          renderItem={(event) => (
            <div 
              key={event.id}
              onClick={() => navigate(`/events/${event.id}`)}
              className={`cursor-pointer p-6 rounded-xl ${
                isDark 
                  ? 'bg-gray-800 hover:bg-gray-700' 
                  : 'bg-white hover:bg-gray-50'
              } shadow-lg transition-all duration-200 transform hover:scale-105`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`px-3 py-1 rounded-full text-sm ${
                  event.type === 'academic' ? 'bg-blue-600' :
                  event.type === 'social' ? 'bg-purple-600' :
                  event.type === 'career' ? 'bg-green-600' : 'bg-gray-600'
                } text-white`}>
                  {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                </div>
                {event.isOnline && (
                  <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-purple-600 text-sm text-white">
                    <Video size={14} />
                    Online
                  </span>
                )}
              </div>
              <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                {event.title}
              </h3>
              <div className="space-y-2">
                <p className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <Calendar size={16} />
                  {new Date(event.date).toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
                <p className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <MapPin size={16} />
                  {event.isOnline ? 'Online Etkinlik' : event.location}
                </p>
              </div>
            </div>
          )}
          isDark={isDark}
        />

        {/* Popular Notes Section */}
        <SliderCard
          title="En Popüler Notlar"
          icon={<TrendingUp className="text-blue-600" />}
          items={popularNotes}
          renderItem={(note) => (
            <div 
              key={note.id}
              onClick={() => navigate(`/notes/${note.id}`)}
              className={`cursor-pointer p-6 rounded-xl ${
                isDark 
                  ? 'bg-gray-800 hover:bg-gray-700' 
                  : 'bg-white hover:bg-gray-50'
              } shadow-lg transition-all duration-200 transform hover:scale-105`}
            >
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className={isDark ? 'text-blue-400' : 'text-blue-600'} size={24} />
                <div className={`px-3 py-1 rounded-full text-sm ${
                  isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-800'
                }`}>
                  {note.subject}
                </div>
              </div>
              <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                {note.title}
              </h3>
              <div className="flex items-center justify-between">
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {note.downloads} indirme
                </p>
                <div className={`flex items-center gap-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <Star className="fill-current text-yellow-500" size={16} />
                  {note.rating}
                </div>
              </div>
            </div>
          )}
          isDark={isDark}
        />

        {/* Upcoming Exams Section */}
        <SliderCard
          title="Yaklaşan Sınavlar"
          icon={<GraduationCap className="text-green-600" />}
          items={upcomingExams}
          renderItem={(exam) => (
            <div 
              key={exam.id}
              onClick={() => navigate(`/exams/${exam.id}`)}
              className={`cursor-pointer p-6 rounded-xl ${
                isDark 
                  ? 'bg-gray-800 hover:bg-gray-700' 
                  : 'bg-white hover:bg-gray-50'
              } shadow-lg transition-all duration-200 transform hover:scale-105`}
            >
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className={isDark ? 'text-green-400' : 'text-green-600'} size={24} />
                <div className={`px-3 py-1 rounded-full text-sm ${
                  isDark ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-800'
                }`}>
                  {exam.subject}
                </div>
              </div>
              <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                {exam.title}
              </h3>
              <div className="flex items-center justify-between">
                <div className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <Calendar size={16} />
                  {new Date(exam.date).toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'long'
                  })}
                </div>
                <div className={`flex items-center gap-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <Users size={16} />
                  {exam.registeredCount} kayıt
                </div>
              </div>
            </div>
          )}
          isDark={isDark}
        />

        {/* Popular Articles Section */}
        <SliderCard
          title="En Popüler Makaleler"
          icon={<FileText className="text-orange-600" />}
          items={popularArticles}
          renderItem={(article) => (
            <div 
              key={article.id}
              onClick={() => navigate(`/articles/${article.id}`)}
              className={`cursor-pointer p-6 rounded-xl ${
                isDark 
                  ? 'bg-gray-800 hover:bg-gray-700' 
                  : 'bg-white hover:bg-gray-50'
              } shadow-lg transition-all duration-200 transform hover:scale-105`}
            >
              <div className="flex items-center gap-2 mb-4">
                <FileText className={isDark ? 'text-orange-400' : 'text-orange-600'} size={24} />
                <div className={`px-3 py-1 rounded-full text-sm ${
                  isDark ? 'bg-orange-500/20 text-orange-300' : 'bg-orange-100 text-orange-800'
                }`}>
                  {article.category}
                </div>
              </div>
              <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                {article.title}
              </h3>
              <div className="flex items-center justify-between">
                <div className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <Eye size={16} />
                  {article.views} görüntülenme
                </div>
                <div className={`flex items-center gap-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <Star className="fill-current text-yellow-500" size={16} />
                  {article.likes} beğeni
                </div>
              </div>
            </div>
          )}
          isDark={isDark}
        />
      </div>
    </main>
  );
}

export default HomePage;