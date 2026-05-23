import React from 'react';
import { useTest } from '../context/TestContext';
import { History as HistoryIcon, Award, Calendar, ChevronRight, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

const History = () => {
  const { state, setCurrentTab, viewPastReport } = useTest();
  const history = state.history || [];

  return (
    <div className="fade-in" style={{ paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.04em', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
            <HistoryIcon size={36} color="var(--accent)" /> Assessment History
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.05rem', marginTop: '0.25rem' }}>Review your past performance telemetry and longitudinal growth metrics.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search by Exam ID..."
              style={{
                padding: '0 1rem 0 2.75rem',
                height: '46px',
                width: '260px',
                fontSize: '0.95rem',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                background: '#fff',
                color: '#0f172a',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                transition: 'all 0.2s ease',
                outline: 'none'
              }}
              onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.15)'; }}
              onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = '0 2px 6px rgba(0,0,0,0.02)'; }}
            />
          </div>
          <button
            style={{
              height: '46px',
              padding: '0 1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '0.95rem',
              fontWeight: 600,
              color: '#475569',
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.color = '#0f172a'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#475569'; }}
          >
            <Filter size={18} /> Advanced Filters
          </button>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="card" style={{ padding: '5rem', textAlign: 'center', borderStyle: 'dashed' }}>
          <HistoryIcon size={48} color="var(--text-muted)" style={{ marginBottom: '1.5rem', opacity: 0.3 }} />
          <h3 style={{ marginBottom: '0.75rem' }}>No Assessment Data Detected</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 2rem' }}>Complete your first intelligence audit to begin tracking your professional skill trajectory.</p>
          <button className="btn btn-primary" onClick={() => setCurrentTab('dashboard')}>Begin New Assessment</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {history.map((record, i) => (
            <motion.div
              key={record.studentInfo.attemptId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card"
              onClick={() => viewPastReport(record)}
              onMouseOver={e => e.currentTarget.style.borderColor = 'var(--accent)'}
              onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border)'}
              style={{ padding: '1.5rem 2rem', display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 100px', alignItems: 'center', gap: '2rem', cursor: 'pointer' }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--accent-soft)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Award size={18} />
                  </div>
                  <h4 style={{ fontSize: '1.1rem' }}>{record.overallScore}% Proficiency</h4>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '2.75rem' }}>ID: {record.studentInfo.attemptId}</p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Calendar size={16} color="var(--text-muted)" />
                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{new Date(record.studentInfo.date).toLocaleDateString()}</div>
              </div>

              <div style={{ display: 'flex', gap: '4px' }}>
                {['listening', 'speaking', 'reading', 'writing'].map(skill => (
                  <div
                    key={skill}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      background: record.sectionScores[skill] >= 80 ? 'var(--success)' : record.sectionScores[skill] >= 60 ? 'var(--accent)' : 'var(--warning)',
                      color: '#fff',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title={`${skill}: ${record.sectionScores[skill]}%`}
                  >
                    {skill.charAt(0).toUpperCase()}
                  </div>
                ))}
              </div>

              <div style={{ textAlign: 'right' }}>
                <span className="status-badge" style={{
                  background: record.overallScore >= 80 ? 'var(--success-light)' : 'var(--accent-soft)',
                  color: record.overallScore >= 80 ? 'var(--success)' : 'var(--accent)',
                  fontSize: '0.65rem'
                }}>
                  {record.overallScore >= 80 ? 'Elite' : record.overallScore >= 60 ? 'Certified' : 'Developing'}
                </span>
              </div>

              <div style={{ textAlign: 'right' }}>
                <button className="btn-ghost" style={{ padding: '8px', pointerEvents: 'none' }}>
                  <ChevronRight size={20} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
