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
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NoteCard from '../components/NoteCard';
import ExamCard from '../components/ExamCard';
import LoadingCard from '../components/LoadingCard';
import * as NoteService from '../services/api/NoteService';
import * as ExamService from '../services/api/ExamService';
import * as EventService from '../services/api/EventService';
import { Note, Exam, Event } from '../types';

interface HomePageProps {
  isDark: boolean;
}

function HomePage({ isDark }: HomePageProps) {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [popularNotes, setPopularNotes] = useState<Note[]>([]);
  const [popularExams, setPopularExams] = useState<Exam[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeEventIndex, setActiveEventIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [notes, exams, events] = await Promise.all([
          NoteService.getAllNotes(),
          ExamService.getAllExams(),
          EventService.getAllEvents()
        ]);
        
        // Veri yapısını kontrol et ve güvenli bir şekilde ayarla
        setPopularNotes(notes?.data?.notes || []);
        setPopularExams(exams?.data?.exams || []);
        setUpcomingEvents(events?.data?.events || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Hata durumunda boş array'ler kullan
        setPopularNotes([]);
        setPopularExams([]);
        setUpcomingEvents([]);
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
              <button
                onClick={() => navigate('/register')}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl
                  hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200
                  flex items-center justify-center gap-2 text-lg font-medium shadow-lg"
              >
                Hemen Başla
                <ArrowRight className="animate-bounce" />
              </button>
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
      {/* Upcoming Events Section */}
      <div className="container mx-auto px-4">
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="text-purple-600" />
            <h2 className="text-2xl font-bold">Yaklaşan Etkinlikler</h2>
          </div>

          <div className="relative overflow-hidden rounded-xl">
            {upcomingEvents.length > 0 && (
              <div className="relative h-[400px] overflow-hidden rounded-xl">
                {/* Background Image with Gradient Overlay */}
                <div className="absolute inset-0">
                  <img
                    src={upcomingEvents[activeEventIndex].imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&auto=format&fit=crop'}
                    alt="Event background"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />
                </div>

                {/* Event Content */}
                <div className="relative h-full flex items-center">
                  <div className="container mx-auto px-8">
                    <div className="max-w-2xl text-white">
                      {/* Event Type Badge */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className={`px-3 py-1 rounded-full text-sm 
                          ${upcomingEvents[activeEventIndex].type === 'academic' ? 'bg-blue-600' :
                            upcomingEvents[activeEventIndex].type === 'social' ? 'bg-purple-600' :
                            upcomingEvents[activeEventIndex].type === 'career' ? 'bg-green-600' : 'bg-gray-600'}`}>
                          {upcomingEvents[activeEventIndex].type.charAt(0).toUpperCase() + upcomingEvents[activeEventIndex].type.slice(1)}
                        </span>
                        {upcomingEvents[activeEventIndex].isOnline && (
                          <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-purple-600 text-sm">
                            <Video size={14} />
                            Online
                          </span>
                        )}
                      </div>

                      {/* Event Title */}
                      <h3 className="text-3xl font-bold mb-4 animate-fade-in">
                        {upcomingEvents[activeEventIndex].title}
                      </h3>

                      {/* Event Details */}
                      <div className="space-y-3 mb-6 animate-fade-in">
                        <p className="flex items-center gap-2 text-gray-300">
                          <Calendar size={18} />
                          {new Date(upcomingEvents[activeEventIndex].startDate).toLocaleDateString('tr-TR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        <p className="flex items-center gap-2 text-gray-300">
                          <MapPin size={18} />
                          {upcomingEvents[activeEventIndex].isOnline ? 'Online Etkinlik' : upcomingEvents[activeEventIndex].location}
                        </p>
                      </div>

                      {/* Event Description */}
                      <p className="text-gray-300 mb-6 line-clamp-2 animate-fade-in">
                        {upcomingEvents[activeEventIndex].description}
                      </p>

                      {/* Action Buttons */}
                      <div className="flex gap-4 animate-fade-in">
                        {upcomingEvents[activeEventIndex].registrationUrl && (
                          <a
                            href={upcomingEvents[activeEventIndex].registrationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg 
                              hover:bg-purple-700 transition-all transform hover:scale-105"
                          >
                            <ExternalLink size={20} />
                            Kayıt Ol
                          </a>
                        )}
                        <button
                          onClick={() => navigate(`/events/${upcomingEvents[activeEventIndex].id}`)}
                          className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md text-white 
                            rounded-lg hover:bg-white/20 transition-all transform hover:scale-105"
                        >
                          Detayları Gör
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Event Navigation Dots */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {upcomingEvents.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveEventIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === activeEventIndex 
                          ? 'w-8 bg-purple-600' 
                          : 'bg-white/50 hover:bg-white'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Popular Notes Section */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="text-blue-600" />
            <h2 className="text-2xl font-bold">En Popüler Notlar</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <LoadingCard key={index} isDark={isDark} />
              ))
            ) : (
              popularNotes.map((note) => (
                <NoteCard key={note.id} note={note} isDark={isDark} />
              ))
            )}
          </div>
        </section>

        {/* Popular Exams Section */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Star className="text-purple-600" />
            <h2 className="text-2xl font-bold">En Çok Beğenilen Sınavlar</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <LoadingCard key={index} isDark={isDark} />
              ))
            ) : (
              popularExams.map((exam) => (
                <ExamCard key={exam.id} exam={exam} isDark={isDark} />
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default HomePage;