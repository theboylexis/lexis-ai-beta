import React, { useState, useEffect } from 'react';
import { useStore } from './store/useStore';
import Layout from './components/Layout';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Tutor from './pages/Tutor';
import Flashcards from './pages/Flashcards';
import Planner from './pages/Planner';
import Settings from './pages/Settings';
import Library from './pages/Library';
import Exams from './pages/Exams';

const App: React.FC = () => {
  const { user, pendingTutorQuery } = useStore();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Watch for pending AI queries from other parts of the app (like Flashcards)
  useEffect(() => {
    if (pendingTutorQuery && activeTab !== 'tutor') {
        setActiveTab('tutor');
    }
  }, [pendingTutorQuery, activeTab]);

  if (!user || !user.setupComplete) {
    return <Onboarding onComplete={() => {}} />;
  }

  const renderContent = () => {
    switch (activeTab) {
        case 'dashboard': return <Dashboard />;
        case 'tutor': return <Tutor />;
        case 'flashcards': return <Flashcards />;
        case 'planner': return <Planner />;
        case 'settings': return <Settings />;
        case 'library': return <Library />;
        case 'exams': return <Exams />;
        default: return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
        {renderContent()}
    </Layout>
  );
};

export default App;