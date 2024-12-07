import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, Menu, X, User, Settings, LogOut, Bell, Shield, HelpCircle } from 'lucide-react';

interface HeaderProps {
  isDark: boolean;
  setIsDark: (value: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ isDark, setIsDark }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const menuItems = [
    {
      icon: <User size={20} />,
      label: 'Profilim',
      onClick: () => navigate('/profile')
    },
    {
      icon: <Bell size={20} />,
      label: 'Bildirimler',
      onClick: () => navigate('/notifications')
    },
    {
      icon: <Settings size={20} />,
      label: 'Ayarlar',
      onClick: () => navigate('/settings')
    },
    {
      icon: <Shield size={20} />,
      label: 'Gizlilik',
      onClick: () => navigate('/privacy')
    },
    {
      icon: <HelpCircle size={20} />,
      label: 'Yardım',
      onClick: () => navigate('/help')
    },
    {
      icon: <LogOut size={20} />,
      label: 'Çıkış Yap',
      onClick: handleLogout
    }
  ];

  return (
    <header className={`sticky top-0 z-50 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              NoteDonate
            </span>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/notes"
              className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Notlar
            </Link>
            <Link
              to="/articles"
              className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Makaleler
            </Link>
            <Link
              to="/exams"
              className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Sınavlar
            </Link>
            <Link
              to="/events"
              className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Etkinlikler
            </Link>
            <Link
              to="/about"
              className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Hakkında
            </Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-2 rounded-lg ${
                isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Profile Menu */}
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2"
                >
                  <img
                    src={user.avatar_url || 'https://via.placeholder.com/32'}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className={isDark ? 'text-white' : 'text-gray-900'}>
                    {user.name}
                  </span>
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 ${
                    isDark ? 'bg-gray-800' : 'bg-white'
                  } ring-1 ring-black ring-opacity-5`}>
                    {menuItems.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setIsProfileOpen(false);
                          item.onClick();
                        }}
                        className={`flex items-center w-full px-4 py-2 text-sm ${
                          isDark
                            ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                      >
                        {item.icon}
                        <span className="ml-3">{item.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className={`px-4 py-2 rounded-lg ${
                  isDark
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-blue-500 hover:bg-blue-600'
                } text-white`}
              >
                Giriş Yap
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4" ref={menuRef}>
            <Link
              to="/notes"
              className="block py-2 px-4 text-sm hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Notlar
            </Link>
            <Link
              to="/articles"
              className="block py-2 px-4 text-sm hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Makaleler
            </Link>
            <Link
              to="/exams"
              className="block py-2 px-4 text-sm hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Sınavlar
            </Link>
            <Link
              to="/events"
              className="block py-2 px-4 text-sm hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Etkinlikler
            </Link>
            <Link
              to="/about"
              className="block py-2 px-4 text-sm hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Hakkında
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;