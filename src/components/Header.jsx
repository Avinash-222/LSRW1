import React from 'react';
import { useTest, SECTIONS } from '../context/TestContext';
import { CheckCircle2, Circle } from 'lucide-react';
import { motion } from 'framer-motion';

const Header = () => {
  const { currentSection, state } = useTest();

  return (
    <div className="card shadow-md" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 2.5rem', marginBottom: '2.5rem', border: '1px solid var(--border)', background: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
        <div>
          <p style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Phase Identification</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{currentSection?.name || 'Initialization'}</span>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--success)', marginLeft: '4px' }}></div>
          </div>
        </div>

        <div style={{ height: '32px', width: '1px', background: 'var(--border)' }}></div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          {SECTIONS.map((s, idx) => {
            const isCompleted = state.currentSectionIndex > idx;
            const isActive = state.currentSectionIndex === idx;
            
            return (
              <React.Fragment key={s.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', opacity: 1 }}>
                  <div 
                    style={{ 
                      width: '28px', 
                      height: '28px', 
                      borderRadius: '8px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      background: isCompleted ? '#10b981' : (isActive ? 'var(--accent, #3b82f6)' : '#f1f5f9'),
                      color: isCompleted || isActive ? '#fff' : 'var(--text-muted)',
                      border: 'none',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    {isCompleted ? <CheckCircle2 size={16} color="#fff" strokeWidth={2.5} /> : idx + 1}
                  </div>
                  <span style={{ 
                    fontSize: '0.95rem', 
                    fontWeight: isActive || isCompleted ? 700 : 500,
                    color: isActive ? 'var(--blue, #0B2447)' : (isCompleted ? '#64748b' : '#94a3b8'),
                    letterSpacing: '-0.01em'
                  }}>
                    {s.id.charAt(0).toUpperCase() + s.id.slice(1)}
                  </span>
                </div>
                {idx < SECTIONS.length - 1 && (
                  <div style={{ width: '16px', height: '2px', background: 'var(--border-light, #f1f5f9)' }}></div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
        <div style={{ textAlign: 'right', minWidth: '120px' }}>
          <p style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>session progress</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.2rem' }}>
             <p style={{ fontSize: '1rem', fontWeight: 800 }}>{Math.round(((state.currentSectionIndex + 1) / SECTIONS.length) * 100)}%</p>
             <div className="progress-bar" style={{ width: '80px' }}>
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${((state.currentSectionIndex + 1) / SECTIONS.length) * 100}%` }}
                 className="progress-fill" 
               />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
