import React, { useState, useEffect } from 'react';
import { useTest } from '../context/TestContext';
import Listening from './Listening';
import Speaking from './Speaking';
import Reading from './Reading';
import Writing from './Writing';
import { ChevronRight, Info, AlertCircle, Headphones, MessageSquare, Glasses, PenTool, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SectionManager = () => {
  const { currentSection, state, isPracticing, stopPractice } = useTest();
  const [showInstructions, setShowInstructions] = useState(true);

  useEffect(() => {
    setShowInstructions(true);
  }, [state.currentSectionIndex, isPracticing, state.practiceSectionId]);

  const startSection = () => setShowInstructions(false);

  const sectionIcons = {
    listening: { icon: Headphones, label: 'Listening', color: '#8b5cf6', activeBg: '#ede9fe', border: '#7c3aed' },
    speaking: { icon: MessageSquare, label: 'Speaking', color: '#f97316', activeBg: '#ffedd5', border: '#ea580c' },
    reading: { icon: Glasses, label: 'Reading', color: '#10b981', activeBg: '#d1fae5', border: '#059669' },
    writing: { icon: PenTool, label: 'Writing', color: '#3b82f6', activeBg: '#dbeafe', border: '#2563eb' }
  };

  const sectionIconsWithArrow = { ...sectionIcons, back: { icon: ArrowLeft, label: 'Back', color: '#64748b' } };

  if (showInstructions) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%', paddingBottom: '4rem' }}>
        <motion.div 
          key={`instr-${state.currentSectionIndex}-${isPracticing}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="assessment-card" 
          style={{ maxWidth: '800px', width: '100%', padding: '2.5rem', display: 'flex', flexDirection: 'column' }}
        >
          {/* Icons row from photo 1 - Hide in Practice Mode to focus on the section */}
          {!isPracticing && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
              {['listening', 'speaking', 'reading', 'writing'].map(key => {
                const item = sectionIcons[key];
                const isActive = currentSection?.id === key;
                if (!item) return null;
                const Icon = item.icon;
                return (
                  <div key={key} style={{ 
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', 
                    opacity: isActive ? 1 : 0.6, 
                    transform: isActive ? 'scale(1.15)' : 'scale(1)', 
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)' 
                  }}>
                    <div style={{ 
                      width: '80px', height: '80px', borderRadius: '50%', 
                      background: isActive ? item.activeBg : '#f8fafc', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', 
                      border: isActive ? `3px solid ${item.border}` : '2px solid transparent',
                      boxShadow: isActive ? `0 8px 20px ${item.color}40` : 'none',
                      transition: 'all 0.3s ease'
                    }}>
                      <Icon size={36} color={isActive ? item.border : item.color} strokeWidth={isActive ? 2.5 : 2} />
                    </div>
                    <span style={{ 
                      fontWeight: isActive ? 800 : 600, 
                      color: isActive ? item.border : 'var(--text-muted, #64748b)', 
                      fontSize: '1rem', letterSpacing: '0.5px' 
                    }}>
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex items-center gap-3 mb-6">
            <div style={{ color: 'var(--blue, #0B2447)' }}><Info size={32} /></div>
            <h1 style={{ fontSize: '2rem', color: 'var(--text-main)' }}>{currentSection?.name || 'Section'} Section</h1>
          </div>

          <div style={{ 
            padding: '2rem', 
            background: 'var(--blueLighter, #e0f2fe)', 
            borderRadius: 'var(--radius-md)', 
            borderLeft: '4px solid var(--blue, #0B2447)',
            marginBottom: '2.5rem'
          }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--blue, #0B2447)' }}>Read Instructions Carefully</h3>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '1.5rem', color: '#1e293b' }}>{currentSection?.instructions || 'Follow the prompts to complete this module.'}</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div className="flex gap-2 items-center" style={{ fontSize: '0.95rem', color: '#334155' }}>
                <span style={{ color: 'var(--blue, #0B2447)', fontWeight: 800 }}>•</span>
                <span>Each question must be answered before proceeding.</span>
              </div>
              <div className="flex gap-2 items-center" style={{ fontSize: '0.95rem', color: '#334155' }}>
                <span style={{ color: 'var(--blue, #0B2447)', fontWeight: 800 }}>•</span>
                <span>Do not refresh the page during the assessment.</span>
              </div>
              <div className="flex gap-2 items-center" style={{ fontSize: '0.95rem', color: '#334155' }}>
                <span style={{ color: 'var(--blue, #0B2447)', fontWeight: 800 }}>•</span>
                <span>Voice input is required for this section.</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-8" style={{ color: 'var(--red, #ce2029)', background: '#fef2f2', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid #fecaca', marginTop: 'auto' }}>
            <AlertCircle size={20} />
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Note: Your performance is being analyzed for fluency and accuracy.</span>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            {isPracticing && (
              <button 
                className="btn" 
                style={{ flex: 1, height: '56px', background: '#f1f5f9', color: '#64748b', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', border: '1px solid #e2e8f0' }} 
                onClick={stopPractice}
              >
                <ArrowLeft size={20} />
                Back to Practice
              </button>
            )}
            <button className="btn btn-primary" style={{ flex: isPracticing ? 2 : 1, height: '56px', background: 'var(--blue, #0B2447)' }} onClick={startSection}>
              Start {isPracticing ? 'Practice' : (currentSection?.name || 'Module')} Module
              <ChevronRight size={20} />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!currentSection) return null;

  return (
    <AnimatePresence mode="wait">
      {currentSection.id === 'listening' && <Listening key="listening" />}
      {currentSection.id === 'speaking' && <Speaking key="speaking" />}
      {currentSection.id === 'reading' && <Reading key="reading" />}
      {currentSection.id === 'writing' && <Writing key="writing" />}
    </AnimatePresence>
  );
};

export default SectionManager;
