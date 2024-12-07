import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Settings, 
  BookOpen, 
  FileText, 
  GraduationCap,
  Users,
  Eye,
  ThumbsUp,
  Download,
  Menu,
  ChevronRight,
  Bell,
  LogOut,
  HelpCircle,
  Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserService } from '../services/api/UserService';

interface ProfilePageProps {
  isDark: boolean;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ isDark }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('notes'); // notes, articles, exams

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (!user?.id) return;
        const response = await UserService.getUserProfile(user.id);
        setProfileData(response);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleMenuItemClick = (callback: () => void) => {
    setIsMenuOpen(false);
    callback();
  };

  const menuItems = [
    {
      icon: <User size={20} />,
      label: 'Profilim',
      onClick: () => handleMenuItemClick(() => navigate('/profile'))
    },
    {
      icon: <Bell size={20} />,
      label: 'Bildirimler',
      onClick: () => handleMenuItemClick(() => navigate('/notifications'))
    },
    {
      icon: <Settings size={20} />,
      label: 'Ayarlar',
      onClick: () => handleMenuItemClick(() => navigate('/settings'))
    },
    {
      icon: <Shield size={20} />,
      label: 'Gizlilik',
      onClick: () => handleMenuItemClick(() => navigate('/privacy'))
    },
    {
      icon: <HelpCircle size={20} />,
      label: 'Yardım',
      onClick: () => handleMenuItemClick(() => navigate('/help'))
    },
    {
      icon: <LogOut size={20} />,
      label: 'Çıkış Yap',
      onClick: () => handleMenuItemClick(handleLogout)
    }
  ];

  const stats = [
    {
      icon: <Users className="text-blue-500" />,
      label: 'Takipçi',
      value: profileData?.followers_count || 0
    },
    {
      icon: <Eye className="text-green-500" />,
      label: 'Görüntülenme',
      value: profileData?.total_views || 0
    },
    {
      icon: <ThumbsUp className="text-purple-500" />,
      label: 'Beğeni',
      value: profileData?.total_likes || 0
    },
    {
      icon: <Download className="text-orange-500" />,
      label: 'İndirme',
      value: profileData?.total_downloads || 0
    }
  ];

  const tabs = [
    {
      id: 'notes',
      icon: <BookOpen size={20} />,
      label: 'Notlar',
      content: profileData?.notes || []
    },
    {
      id: 'articles',
      icon: <FileText size={20} />,
      label: 'Makaleler',
      content: profileData?.articles || []
    },
    {
      id: 'exams',
      icon: <GraduationCap size={20} />,
      label: 'Sınavlar',
      content: profileData?.exams || []
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Hamburger Menu */}
      <div 
        className={`fixed top-0 right-0 h-screen w-64 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-xl z-50`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Menü
            </h2>
            <button
              onClick={() => setIsMenuOpen(false)}
              className={`p-2 rounded-full hover:bg-gray-100 ${isDark ? 'hover:bg-gray-700' : ''}`}
            >
              <ChevronRight />
            </button>
          </div>
          <div className="space-y-2">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isDark 
                    ? 'hover:bg-gray-700 text-gray-300 hover:text-white' 
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className={`relative p-6 rounded-xl mb-8 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <button
            onClick={() => setIsMenuOpen(true)}
            className={`absolute top-4 right-4 p-2 rounded-full ${
              isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <Menu size={24} />
          </button>
          
          <div className="flex items-center gap-6">
            <div className="relative">
              <img
                src={profileData?.avatar_url || 'https://via.placeholder.com/100'}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
              <button 
                className={`absolute bottom-0 right-0 p-2 rounded-full ${
                  isDark ? 'bg-gray-700' : 'bg-gray-100'
                }`}
              >
                <Settings size={16} />
              </button>
            </div>
            
            <div>
              <h1 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                {profileData?.name || 'Kullanıcı Adı'}
              </h1>
              <p className={`mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {profileData?.bio || 'Henüz bir biyografi eklenmemiş.'}
              </p>
              <div className="flex gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex items-center gap-1">
                      {stat.icon}
                      <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                        {stat.value}
                      </span>
                    </div>
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="mb-6">
          <div className="flex gap-4 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? `border-blue-500 ${isDark ? 'text-blue-400' : 'text-blue-600'}`
                    : `border-transparent ${isDark ? 'text-gray-400' : 'text-gray-600'}`
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tabs.find(tab => tab.id === activeTab)?.content.map((item: any, index: number) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
            >
              <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                {item.title}
              </h3>
              <p className={`mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {item.description}
              </p>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Eye size={16} />
                    {item.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <ThumbsUp size={16} />
                    {item.likes}
                  </span>
                </div>
                <button
                  className={`px-4 py-2 rounded-lg ${
                    isDark
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-blue-500 hover:bg-blue-600'
                  } text-white transition-colors`}
                >
                  Görüntüle
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;