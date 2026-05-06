import React from 'react';
import { motion } from 'framer-motion';

const getSectionStatus = (score) => {
  if (score >= 80) return { label: 'Elite', cefr: 'C1/C2' };
  if (score >= 60) return { label: 'Certified', cefr: 'B2' };
  if (score >= 40) return { label: 'Developing', cefr: 'B1' };
  return { label: 'Beginner', cefr: 'A1/A2' };
};

const PracticeReport = ({ practiceResults, sectionId }) => {
  if (!practiceResults) return null;
  const score = practiceResults.overallScore || 0;
  const status = getSectionStatus(score);
  
  const sectionName = sectionId ? sectionId.charAt(0).toUpperCase() + sectionId.slice(1) : "Practice";

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem', color: 'var(--text-main)' }}>
        {sectionName} Practice Results
      </h3>
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{
          background: '#2544c4',
          borderRadius: '16px',
          padding: '2.5rem 4rem',
          color: '#fff',
          textAlign: 'center',
          boxShadow: '0 10px 25px rgba(37, 68, 196, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minWidth: '320px'
        }}
      >
        <p style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem', color: 'rgba(255,255,255,0.8)' }}>
          SECTION SCORE
        </p>
        <h1 style={{ fontSize: '5rem', fontWeight: 900, margin: '0 0 1rem 0', lineHeight: 1 }}>
          {score}%
        </h1>
        <div style={{
          background: 'rgba(255, 255, 255, 0.2)',
          padding: '8px 24px',
          borderRadius: '8px',
          fontWeight: 700,
          fontSize: '1rem',
          width: '100%'
        }}>
          {status.label} ({status.cefr})
        </div>
      </motion.div>
    </div>
  );
};

export default PracticeReport;
