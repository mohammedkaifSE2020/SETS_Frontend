import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../context/useAuthStore';

interface NavItem {
  label: string;
  path: string;
  requiresAuth: boolean;
  icon?: string;
}

const MainLayout: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Scalable navigation array - easy to add/remove items
  const navItems: NavItem[] = [
    { label: 'Home', path: '/', requiresAuth: false, icon: '🏠' },
    { label: 'Browse Rooms', path: '/browse-rooms', requiresAuth: true, icon: '🎮' },
    { label: 'Create Room', path: '/create-room', requiresAuth: true, icon: '➕' },
    { label: 'Profile', path: '/profile', requiresAuth: true, icon: '👤' },
    // Add more items here as you build features
    // { label: 'Leaderboard', path: '/leaderboard', requiresAuth: false, icon: '🏆' },
    // { label: 'Rules', path: '/rules', requiresAuth: false, icon: '📖' },
  ];

  // Filter nav items based on auth status
  const visibleNavItems = navItems.filter(item => {
    if (item.requiresAuth) {
      return isAuthenticated;
    }
    return true;
  });

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* LEFT SIDE - NAVIGATION */}
            <nav className="flex items-center">
              {/* Mobile hamburger button */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Toggle menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>

              {/* Desktop Navigation */}
              <ul className="hidden md:flex items-center space-x-1">
                {visibleNavItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`
                        flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm
                        transition-all duration-200
                        ${
                          isActivePath(item.path)
                            ? 'bg-white/25 text-white shadow-md'
                            : 'text-white/90 hover:bg-white/15 hover:text-white'
                        }
                      `}
                    >
                      <span className="text-lg">{item.icon}</span>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* RIGHT SIDE - GAME TITLE & USER INFO */}
            <div className="flex items-center gap-6">
              {/* Game Title */}
              <Link
                to="/"
                className="flex items-center gap-2 text-white font-bold text-xl hover:scale-105 transition-transform"
              >
                <span className="text-2xl">🎴</span>
                <span className="hidden sm:inline">Card Match Arena</span>
              </Link>

              {/* User Section (if logged in) */}
              {isAuthenticated && user && (
                <div className="flex items-center gap-3 bg-white/10 rounded-full px-4 py-2">
                  <span className="text-white/90 text-sm hidden sm:inline">
                    Hi, <strong className="text-white">{user.displayName}</strong>
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-1.5 bg-white/20 hover:bg-white/30 text-white text-sm font-medium rounded-full transition-all duration-200 hover:shadow-md"
                  >
                    Logout
                  </button>
                </div>
              )}

              {/* Auth Buttons (if not logged in) */}
              {!isAuthenticated && (
                <div className="flex items-center gap-2">
                  <Link
                    to="/register"
                    className="px-5 py-2 bg-white text-purple-600 font-semibold rounded-full hover:bg-gray-100 transition-colors shadow-md"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black/50 md:hidden z-40"
              onClick={closeMobileMenu}
            ></div>

            {/* Mobile Menu */}
            <div className="md:hidden absolute top-16 left-0 right-0 bg-purple-700 shadow-xl z-50">
              <ul className="py-2 px-4 space-y-1">
                {visibleNavItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={closeMobileMenu}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-lg font-medium
                        transition-colors
                        ${
                          isActivePath(item.path)
                            ? 'bg-white/25 text-white'
                            : 'text-white/90 hover:bg-white/15'
                        }
                      `}
                    >
                      <span className="text-xl">{item.icon}</span>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-300 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm">
            &copy; 2026 Card Match Arena. Built for multiplayer fun. 🎮
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;