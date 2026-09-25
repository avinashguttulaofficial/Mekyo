import React, { useState } from 'react';
import { Search, User, Shield, BookOpen, LogOut, Menu, X, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate, onOpenSearch }) => {
  const { user, isAuthenticated, isAdmin, isPro, logout } = useAuth();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Explore', path: '/explore' },
    { label: 'Categories', path: '/categories' },
    { label: 'Free Prompts', path: '/explore?price=free' },
    { label: 'Pricing', path: '/pricing' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#F7F7F5]/90 backdrop-blur-md border-b border-[#E7E7E3] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => onNavigate('/')}
            className="text-xl font-bold tracking-tight text-[#111111] hover:opacity-80 transition-opacity cursor-pointer select-none"
            aria-label="Mekyo Home"
          >
            MEKYO
          </button>
        </div>

        {/* Zone 2: 4-6 nav links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#666666]">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path;
            return (
              <button
                key={link.label}
                onClick={() => onNavigate(link.path)}
                className={`transition-colors whitespace-nowrap hover:text-[#111111] cursor-pointer ${isActive ? 'text-[#111111] font-semibold' : ''
                  }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          {/* Search Trigger */}
          <button
            type="button"
            onClick={onOpenSearch || (() => onNavigate('/explore'))}
            className="p-2 text-[#666666] hover:text-[#111111] hover:bg-neutral-200/50 rounded-lg transition-colors cursor-pointer"
            aria-label="Search prompts"
          >
            <Search className="w-4 h-4" />
          </button>



          {isAuthenticated ? (
            <div className="relative">
              <div className="flex items-center gap-2">
                {isAdmin ? (
                  <button
                    onClick={() => onNavigate('/admin')}
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#111111] hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer shadow-xs whitespace-nowrap"
                  >
                    <Shield className="w-3.5 h-3.5 text-[#B8FF3D]" />
                    <span>Admin Dashboard</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onNavigate('/library')}
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#111111] bg-neutral-200/70 hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>My Library</span>
                  </button>
                )}

                {/* Profile Avatar Button */}
                <button
                  type="button"
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-1.5 p-1 rounded-full hover:ring-2 hover:ring-neutral-300 transition-all cursor-pointer"
                  aria-label="User profile options"
                >
                  <img
                    src={user?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=MekyoUser'}
                    alt={user?.full_name || 'User'}
                    className="w-8 h-8 rounded-full bg-neutral-200 object-cover border border-[#E7E7E3]"
                    referrerPolicy="no-referrer"
                  />
                </button>
              </div>

              {/* Profile Dropdown Menu */}
              {profileMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-[#E7E7E3] py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onMouseLeave={() => setProfileMenuOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-[#E7E7E3]">
                    <p className="text-xs font-semibold text-[#111111] truncate">{user?.full_name}</p>
                    <p className="text-[11px] text-[#8A8A8A] truncate">{user?.email}</p>
                    <div className="mt-1 flex items-center gap-1 text-[11px] font-medium">
                      <span className="text-neutral-500">Plan:</span>
                      <span className="capitalize font-semibold text-neutral-900">{user?.plan}</span>
                      {isPro && <Sparkles className="w-3 h-3 text-[#B8FF3D] fill-current" />}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      onNavigate('/dashboard');
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-[#111111] hover:bg-neutral-50 flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5 text-neutral-500" />
                    <span>User Dashboard</span>
                  </button>

                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      onNavigate('/library');
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-[#111111] hover:bg-neutral-50 flex items-center gap-2"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-neutral-500" />
                    <span>My Library</span>
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => {
                        setProfileMenuOpen(false);
                        onNavigate('/admin');
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-[#111111] bg-neutral-50 hover:bg-neutral-100 flex items-center gap-2"
                    >
                      <Shield className="w-3.5 h-3.5 text-[#111111]" />
                      <span>Admin Management</span>
                    </button>
                  )}

                  <div className="border-t border-[#E7E7E3] my-1" />

                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      logout();
                      onNavigate('/');
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => onNavigate('/login')}
                className="px-3 py-1.5 text-xs font-medium text-[#111111] hover:text-black transition-colors cursor-pointer whitespace-nowrap"
              >
                Login
              </button>
              <button
                onClick={() => onNavigate('/signup')}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#111111] hover:bg-black rounded-lg transition-colors cursor-pointer whitespace-nowrap shadow-xs"
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-neutral-700 hover:text-black rounded-lg"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#E7E7E3] px-5 py-4 space-y-3">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate(link.path);
                }}
                className="text-left text-sm font-medium text-neutral-800 py-1.5"
              >
                {link.label}
              </button>
            ))}
            {isAuthenticated && (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('/library');
                  }}
                  className="text-left text-sm font-medium text-neutral-800 py-1.5"
                >
                  My Library
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('/dashboard');
                  }}
                  className="text-left text-sm font-medium text-neutral-800 py-1.5"
                >
                  User Dashboard
                </button>
                {isAdmin && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onNavigate('/admin');
                    }}
                    className="text-left text-sm font-semibold text-neutral-900 py-1.5"
                  >
                    Admin Dashboard
                  </button>
                )}
              </>
            )}
          </div>

        </div>
      )}
    </header>
  );
};
