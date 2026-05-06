import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

const isBadgeUnlocked = (skill, difficulty, attemptsData) => {
  const idPrefix = skill.charAt(0);
  const levelPrefix = difficulty.charAt(0);
  const test1 = attemptsData[`${idPrefix}_${levelPrefix}_01`] || 0;
  const test2 = attemptsData[`${idPrefix}_${levelPrefix}_02`] || 0;
  const test3 = attemptsData[`${idPrefix}_${levelPrefix}_03`] || 0;
  
  return test1 >= 1 && test2 >= 1 && test3 >= 1;
};

const colorMap = {
  Listening: {
    Easy: { c1: '#60a5fa', c2: '#3b82f6', text: '#2563eb', ribbon: '#3b82f6', ribbonDark: '#2563eb' },
    Medium: { c1: '#2dd4bf', c2: '#14b8a6', text: '#0d9488', ribbon: '#14b8a6', ribbonDark: '#0f766e' },
    Hard: { c1: '#818cf8', c2: '#4f46e5', text: '#4338ca', ribbon: '#4f46e5', ribbonDark: '#3730a3' }
  },
  Speaking: {
    Easy: { c1: '#c084fc', c2: '#a855f7', text: '#9333ea', ribbon: '#a855f7', ribbonDark: '#7e22ce' },
    Medium: { c1: '#a855f7', c2: '#9333ea', text: '#7e22ce', ribbon: '#9333ea', ribbonDark: '#6b21a8' },
    Hard: { c1: '#8b5cf6', c2: '#6d28d9', text: '#5b21b6', ribbon: '#6d28d9', ribbonDark: '#4c1d95' }
  },
  Reading: {
    Easy: { c1: '#f472b6', c2: '#ec4899', text: '#db2777', ribbon: '#ec4899', ribbonDark: '#be185d' },
    Medium: { c1: '#fb7185', c2: '#f43f5e', text: '#e11d48', ribbon: '#f43f5e', ribbonDark: '#be123c' },
    Hard: { c1: '#f87171', c2: '#ef4444', text: '#dc2626', ribbon: '#ef4444', ribbonDark: '#b91c1c' }
  },
  Writing: {
    Easy: { c1: '#fb923c', c2: '#f97316', text: '#ea580c', ribbon: '#f97316', ribbonDark: '#c2410c' },
    Medium: { c1: '#fbbf24', c2: '#f59e0b', text: '#d97706', ribbon: '#f59e0b', ribbonDark: '#b45309' },
    Hard: { c1: '#facc15', c2: '#eab308', text: '#ca8a04', ribbon: '#eab308', ribbonDark: '#a16207' }
  }
};

const badgesList = [
  { skill: 'Listening', difficulty: 'Easy' },
  { skill: 'Listening', difficulty: 'Medium' },
  { skill: 'Listening', difficulty: 'Hard' },
  { skill: 'Speaking', difficulty: 'Easy' },
  { skill: 'Speaking', difficulty: 'Medium' },
  { skill: 'Speaking', difficulty: 'Hard' },
  { skill: 'Reading', difficulty: 'Easy' },
  { skill: 'Reading', difficulty: 'Medium' },
  { skill: 'Reading', difficulty: 'Hard' },
  { skill: 'Writing', difficulty: 'Easy' },
  { skill: 'Writing', difficulty: 'Medium' },
  { skill: 'Writing', difficulty: 'Hard' }
];

const MedalIcon = ({ ribbon, ribbonDark }) => (
  <svg width="100" height="100" viewBox="0 0 100 100" style={{ zIndex: 2, filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.15))' }}>
    <defs>
      <linearGradient id="goldMedal" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="50%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
      <linearGradient id="goldInnerMedal" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="100%" stopColor="#f59e0b" />
      </linearGradient>
    </defs>
    <g>
      {/* V Ribbon */}
      <path d="M22,-5 L42,45 L50,50 L30,-5 Z" fill={ribbonDark} />
      <path d="M78,-5 L58,45 L50,50 L70,-5 Z" fill={ribbon} />
      {/* Medal Background Ring */}
      <circle cx="50" cy="60" r="32" fill="#d97706" />
      {/* Medal */}
      <circle cx="50" cy="60" r="30" fill="url(#goldMedal)" />
      <circle cx="50" cy="60" r="22" fill="url(#goldInnerMedal)" />
      {/* Crown icon inside medal */}
      <path d="M38,55 L42,68 L58,68 L62,55 L54,60 L50,50 L46,60 Z" fill="#b45309" />
    </g>
  </svg>
);

const TrophyIcon = () => (
  <svg width="100" height="100" viewBox="0 0 100 100" style={{ zIndex: 2, filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.15))' }}>
    <defs>
      <linearGradient id="goldTrophy" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="30%" stopColor="#fbbf24" />
        <stop offset="70%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
      <linearGradient id="goldInnerTrophy" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="100%" stopColor="#f59e0b" />
      </linearGradient>
    </defs>
    <g>
      {/* Base Bottom */}
      <path d="M30,95 L70,95 L65,85 L35,85 Z" fill="url(#goldTrophy)" />
      {/* Base Neck */}
      <path d="M40,85 L60,85 L54,50 L46,50 Z" fill="url(#goldInnerTrophy)" />
      {/* Base Top */}
      <path d="M42,50 L58,50 L62,45 L38,45 Z" fill="url(#goldTrophy)" />
      {/* Star positioned on top */}
      <g transform="translate(0, -5)">
        <path d="M50,5 L58,30 L83,30 L63,45 L70,72 L50,58 L30,72 L37,45 L17,30 L42,30 Z" fill="url(#goldTrophy)" />
        <path d="M50,15 L55,33 L72,33 L58,45 L64,64 L50,53 L36,64 L42,45 L28,33 L45,33 Z" fill="url(#goldInnerTrophy)" />
      </g>
    </g>
  </svg>
);

const Star = ({ top, left, size = 10, color }) => (
  <svg style={{ position: 'absolute', top, left, width: size, height: size, opacity: 0.3 }} viewBox="0 0 24 24">
    <path fill={color} d="M12 0 L14.59 9.41 L24 12 L14.59 14.59 L12 24 L9.41 14.59 L0 12 L9.41 9.41 Z" />
  </svg>
);

const Circle = ({ top, left, size = 4, color }) => (
  <div style={{ position: 'absolute', top, left, width: size, height: size, borderRadius: '50%', backgroundColor: color, opacity: 0.3 }} />
);

const DecorativeElements = ({ color }) => (
  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: '35%', pointerEvents: 'none', overflow: 'hidden' }}>
    <Star top="8%" left="15%" size={14} color={color} />
    <Star top="22%" left="82%" size={18} color={color} />
    <Star top="45%" left="12%" size={10} color={color} />
    <Star top="15%" left="65%" size={12} color={color} />
    <Circle top="18%" left="30%" size={6} color={color} />
    <Circle top="38%" left="85%" size={5} color={color} />
    <Circle top="28%" left="10%" size={4} color={color} />
    <Circle top="10%" left="85%" size={4} color={color} />
  </div>
);

const WaveBackground = ({ color1, color2, id }) => (
  <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '35%', zIndex: 0 }}>
    <svg width="100%" height="100%" viewBox="0 0 400 150" preserveAspectRatio="none">
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color1} />
          <stop offset="100%" stopColor={color2} />
        </linearGradient>
      </defs>
      <path d="M0,40 C150,80 250,0 400,40 L400,150 L0,150 Z" fill={`url(#${id})`} />
    </svg>
  </div>
);

const BadgeCard = ({ skill, difficulty, index, isUnlocked }) => {
  const isHard = difficulty === 'Hard';
  const colors = colorMap[skill][difficulty];
  const cardId = `${skill}-${difficulty}`.toLowerCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isUnlocked ? 1 : 0.4, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      style={{
        background: '#fff',
        borderRadius: '20px',
        boxShadow: isUnlocked ? '0 10px 25px rgba(0,0,0,0.08)' : 'none',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '360px',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        cursor: isUnlocked ? 'default' : 'not-allowed'
      }}
      onMouseEnter={(e) => {
        if (!isUnlocked) return;
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.boxShadow = `0 20px 30px ${colors.c2}30`;
      }}
      onMouseLeave={(e) => {
        if (!isUnlocked) return;
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = isUnlocked ? '0 10px 25px rgba(0,0,0,0.08)' : 'none';
      }}
    >
      <DecorativeElements color={colors.text} />

      {!isUnlocked && (
        <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 10, color: '#94a3b8' }}>
          <Lock size={24} />
        </div>
      )}

      <div style={{ padding: '24px 20px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, flex: 1, width: '100%' }}>
        {isHard ? <TrophyIcon /> : <MedalIcon ribbon={colors.ribbon} ribbonDark={colors.ribbonDark} />}
        
        <p style={{ 
          fontSize: '0.75rem', 
          fontWeight: 800, 
          textTransform: 'uppercase', 
          letterSpacing: '0.1em', 
          color: colors.text, 
          marginTop: '16px',
          opacity: 0.8
        }}>
          Congratulations
        </p>

        <h3 style={{ 
          fontSize: '1.25rem', 
          fontWeight: 800, 
          marginTop: '4px', 
          color: colors.text,
          textAlign: 'center' 
        }}>
          {skill} - {difficulty}
        </h3>
        
        <p style={{ 
          fontSize: '0.85rem', 
          color: '#6B7280', 
          marginTop: '8px', 
          textAlign: 'center',
          fontWeight: 500,
          maxWidth: '90%',
          lineHeight: '1.4'
        }}>
          You have completed 3 {difficulty.toLowerCase()} {skill.toLowerCase()} tests
        </p>
      </div>

      <WaveBackground color1={colors.c1} color2={colors.c2} id={`grad-${cardId}`} />

      <div style={{ height: '35%', width: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 1, paddingBottom: '24px', position: 'absolute', bottom: 0 }}>
        <button 
          disabled={!isUnlocked}
          style={{
            background: 'transparent',
            border: '2px solid rgba(255,255,255,0.8)',
            color: '#fff',
            borderRadius: '999px',
            padding: '8px 32px',
            fontSize: '0.95rem',
            fontWeight: 700,
            cursor: isUnlocked ? 'pointer' : 'not-allowed',
            opacity: isUnlocked ? 1 : 0.5,
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
          }}
          onMouseEnter={(e) => {
            if (!isUnlocked) return;
            e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.1)';
          }}
          onMouseLeave={(e) => {
            if (!isUnlocked) return;
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
          }}
        >
          Share
        </button>
      </div>
    </motion.div>
  );
};

const Badges = () => {
  const [attemptsData, setAttemptsData] = useState({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem("lsrw_practice_attempts");
      if (saved) setAttemptsData(JSON.parse(saved));
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <div style={{ 
      background: '#F5F7FA', 
      minHeight: '100%', 
      padding: '2rem'
    }}>
      <style>
        {`
          .badges-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 24px;
            width: 100%;
          }
          @media (max-width: 1200px) {
            .badges-grid { grid-template-columns: repeat(3, 1fr); }
          }
          @media (max-width: 900px) {
            .badges-grid { grid-template-columns: repeat(2, 1fr); }
          }
          @media (max-width: 600px) {
            .badges-grid { grid-template-columns: 1fr; }
          }
        `}
      </style>
      
      <div className="badges-grid">
        {badgesList.map((badge, index) => {
          const unlocked = isBadgeUnlocked(badge.skill, badge.difficulty, attemptsData);
          return (
            <BadgeCard 
              key={`${badge.skill}-${badge.difficulty}`} 
              skill={badge.skill} 
              difficulty={badge.difficulty} 
              index={index} 
              isUnlocked={unlocked} 
            />
          );
        })}
      </div>
    </div>
  );
};

export default Badges;
