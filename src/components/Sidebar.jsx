import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  FileCheck, 
  Bot, 
  User, 
  Settings,
  ShieldCheck,
  LogOut,
  History,
  Award,
  Trophy
} from 'lucide-react';
import { useTest } from '../context/TestContext';

const Sidebar = () => {
  const { state, currentTab, setCurrentTab, logoutUser } = useTest();
  
  const menuItems = [
    { id: 'dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard', path: '/' },
    { id: 'skills', icon: <BookOpen size={18} />, label: 'Practice', path: '/skills' },
    { id: 'assessments', icon: <FileCheck size={18} />, label: 'Assessments', path: '/assessments' },
    { id: 'history', icon: <History size={18} />, label: 'History', path: '/history' },
    { id: 'badges', icon: <Award size={18} />, label: 'Badges', path: '/badges' },
    { id: 'certificates', icon: <Trophy size={18} />, label: 'Certificates', path: '/certificates' },
  ];

  const bottomItems = [
    { id: 'profile', icon: <User size={18} />, label: 'Profile' },
    { id: 'settings', icon: <Settings size={18} />, label: 'Settings' },
    { id: 'logout', icon: <LogOut size={18} />, label: 'Logout', action: logoutUser },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div style={{ 
          background: 'var(--accent)', 
          color: '#fff', 
          width: '36px', 
          height: '36px', 
          borderRadius: '12px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          boxShadow: '0 8px 16px rgba(44, 104, 246, 0.4)'
        }}>
          <ShieldCheck size={22} fill="var(--accent)" stroke="#fff" strokeWidth={2}/>
        </div>
        <span style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--text-main)' }}>
          LSRW
        </span>
      </div>

      <nav className="sidebar-nav" style={{ marginTop: '1rem' }}>
        {menuItems.map((item) => (
          <div 
            key={item.id} 
            className={`nav-item ${currentTab === item.id ? 'active' : ''}`}
            onClick={() => setCurrentTab(item.id)}
          >
            {item.icon}
            <span>{item.label}</span>
            {currentTab === item.id && <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--accent)', marginLeft: 'auto' }} />}
          </div>
        ))}

        <p style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--primary-600)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '2rem 1.25rem 1rem' }}>System</p>
        {bottomItems.map((item) => (
          <div 
            key={item.id} 
            className={`nav-item ${currentTab === item.id ? 'active' : ''} ${item.id === 'logout' ? 'logout-item' : ''}`}
            onClick={() => {
              if (item.action) {
                item.action();
              } else {
                setCurrentTab(item.id);
              }
            }}
            style={item.id === 'logout' ? { color: '#ef4444' } : {}}
          >
            {item.icon}
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      <div style={{ padding: '1.25rem' }}>
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.5)', 
          padding: '1.25rem', 
          borderRadius: 'var(--radius-lg)', 
          border: '1px solid rgba(0, 0, 0, 0.05)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
        }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--primary-900)', fontWeight: 700, marginBottom: '0.25rem' }}>Pro Membership</p>
          <p style={{ fontSize: '0.7rem', color: 'var(--primary-600)', marginBottom: '1rem', lineHeight: 1.4 }}>Gain access to advanced AI feedback models.</p>
          <button style={{ 
            width: '100%', 
            padding: '0.625rem', 
            fontSize: '0.75rem', 
            fontWeight: 800, 
            background: 'var(--accent)', 
            color: '#fff', 
            border: 'none', 
            borderRadius: 'var(--radius-sm)', 
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => { e.currentTarget.style.filter = 'brightness(1.1)'; }}
          onMouseOut={(e) => { e.currentTarget.style.filter = 'none'; }}
          >
            Upgrade Now
          </button>
        </div>
      </div>

      <div style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderTop: '1px solid rgba(0,0,0,0.05)', marginTop: 'auto' }}>
        <div style={{ 
          width: '32px', 
          height: '32px', 
          borderRadius: '50%', 
          background: 'var(--accent)', 
          color: '#fff', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          fontSize: '0.7rem', 
          fontWeight: 900 
        }}>
          {state.user?.firstName && state.user?.lastName 
            ? `${state.user.firstName[0]}${state.user.lastName[0]}`.toUpperCase() 
            : 'CU'}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-900)', lineHeight: 1 }}>
            {state.user?.firstName ? `${state.user.firstName} ${state.user.lastName?.[0] || ''}.` : 'Candidate'}
          </p>
          <p style={{ fontSize: '0.65rem', color: 'var(--primary-600)' }}>
            {state.user ? 'Candidate' : 'Member'}
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
