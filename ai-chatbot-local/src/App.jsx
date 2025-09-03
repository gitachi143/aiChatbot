import { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import LandingPage from './components/LandingPage';
import ChatInterface from './components/ChatInterface';
import AdsPage from './components/AdsPage';

function App() {
  // Set document title
  useEffect(() => {
    document.title = 'AI Chatbot';
  }, []);

  // Option 1: Always start at landing (current behavior)
  const [currentView, setCurrentView] = useState('landing');
  
  // Option 2: If you want to persist user's location across refreshes, uncomment below:
  // const [currentView, setCurrentView] = useState(() => {
  //   return localStorage.getItem('currentView') || 'landing';
  // });

  const handleStartChat = () => {
    setCurrentView('chat');
    // Uncomment below if using Option 2 (state persistence):
    // localStorage.setItem('currentView', 'chat');
  };

  const handleViewAds = () => {
    setCurrentView('ads');
    // Uncomment below if using Option 2 (state persistence):
    // localStorage.setItem('currentView', 'ads');
  };

  const handleBackToHome = () => {
    setCurrentView('landing');
    // Uncomment below if using Option 2 (state persistence):
    // localStorage.setItem('currentView', 'landing');
  };

  return (
    <ThemeProvider>
      {currentView === 'landing' && (
        <LandingPage 
          onStartChat={handleStartChat}
          onViewAds={handleViewAds} 
        />
      )}
      {currentView === 'chat' && (
        <ChatInterface onBackToHome={handleBackToHome} />
      )}
      {currentView === 'ads' && (
        <AdsPage onBackToHome={handleBackToHome} />
      )}
    </ThemeProvider>
  );
}

export default App;
