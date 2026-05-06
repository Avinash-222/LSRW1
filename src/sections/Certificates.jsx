import React from 'react';
import { Award, Download } from 'lucide-react';
import { motion } from 'framer-motion';

const Certificates = () => {
  return (
    <div style={{ padding: '2rem' }} className="fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
          Your Certificates
        </h2>
        <p style={{ color: 'var(--text-muted)' }}>View and download your official LSRW platform certificates.</p>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          background: '#fff', 
          borderRadius: '20px', 
          border: '1px dashed var(--border)',
          padding: '4rem 2rem',
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
        }}
      >
        <Award size={64} color="#e2e8f0" style={{ marginBottom: '1rem' }} />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>No Certificates Unlocked Yet</h3>
        <p style={{ color: 'var(--text-muted)', maxWidth: '450px', lineHeight: '1.6' }}>
          Complete full assessments and reach proficiency milestones to earn official, verified certificates that you can share with the world. Keep practicing!
        </p>
      </motion.div>
    </div>
  );
};

export default Certificates;
