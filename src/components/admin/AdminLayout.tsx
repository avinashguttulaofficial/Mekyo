import React, { useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  FolderTree,
  Users,
  ShoppingBag,
  Star,
  Sparkles,
  Home,
  MessageSquare,
  Settings,
  ArrowLeft,
  Menu,
  X,
  Plus,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminLayoutProps {
  currentSection: string;
  onNavigateSection: (section: string) => void;
  onReturnToStore: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentSection,
  onNavigateSection,
  onReturnToStore,
  children,
}) => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'prompts', label: 'Prompts', icon: FileText },
    { id: 'categories', label: 'Categories', icon: FolderTree },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'subscriptions', label: 'Subscriptions', icon: Sparkles },
    { id: 'homepage', label: 'Homepage Content', icon: Home },
    { id: 'messages', label: 'Contact Messages', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F7F7F5] flex flex-col">
      {/* Admin Top Header Bar */}
      <header className="sticky top-0 z-30 bg-[#111111] text-white border-b border-neutral-800 px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-1.5 text-neutral-400 hover:text-white rounded"
            aria-label="Toggle navigation drawer"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-tight">MEKYO</span>
            <span className="text-[11px] font-mono text-[#B8FF3D] bg-neutral-800 px-2 py-0.5 rounded">
              ADMIN CONTROL
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateSection('create-prompt')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#111111] bg-[#B8FF3D] hover:bg-[#a6ee2d] rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Prompt</span>
          </button>

          <button
            onClick={onReturnToStore}
            className="inline-flex items-center gap-1 text-xs text-neutral-300 hover:text-white px-2.5 py-1.5 rounded transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Return to Marketplace</span>
          </button>
        </div>
      </header>

      {/* Main Admin Workspace with Sidebar */}
      <div className="flex-1 flex">
        {/* Desktop Sidebar */}
        <aside
          className={`fixed inset-y-14 left-0 z-20 w-64 bg-white border-r border-[#E7E7E3] p-4 flex flex-col justify-between transition-transform md:translate-x-0 md:static ${
            sidebarOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full'
          }`}
        >
          <div className="space-y-1">
            <div className="px-3 py-2 text-[11px] font-mono uppercase tracking-wider text-[#8A8A8A]">
              Navigation
            </div>
            {navItems.map((item) => {
              const active = currentSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigateSection(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left cursor-pointer ${
                    active
                      ? 'bg-[#111111] text-white shadow-xs'
                      : 'text-[#666666] hover:bg-neutral-100 hover:text-[#111111]'
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${active ? 'text-[#B8FF3D]' : 'text-neutral-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Admin Profile Footer */}
          <div className="pt-4 border-t border-[#E7E7E3] flex items-center gap-2.5 px-2">
            <img
              src={user?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'}
              alt="Admin"
              className="w-7 h-7 rounded-full bg-neutral-200 border border-[#E7E7E3]"
              referrerPolicy="no-referrer"
            />
            <div className="overflow-hidden text-left">
              <p className="text-xs font-semibold text-[#111111] truncate">{user?.full_name}</p>
              <p className="text-[10px] text-[#8A8A8A] font-mono truncate">{user?.email}</p>
            </div>
          </div>
        </aside>

        {/* Dynamic Admin Body Content */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full overflow-x-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
