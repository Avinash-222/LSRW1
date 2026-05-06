import React from 'react';
import { Bell, Search, Circle, User, Settings, Command } from 'lucide-react';
import { useTest } from '../context/TestContext';

const TopNav = () => {
  const { state, completeTest, setCurrentTab } = useTest();

  return (
    <nav className="top-nav">
      <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', flex: 1 }}>
        <div style={{ position: 'relative', maxWidth: '440px', width: '100%' }}>
          <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search resources (CMD + K)" 
            className="input-field"
            style={{ 
              paddingLeft: '3rem', 
              height: '44px',
              background: 'var(--bg-app)',
              border: '1px solid transparent',
              fontSize: '0.875rem'
            }} 
          />
          <div style={{ 
            position: 'absolute', 
            right: '12px', 
            top: '50%', 
            transform: 'translateY(-50%)',
            padding: '4px 8px',
            background: '#fff',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            fontSize: '10px',
            fontWeight: 800,
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '2px'
          }}>
            <Command size={10} />
            <span>K</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {/* Global Submit Button - Only visible during active test */}
        {state.currentSectionIndex >= 0 && !state.completed && (
          <button 
            className="btn btn-primary" 
            onClick={() => {
              if (window.confirm("Are you sure you want to end the exam now? Your final report will be generated immediately with current progress.")) {
                completeTest({});
              }
            }}
            style={{ 
              height: '38px', 
              padding: '0 1.25rem', 
              fontSize: '0.8rem', 
              background: 'var(--error)', 
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)' 
            }}
          >
            Submit Exam
          </button>
        )}


        <button className="btn-ghost" style={{ position: 'relative', width: '40px', height: '40px', borderRadius: '50%', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Bell size={18} />
          <span style={{ position: 'absolute', top: '10px', right: '10px', width: '6px', height: '6px', background: 'var(--error)', borderRadius: '50%' }}></span>
        </button>

        <div style={{ width: '1px', height: '24px', background: 'var(--border)' }}></div>

        <div 
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', paddingLeft: '0.50rem', paddingRight: '0.50rem', borderRadius: '30px', transition: 'background 0.2s', padding: '4px' }}
          className="hover:bg-gray-100"
          onClick={() => setCurrentTab('profile')}
        >
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 10px rgba(6, 182, 212, 0.3)' }}>
             <User size={18} color="#fff" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', marginRight: '8px' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', lineHeight: 1.2 }}>
              {state.user?.firstName ? `${state.user.firstName} ${state.user.lastName || ''}` : (state.userName || 'Guest User')}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {state.user ? 'Candidate' : 'Pro Member'}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
