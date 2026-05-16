import React, { useState, useEffect } from 'react';
import { Award, Download, Share2, Eye, Lock, Headphones, Mic, BookOpen, PenTool } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTest } from '../context/TestContext';

const certificatesList = [
  { skill: 'Listening', themeColor: '#1e3a8a' }, // Royal Blue
  { skill: 'Speaking', themeColor: '#7f1d1d' },  // Wine Red
  { skill: 'Reading', themeColor: '#064e3b' },   // Emerald Green
  { skill: 'Writing', themeColor: '#ea580c' }    // Bright Orange
];

const getIconForSkill = (skill) => {
  if (skill === 'Listening') return Headphones;
  if (skill === 'Speaking') return Mic;
  if (skill === 'Reading') return BookOpen;
  return PenTool;
};

const CertificateBackground = ({ color }) => (
  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
    <div style={{ position: 'absolute', inset: 0, background: '#fffcf5' }}></div>
    {/* Curved Corner Gradients */}
    <div style={{ position: 'absolute', top: '-20%', left: '-20%', width: '60%', height: '60%', background: `radial-gradient(circle, ${color}10 0%, transparent 70%)` }}></div>
    <div style={{ position: 'absolute', bottom: '-20%', right: '-20%', width: '60%', height: '60%', background: `radial-gradient(circle, ${color}10 0%, transparent 70%)` }}></div>
    
    {/* Soft transparent circles */}
    <div style={{ position: 'absolute', top: '15%', left: '10%', width: '25%', aspectRatio: '1/1', borderRadius: '50%', border: `1px solid ${color}20` }}></div>
    <div style={{ position: 'absolute', bottom: '20%', right: '15%', width: '20%', aspectRatio: '1/1', borderRadius: '50%', border: `1px solid ${color}20` }}></div>
    
    {/* Minimal dotted texture on top-right */}
    <div style={{ position: 'absolute', top: '5%', right: '5%', width: '150px', height: '150px', backgroundImage: `radial-gradient(${color}20 1px, transparent 1px)`, backgroundSize: '15px 15px', opacity: 0.6 }}></div>

    {/* Left Soundwaves */}
    <div style={{ position: 'absolute', top: '45%', left: '4%', display: 'flex', gap: '6px', opacity: 0.4, alignItems: 'center' }}>
      {[20, 40, 60, 35, 50, 25, 40].map((h, i) => <div key={`l-${i}`} style={{ width: '4px', height: `${h}px`, background: color, borderRadius: '2px' }} />)}
    </div>
    {/* Right Soundwaves */}
    <div style={{ position: 'absolute', top: '45%', right: '4%', display: 'flex', gap: '6px', opacity: 0.4, alignItems: 'center' }}>
      {[30, 50, 25, 60, 40, 20, 45].map((h, i) => <div key={`r-${i}`} style={{ width: '4px', height: `${h}px`, background: color, borderRadius: '2px' }} />)}
    </div>
  </div>
);

const CertificateBorder = () => (
  <div style={{ position: 'absolute', inset: '3%', border: '3px solid #d97706', borderRadius: '16px', zIndex: 1, pointerEvents: 'none' }}>
    <div style={{ position: 'absolute', inset: '4px', border: '1px solid #d97706', borderRadius: '12px', opacity: 0.6 }}></div>
  </div>
);

const CornerDecorations = () => {
  const svg = (rotation) => (
    <svg width="100%" height="100%" viewBox="0 0 30 30" style={{ transform: `rotate(${rotation}deg)` }}>
      <path d="M0,0 L30,0 L30,2 L2,2 L2,30 L0,30 Z" fill="#d97706" />
      <path d="M0,30 A30,30 0 0,0 30,0" fill="none" stroke="#d97706" strokeWidth="2" />
    </svg>
  );
  return (
    <div style={{ position: 'absolute', inset: '2%', pointerEvents: 'none', zIndex: 2 }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '40px', height: '40px' }}>{svg(0)}</div>
      <div style={{ position: 'absolute', top: 0, right: 0, width: '40px', height: '40px' }}>{svg(90)}</div>
      <div style={{ position: 'absolute', bottom: 0, right: 0, width: '40px', height: '40px' }}>{svg(180)}</div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: '40px', height: '40px' }}>{svg(270)}</div>
    </div>
  )
};

const CertificateCard = ({ skill, themeColor, isUnlocked, studentName }) => {
  const Icon = getIconForSkill(skill);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <motion.div
        whileHover={isUnlocked ? { y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' } : {}}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1.414 / 1', // standard landscape
          background: '#fffcf5',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
          overflow: 'hidden',
          filter: isUnlocked ? 'none' : 'grayscale(100%) opacity(0.8)',
          cursor: isUnlocked ? 'pointer' : 'not-allowed',
          transition: 'all 0.3s ease'
        }}
      >
        <CertificateBackground color={themeColor} />
        <CertificateBorder />
        <CornerDecorations />
        
        {/* Main Content SVG overlay for perfect fluid scaling */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none' }}>
          <svg viewBox="0 0 1414 1000" style={{ width: '100%', height: '100%' }}>
            {/* LSRW */}
            <rect x="667" y="120" width="80" height="30" rx="4" fill={themeColor} />
            <text x="707" y="141" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="800" letterSpacing="3">LSRW</text>
            
            <text x="707" y="180" textAnchor="middle" fill="#6b7280" fontSize="12" fontWeight="700" letterSpacing="4">PRACTICE. IMPROVE. SUCCEED.</text>
            
            {/* Navy Serif Font */}
            <text x="707" y="270" textAnchor="middle" fill="#0f172a" fontSize="56" fontFamily='Georgia, "Times New Roman", serif' letterSpacing="6">CERTIFICATE</text>
            
            <text x="707" y="320" textAnchor="middle" fill="#b45309" fontSize="20" fontWeight="700" fontFamily='Georgia, "Times New Roman", serif' letterSpacing="6">OF ACHIEVEMENT</text>
            
            {/* Star and lines */}
            <line x1="600" y1="360" x2="680" y2="360" stroke="#fbbf24" strokeWidth="2" />
            <polygon points="707,352 709,358 715,358 710,362 712,368 707,364 702,368 704,362 699,358 705,358" fill="#fbbf24" />
            <line x1="734" y1="360" x2="814" y2="360" stroke="#fbbf24" strokeWidth="2" />
            
            <text x="707" y="430" textAnchor="middle" fill="#4b5563" fontSize="18" fontStyle="italic">This is proudly awarded to</text>
            
            {/* Student Name */}
            <text x="707" y="530" textAnchor="middle" fill={themeColor} fontSize="64" fontFamily='"Brush Script MT", "Lucida Handwriting", "Great Vibes", cursive'>
              {studentName}
            </text>
            <line x1="400" y1="560" x2="1014" y2="560" stroke={themeColor} strokeOpacity="0.4" strokeWidth="1.5" />
            
            <text x="707" y="620" textAnchor="middle" fill="#4b5563" fontSize="18">for successfully completing</text>

            {/* Ribbon Banner */}
            <g transform="translate(457, 650)">
              <path d="M-10,15 L10,30 L-10,45 Z" fill="#000" opacity="0.3" />
              <path d="M510,15 L490,30 L510,45 Z" fill="#000" opacity="0.3" />
              <path d="M-20,10 L10,10 L10,50 L-20,50 L-5,30 Z" fill={themeColor} filter="brightness(0.7)" />
              <path d="M520,10 L490,10 L490,50 L520,50 L505,30 Z" fill={themeColor} filter="brightness(0.7)" />
              
              <rect x="5" y="0" width="490" height="60" fill={themeColor} />
              <rect x="5" y="4" width="490" height="2" fill="#fcd34d" />
              <rect x="5" y="54" width="490" height="2" fill="#fcd34d" />
              <path d="M5,0 L495,0 L495,30 L5,30 Z" fill="#ffffff" opacity="0.15" />
              
              <text x="250" y="38" textAnchor="middle" fill="#fff" fontSize="26" fontWeight="800" letterSpacing="4">{`${skill} Skills`.toUpperCase()}</text>
            </g>
            
            <text x="707" y="770" textAnchor="middle" fill="#4b5563" fontSize="16" fontStyle="italic">Demonstrating dedication and consistency in improving language proficiency.</text>
          </svg>
        </div>

        {/* Left Skill Illustration */}
        <div style={{
          position: 'absolute', bottom: '8%', left: '6%',
          width: '16%', aspectRatio: '1/1',
          background: `linear-gradient(135deg, #fff 0%, ${themeColor}15 100%)`,
          borderRadius: '20%',
          border: `2px solid ${themeColor}40`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 10px 30px ${themeColor}20`,
          transform: 'rotate(-5deg)',
          zIndex: 6
        }}>
          <Icon size="55%" color={themeColor} strokeWidth={1.5} style={{ filter: `drop-shadow(0 4px 6px ${themeColor}40)` }} />
        </div>

        {/* Right Medal */}
        <div style={{
          position: 'absolute', top: '8%', right: '6%',
          width: '12%', aspectRatio: '1/1',
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${themeColor} 0%, ${themeColor}dd 100%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '4px solid #fbbf24',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          zIndex: 10
        }}>
          <div style={{ width: '80%', height: '80%', borderRadius: '50%', border: '1px dashed #fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size="50%" color="#fff" strokeWidth={2} />
          </div>
          <svg style={{ position: 'absolute', bottom: '-25%', zIndex: -1 }} width="60%" height="40%" viewBox="0 0 40 30">
            <path d="M5,0 L15,30 L20,20 L25,30 L35,0 Z" fill={themeColor} filter="brightness(0.8)" />
          </svg>
        </div>

        {/* Bottom Gold Badge */}
        <div style={{ position: 'absolute', bottom: '6%', left: '50%', transform: 'translateX(-50%)', width: '10%', aspectRatio: '0.8/1', zIndex: 10 }}>
          <svg viewBox="0 0 100 120" width="100%" height="100%" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }}>
            <defs>
              <linearGradient id={`goldSeal-${skill}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
            </defs>
            <path d="M30,60 L20,110 L50,95 L80,110 L70,60 Z" fill="#9a3412" />
            <path d="M35,60 L28,100 L50,85 L72,100 L65,60 Z" fill="#ea580c" />
            <circle cx="50" cy="45" r="40" fill="#b45309" />
            <circle cx="50" cy="45" r="38" fill={`url(#goldSeal-${skill})`} />
            <circle cx="50" cy="45" r="30" fill="none" stroke="#78350f" strokeWidth="1" strokeDasharray="2,2" />
            <path d="M40,48 L46,55 L62,35" fill="none" stroke="#78350f" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {!isUnlocked && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 20, background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <Lock size={48} color="#94a3b8" />
            <p style={{ marginTop: '10px', fontWeight: 700, color: '#475569', fontSize: '1.2rem', padding: '0 20px', textAlign: 'center' }}>
              Complete Easy, Medium & Hard levels to unlock
            </p>
          </div>
        )}
      </motion.div>

      {/* Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
        <button 
          disabled={!isUnlocked}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '6px', 
            padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', 
            background: '#fff', color: isUnlocked ? themeColor : '#94a3b8', 
            fontWeight: 600, cursor: isUnlocked ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s', fontSize: '0.9rem'
          }}
          className={isUnlocked ? "hover:bg-gray-50" : ""}
        >
          <Eye size={16} /> View Certificate
        </button>
        <button 
          disabled={!isUnlocked}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '6px', 
            padding: '8px 16px', borderRadius: '8px', border: 'none', 
            background: isUnlocked ? themeColor : '#e2e8f0', color: '#fff', 
            fontWeight: 600, cursor: isUnlocked ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s', fontSize: '0.9rem'
          }}
          className={isUnlocked ? "hover:opacity-90" : ""}
        >
          <Download size={16} /> Download
        </button>
        <button 
          disabled={!isUnlocked}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '6px', 
            padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', 
            background: '#fff', color: isUnlocked ? '#475569' : '#94a3b8', 
            fontWeight: 600, cursor: isUnlocked ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s', fontSize: '0.9rem'
          }}
          className={isUnlocked ? "hover:bg-gray-50" : ""}
        >
          <Share2 size={16} /> Share
        </button>
      </div>
    </div>
  );
};

const Certificates = () => {
  const { state } = useTest();
  const [attemptsData, setAttemptsData] = useState({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem("lsrw_practice_attempts");
      if (saved) setAttemptsData(JSON.parse(saved));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const isCertificateUnlocked = (skill) => {
    const idPrefix = skill.charAt(0);
    const levels = ['E', 'M', 'H'];
    for (let lvl of levels) {
      if (!attemptsData[`${idPrefix}_${lvl}_01`] || 
          !attemptsData[`${idPrefix}_${lvl}_02`] || 
          !attemptsData[`${idPrefix}_${lvl}_03`]) {
        return false;
      }
    }
    return true;
  };

  const studentName = state.user?.firstName 
    ? `${state.user.firstName} ${state.user.lastName || ''}` 
    : (state.userName || 'Guest User');

  return (
    <div style={{ padding: '2rem', background: '#F5F7FA', minHeight: '100%' }} className="fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
          Certificates Section
        </h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
          Complete Easy, Medium, and Hard practice assessments to unlock your official verified certificates.
        </p>
      </div>

      <style>
        {`
          .certs-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 2rem;
            width: 100%;
            max-width: 1400px;
            margin: 0 auto;
          }
          @media (max-width: 1024px) {
            .certs-grid { grid-template-columns: 1fr; }
          }
        `}
      </style>

      <div className="certs-grid">
        {certificatesList.map((cert) => (
          <CertificateCard 
            key={cert.skill}
            skill={cert.skill}
            themeColor={cert.themeColor}
            isUnlocked={isCertificateUnlocked(cert.skill)}
            studentName={studentName}
          />
        ))}
      </div>
    </div>
  );
};

export default Certificates;
