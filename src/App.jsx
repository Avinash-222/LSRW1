import React from 'react';
import { TestProvider, useTest } from './context/TestContext';
import { PracticeProvider } from './context/PracticeContext';
import Header from './components/Header';
import Landing from './sections/Landing';
import SectionManager from './sections/SectionManager';
import Report from './sections/Report';
import { Bot } from 'lucide-react';

import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import Profile from './sections/Profile';
import History from './sections/History';
import Dashboard from './sections/Dashboard';
import Analytics from './sections/Analytics';
import Settings from './sections/Settings';
import SkillsLibrary from './sections/SkillsLibrary';
import Badges from './sections/Badges';
import Certificates from './sections/Certificates';

const AssessmentContent = () => {
  const { state, currentTab, startTest } = useTest();

  let mainContent;
  
  if (currentTab === 'dashboard') {
    mainContent = <Dashboard />;
  } else if (currentTab === 'analytics') {
    mainContent = <Analytics />;
  } else if (currentTab === 'profile') {
    mainContent = <Profile />;
  } else if (currentTab === 'history') {
    mainContent = <History />;
  } else if (currentTab === 'settings') {
    mainContent = <Settings />;
  } else if (currentTab === 'skills') {
    mainContent = <SkillsLibrary />;
  } else if (currentTab === 'badges') {
    mainContent = <Badges />;
  } else if (currentTab === 'certificates') {
    mainContent = <Certificates />;
  } else if (currentTab === 'analytics') {
    mainContent = (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', textAlign: 'center' }}>
        <Bot size={64} color="var(--accent)" style={{ marginBottom: '1.5rem', opacity: 0.5 }} />
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Analytics Phase</h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '400px' }}>This segment is currently undergoing structural synchronization. Full functionality will be restored in the next update.</p>
      </div>
    );
  } else if (state.completed) {
    mainContent = <Report />;
  } else if (currentTab === 'assessments') {
    if (state.currentSectionIndex === -1 && !state.completed) {
      mainContent = (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', textAlign: 'center' }}>
          <div style={{ background: 'var(--accent)', padding: '1.5rem', borderRadius: '50%', marginBottom: '2rem' }}>
            <Bot size={48} color="#fff" />
          </div>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--primary-900)' }}>Ready for your English Assessment?</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '500px', marginBottom: '2rem', fontSize: '1.1rem' }}>
            This test evaluates your Listening, Speaking, Reading, and Writing skills.
          </p>
          <button 
            onClick={() => startTest("Candidate")}
            style={{ padding: '1rem 2rem', fontSize: '1.1rem', fontWeight: 800, borderRadius: 'var(--radius-lg)', background: 'var(--accent)', color: '#fff', border: 'none', cursor: 'pointer', boxShadow: '0 8px 20px rgba(37, 99, 235, 0.3)' }}
          >
            Start Assessment Now
          </button>
        </div>
      );
    } else {
      mainContent = (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Header />
          <div style={{ flex: 1, marginTop: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            <SectionManager />
          </div>
        </div>
      );
    }
  } else {
    mainContent = <Dashboard />;
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-area">
        <TopNav />
        <main className="content-container fade-in">
          {mainContent}
        </main>
      </div>
    </div>
  );
};

function App() {
  const { state, setHasEntered } = useTest();

  // Official fix: Wrap everything in a single provider to ensure
  // that 'userName' and 'attemptId' are preserved when switching screens.
  return (
    <>
      {!state.hasEntered ? (
        <Landing onEnter={() => setHasEntered(true)} />
      ) : (
        <AssessmentContent />
      )}
    </>
  );
}

const Root = () => (
  <TestProvider>
    <PracticeProvider>
      <App />
    </PracticeProvider>
  </TestProvider>
);

export default Root;
