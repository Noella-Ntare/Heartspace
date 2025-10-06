import { useState } from 'react';
import LandingPage from './components/landing-page';
import Dashboard from './components/dashboard';
import Programs from './components/programs';
import Community from './components/community';
import Gallery from './components/gallery';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'dashboard' | 'programs' | 'community' | 'gallery'>('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentPage('dashboard');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onLogin={handleLogin} />;
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'programs':
        return <Programs onNavigate={setCurrentPage} />;
      case 'community':
        return <Community onNavigate={setCurrentPage} />;
      case 'gallery':
        return <Gallery onNavigate={setCurrentPage} />;
      default:
        return <LandingPage onLogin={handleLogin} />;
    }
  };

  return (
    <>
      {renderPage()}
      <Toaster />
    </>
  );
}
