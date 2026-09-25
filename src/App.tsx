import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MarketplaceProvider, useMarketplace } from './context/MarketplaceContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { Toast } from './components/common/Toast';
import { SearchModal } from './components/marketplace/SearchModal';
import { Prompt } from './types';

// Pages
import { Home } from './pages/Home';
import { Explore } from './pages/Explore';
import { Categories } from './pages/Categories';
import { PromptDetail } from './pages/PromptDetail';
import { Pricing } from './pages/Pricing';
import { Contact } from './pages/Contact';
import { Terms, Privacy } from './pages/Terms';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { Dashboard } from './pages/Dashboard';
import { Library } from './pages/Library';
import { Profile } from './pages/Profile';

// Admin Views
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminPrompts } from './pages/admin/AdminPrompts';
import { AdminPromptForm } from './pages/admin/AdminPromptForm';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminReviews } from './pages/admin/AdminReviews';
import { AdminSubscriptions } from './pages/admin/AdminSubscriptions';
import { AdminHomepage } from './pages/admin/AdminHomepage';
import { AdminMessages } from './pages/admin/AdminMessages';
import { AdminSettings } from './pages/admin/AdminSettings';

const MainApp: React.FC = () => {
  const { user, isAdmin, isAuthenticated } = useAuth();
  const { prompts, toast, hideToast, siteSettings } = useMarketplace();

  // Routing state
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname || '/');
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Admin routing state
  const [adminSection, setAdminSection] = useState<string>('dashboard');
  const [promptToEdit, setPromptToEdit] = useState<Prompt | null>(null);

  // Handle browser back/forward navigation
  useEffect(() => {
    const onPopState = () => {
      setCurrentPath(window.location.pathname);
      resolveSlugFromPath(window.location.pathname);
    };
    window.addEventListener('popstate', onPopState);
    resolveSlugFromPath(window.location.pathname);
    return () => window.removeEventListener('popstate', onPopState);
  }, [prompts]);

  const resolveSlugFromPath = (path: string) => {
    if (path.startsWith('/prompt/')) {
      const slug = path.replace('/prompt/', '').replace(/\/$/, '');
      const found = prompts.find((p) => p.slug === slug || p.id === slug);
      if (found) setSelectedPrompt(found);
    }
  };

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path.split('?')[0]);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (path.startsWith('/prompt/')) {
      const slug = path.replace('/prompt/', '').replace(/\/$/, '');
      const found = prompts.find((p) => p.slug === slug || p.id === slug);
      if (found) setSelectedPrompt(found);
    }
  };

  const handleOpenPrompt = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    navigate(`/prompt/${prompt.slug}`);
  };

  // Extract query params for explore
  const queryParams = new URLSearchParams(window.location.search);
  const initialCategory = queryParams.get('category') || undefined;
  const initialPrice = queryParams.get('price') || undefined;
  const initialTool = queryParams.get('tool') || undefined;

  // Render Admin System
  if (currentPath.startsWith('/admin')) {
    if (!isAdmin) {
      return (
        <div className="min-h-screen bg-[#F7F7F5] flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md bg-white border border-[#E7E7E3] rounded-2xl p-8 shadow-xs space-y-4">
            <h2 className="text-xl font-bold text-[#111111]">Admin Access Required</h2>
            <p className="text-xs text-[#666666]">
              You must be logged in as an administrator to access the editorial management panel.
            </p>
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 rounded-lg hover:bg-neutral-200 cursor-pointer"
              >
                Return to Store
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#111111] rounded-lg hover:bg-black cursor-pointer"
              >
                Sign In as Admin
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <AdminLayout
        currentSection={adminSection}
        onNavigateSection={(sec) => {
          if (sec === 'create-prompt') {
            setPromptToEdit(null);
          }
          setAdminSection(sec);
        }}
        onReturnToStore={() => navigate('/')}
      >
        {adminSection === 'dashboard' && (
          <AdminDashboard
            onNavigateSection={setAdminSection}
            onEditPrompt={(p) => {
              setPromptToEdit(p);
              setAdminSection('edit-prompt');
            }}
          />
        )}
        {adminSection === 'prompts' && (
          <AdminPrompts
            onEditPrompt={(p) => {
              setPromptToEdit(p);
              setAdminSection('edit-prompt');
            }}
            onCreateNew={() => {
              setPromptToEdit(null);
              setAdminSection('create-prompt');
            }}
            onViewPrompt={(p) => handleOpenPrompt(p)}
          />
        )}
        {(adminSection === 'create-prompt' || adminSection === 'edit-prompt') && (
          <AdminPromptForm
            initialPrompt={promptToEdit}
            onBack={() => setAdminSection('prompts')}
            onSuccess={() => setAdminSection('prompts')}
          />
        )}
        {adminSection === 'categories' && <AdminCategories />}
        {adminSection === 'users' && <AdminUsers />}
        {adminSection === 'orders' && <AdminOrders />}
        {adminSection === 'reviews' && <AdminReviews />}
        {adminSection === 'subscriptions' && <AdminSubscriptions />}
        {adminSection === 'homepage' && <AdminHomepage />}
        {adminSection === 'messages' && <AdminMessages />}
        {adminSection === 'settings' && <AdminSettings />}

        {toast && (
          <Toast message={toast.title} type={toast.type} onClose={hideToast} />
        )}
      </AdminLayout>
    );
  }

  // Render Public & Customer Pages
  return (
    <div className="min-h-screen bg-[#F7F7F5] text-[#111111] flex flex-col font-sans selection:bg-[#B8FF3D] selection:text-black">
      {/* Navbar */}
      <Navbar
        currentPath={currentPath}
        onNavigate={navigate}
        onOpenSearch={() => setSearchModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentPath === '/' && (
          <Home onNavigate={navigate} onOpenPrompt={handleOpenPrompt} />
        )}

        {currentPath === '/explore' && (
          <Explore
            onOpenPrompt={handleOpenPrompt}
            initialCategory={initialCategory}
            initialPrice={initialPrice}
            initialTool={initialTool}
          />
        )}

        {currentPath === '/categories' && (
          <Categories
            onSelectCategory={(catSlug) => navigate(`/explore?category=${catSlug}`)}
          />
        )}

        {currentPath.startsWith('/prompt/') && selectedPrompt && (
          <PromptDetail
            prompt={selectedPrompt}
            onNavigate={navigate}
            onOpenPrompt={handleOpenPrompt}
          />
        )}

        {currentPath === '/pricing' && <Pricing onNavigate={navigate} />}

        {currentPath === '/contact' && <Contact />}

        {currentPath === '/terms' && <Terms />}

        {currentPath === '/privacy' && <Privacy />}

        {currentPath === '/login' && <Login onNavigate={navigate} />}

        {currentPath === '/signup' && <Signup onNavigate={navigate} />}

        {currentPath === '/forgot-password' && <ForgotPassword onNavigate={navigate} />}

        {currentPath === '/reset-password' && <ResetPassword onNavigate={navigate} />}

        {currentPath === '/dashboard' && (
          <Dashboard onNavigate={navigate} onOpenPrompt={handleOpenPrompt} />
        )}

        {currentPath === '/library' && (
          <Library onNavigate={navigate} onOpenPrompt={handleOpenPrompt} />
        )}

        {currentPath === '/profile' && <Profile />}
      </main>

      {/* Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectPrompt={handleOpenPrompt}
      />

      {/* Toast notifications */}
      {toast && (
        <Toast message={toast.title} type={toast.type} onClose={hideToast} />
      )}

      {/* Footer */}
      <Footer onNavigate={navigate} />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <MarketplaceProvider>
        <MainApp />
      </MarketplaceProvider>
    </AuthProvider>
  );
}

export default App;
