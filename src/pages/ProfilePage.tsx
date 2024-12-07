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
  Shield,
  Calendar,
  Plus,
  Edit,
  Trash2,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserService } from '../services/api/UserService';

interface ProfilePageProps {
  isDark: boolean;
}

interface ContentItem {
  id: number;
  title: string;
  description: string;
  views: number;
  likes: number;
  downloads: number;
  createdAt: string;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ isDark }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editItem, setEditItem] = useState<ContentItem | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ContentItem | null>(null);
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);
  const [isPhoneVerificationOpen, setIsPhoneVerificationOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({
    total_notes: 0,
    total_articles: 0,
    total_exams: 0,
    total_events: 0,
    total_followers: 0,
    total_following: 0,
    total_points: 0
  });

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        setIsEditing(false);
        setShowDeleteModal(false);
        setIsProfileEditOpen(false);
        setIsPhoneVerificationOpen(false);
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (!user?.id) return;
        const response = await UserService.getUserProfile(user.id);
        setProfileData(response);
        setFormData({
          name: response.name,
          email: response.email,
          bio: response.bio || '',
          phone: response.phone || ''
        });
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, [user]);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await UserService.getUserAchievements();
        setAchievements(response.data);
      } catch (error) {
        console.error('Error fetching achievements:', error);
      }
    };

    const fetchStats = async () => {
      try {
        const response = await UserService.getUserStats();
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchAchievements();
    fetchStats();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleEdit = (item: ContentItem) => {
    setEditItem(item);
    setIsEditing(true);
  };

  const handleDelete = (item: ContentItem) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    
    try {
      // API call to delete item
      // await deleteItem(itemToDelete.id);
      setShowDeleteModal(false);
      setItemToDelete(null);
      // Refresh data
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('bio', formData.bio);
      data.append('phone', formData.phone);

      if (fileInputRef.current?.files?.[0]) {
        data.append('avatar', fileInputRef.current.files[0]);
      }

      const response = await UserService.updateProfile(data);
      setProfileData(response.user);
      setIsProfileEditOpen(false);
      // Show success message
    } catch (error) {
      console.error('Error updating profile:', error);
      // Show error message
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyPhone = async () => {
    setIsSubmitting(true);
    try {
      await UserService.verifyPhone(verificationCode);
      const updatedProfile = await UserService.getUserProfile();
      setProfileData(updatedProfile);
      setIsPhoneVerificationOpen(false);
      // Show success message
    } catch (error) {
      console.error('Error verifying phone:', error);
      // Show error message
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      await UserService.resendPhoneVerification();
      // Show success message
    } catch (error) {
      console.error('Error resending verification:', error);
      // Show error message
    }
  };

  const tabs = [
    {
      id: 'profile',
      icon: <User size={20} />,
      label: 'Profil Bilgilerim'
    },
    {
      id: 'notes',
      icon: <BookOpen size={20} />,
      label: 'Notlarım'
    },
    {
      id: 'articles',
      icon: <FileText size={20} />,
      label: 'Makalelerim'
    },
    {
      id: 'exams',
      icon: <GraduationCap size={20} />,
      label: 'Sınavlarım'
    },
    {
      id: 'events',
      icon: <Calendar size={20} />,
      label: 'Etkinliklerim'
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

  const renderContent = () => {
    const content = profileData?.[activeTab] || [];
    
    if (activeTab === 'profile') {
      return (
        <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6`}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ad Soyad</label>
              <input 
                type="text" 
                value={profileData?.name || ''} 
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">E-posta</label>
              <input 
                type="email" 
                value={profileData?.email || ''} 
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Biyografi</label>
              <textarea 
                value={profileData?.bio || ''} 
                rows={4}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
            <div className="flex justify-end">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                Kaydet
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {tabs.find(tab => tab.id === activeTab)?.label}
          </h2>
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={() => setIsEditing(true)}
          >
            <Plus size={20} />
            <span>Yeni Ekle</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {content.map((item: ContentItem) => (
            <div
              key={item.id}
              className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  {item.title}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-1.5 text-gray-500 hover:text-blue-500 rounded-lg hover:bg-gray-100"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="p-1.5 text-gray-500 hover:text-red-500 rounded-lg hover:bg-gray-100"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              <p className={`mb-4 line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
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
                  <span className="flex items-center gap-1">
                    <Download size={16} />
                    {item.downloads}
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
    );
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`w-full max-w-2xl ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-6`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                {editItem ? 'Düzenle' : 'Yeni Ekle'}
              </h2>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditItem(null);
                }}
                className={`p-2 rounded-full ${
                  isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <X size={20} className={isDark ? 'text-gray-300' : 'text-gray-600'} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Başlık
                </label>
                <input 
                  type="text"
                  defaultValue={editItem?.title}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Açıklama
                </label>
                <textarea 
                  defaultValue={editItem?.description}
                  rows={4}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
              
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditItem(null);
                  }}
                  className={`px-4 py-2 rounded-lg ${
                    isDark 
                      ? 'text-gray-300 hover:bg-gray-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  İptal
                </button>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                  Kaydet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`w-full max-w-md ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-6`}>
            <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Silme Onayı
            </h2>
            <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
              Bu öğeyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </p>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setItemToDelete(null);
                }}
                className={`px-4 py-2 rounded-lg ${
                  isDark 
                    ? 'text-gray-300 hover:bg-gray-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                İptal
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Edit Modal */}
      {isProfileEditOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`w-full max-w-2xl ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-6`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                Profil Düzenle
              </h2>
              <button
                onClick={() => setIsProfileEditOpen(false)}
                className={`p-2 rounded-full ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <X size={20} className={isDark ? 'text-gray-300' : 'text-gray-600'} />
              </button>
            </div>

            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <img
                    src={profileData?.avatar_url || 'https://via.placeholder.com/100'}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          if (e.target?.result) {
                            const img = document.querySelector('#preview-image') as HTMLImageElement;
                            if (img) {
                              img.src = e.target.result as string;
                            }
                          }
                        };
                        reader.readAsDataURL(e.target.files[0]);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={`absolute bottom-0 right-0 p-2 rounded-full ${
                      isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <Edit size={16} className={isDark ? 'text-gray-300' : 'text-gray-600'} />
                  </button>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Ad Soyad
                </label>
                <input
                  type="text"
                  value={formData?.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  E-posta
                </label>
                <input
                  type="email"
                  value={formData?.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Telefon
                </label>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    value={formData?.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                  {profileData?.phone_verified ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      Onaylı
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsPhoneVerificationOpen(true)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      Onayla
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Biyografi
                </label>
                <textarea
                  value={formData?.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsProfileEditOpen(false)}
                  className={`px-4 py-2 rounded-lg ${
                    isDark 
                      ? 'text-gray-300 hover:bg-gray-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                  {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Phone Verification Modal */}
      {isPhoneVerificationOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`w-full max-w-md ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-6`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                Telefon Doğrulama
              </h2>
              <button
                onClick={() => setIsPhoneVerificationOpen(false)}
                className={`p-2 rounded-full ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <X size={20} className={isDark ? 'text-gray-300' : 'text-gray-600'} />
              </button>
            </div>

            <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {formData?.phone} numaralı telefonunuza gönderilen 6 haneli doğrulama kodunu giriniz.
            </p>

            <div className="space-y-4">
              <input
                type="text"
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                className={`block w-full text-center text-2xl tracking-widest rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="000000"
              />

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendVerification}
                  className={`text-sm ${isDark ? 'text-blue-400' : 'text-blue-600'} hover:underline`}
                >
                  Kodu tekrar gönder
                </button>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setIsPhoneVerificationOpen(false)}
                  className={`px-4 py-2 rounded-lg ${
                    isDark 
                      ? 'text-gray-300 hover:bg-gray-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  İptal
                </button>
                <button
                  onClick={handleVerifyPhone}
                  disabled={isSubmitting || verificationCode.length !== 6}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                  {isSubmitting ? 'Doğrulanıyor...' : 'Doğrula'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className={`relative p-6 rounded-xl mb-8 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              <img
                src={profileData?.avatar_url || 'https://via.placeholder.com/100'}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
              <button 
                onClick={() => setIsProfileEditOpen(true)}
                className={`absolute bottom-0 right-0 p-2 rounded-full ${
                  isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <Settings size={16} className={isDark ? 'text-gray-300' : 'text-gray-600'} />
              </button>
            </div>
            
            <div className="flex-1">
              <h1 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                {profileData?.name || 'Kullanıcı Adı'}
              </h1>
              <p className={`mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {profileData?.bio || 'Henüz bir biyografi eklenmemiş.'}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <div 
                    key={index} 
                    className={`text-center p-2 rounded-lg ${
                      isDark ? 'bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1 mb-1">
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
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? isDark 
                      ? 'border-blue-500 text-blue-400' 
                      : 'border-blue-500 text-blue-600'
                    : isDark
                      ? 'border-transparent text-gray-400 hover:text-gray-300'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Stats Cards */}
            <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                İstatistikler
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Notlar</p>
                  <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.total_notes}</p>
                </div>
                <div>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Makaleler</p>
                  <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.total_articles}</p>
                </div>
                <div>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Sınavlar</p>
                  <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.total_exams}</p>
                </div>
                <div>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Etkinlikler</p>
                  <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.total_events}</p>
                </div>
              </div>
            </div>

            {/* Social Stats */}
            <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                Sosyal
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Takipçiler</p>
                  <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.total_followers}</p>
                </div>
                <div>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Takip Edilenler</p>
                  <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.total_following}</p>
                </div>
              </div>
            </div>

            {/* Points Card */}
            <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                Toplam Puan
              </h3>
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.total_points}</p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>puan</p>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className={`col-span-full p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                Başarılar
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="text-center">
                    <div className={`w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center ${
                      isDark ? 'bg-gray-700' : 'bg-gray-100'
                    }`}>
                      <img src={achievement.icon} alt={achievement.title} className="w-10 h-10" />
                    </div>
                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {achievement.title}
                    </p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {achievement.points} puan
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {renderContent()}
      </div>
    </div>
  );
};

export default ProfilePage;