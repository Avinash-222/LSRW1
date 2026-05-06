import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  ChevronRight, 
  Headphones, 
  MessageSquare, 
  Glasses, 
  PenTool,
  Trophy,
  Target,
  Zap,
  BarChart,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTest } from '../context/TestContext';
import { usePractice } from '../context/PracticeContext';
import PracticeSectionManager from './PracticeSectionManager';
import PracticeReport from './PracticeReport';
import PracticeCelebration from './PracticeCelebration';

const SkillsLibrary = () => {
  const { 
    startPractice, 
    practiceState,
    isLoadingQuestions,
    stopPractice
  } = usePractice();
  const { isPracticing, practiceCompleted, practiceResults } = practiceState;


  // 1b. Attempts State Management
  const [attemptsData, setAttemptsData] = useState(() => {
    try {
      const saved = localStorage.getItem("lsrw_practice_attempts");
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // Track the ID of the current practice session
  const [currentPracticeId, setCurrentPracticeId] = useState(null);

  // 2. Mock Data Generation
  const sections = ['Listening', 'Speaking', 'Reading', 'Writing'];
  const levels = ['Easy', 'Medium', 'Hard'];
  
  const initialData = useMemo(() => {
    const data = [];
    sections.forEach(section => {
      let prevId = null;
      levels.forEach(level => {
        for (let i = 1; i <= 3; i++) {
          const idPrefix = section.charAt(0);
          const levelPrefix = level.charAt(0);
          const id = `${idPrefix}_${levelPrefix}_0${i}`;
          data.push({
            id,
            section,
            level,
            questions: 10,
            prevId
          });
          prevId = id;
        }
      });
    });
    return data;
  }, []);

  useEffect(() => {
    if (practiceCompleted && currentPracticeId) {
      if (practiceResults && practiceResults.overallScore >= 60) {
        setAttemptsData(prev => {
          const currentAttempts = prev[currentPracticeId] || 0;
          if (currentAttempts < 3) {
            const next = { ...prev, [currentPracticeId]: currentAttempts + 1 };
            localStorage.setItem("lsrw_practice_attempts", JSON.stringify(next));
            return next;
          }
          return prev;
        });
      }
    }
  }, [practiceCompleted, currentPracticeId, practiceResults]);

  const handleLaunch = (item) => {
    setCurrentPracticeId(item.id);
    startPractice(item.section.toLowerCase(), item.level);
  };

  // 2. State Management
  const [activeTab, setActiveTab] = useState('Listening');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // 3. Processed Data (All items with derived state)
  const processedData = useMemo(() => {
    return initialData.map(item => {
      const attempts = attemptsData[item.id] || 0;
      const isMaxAttempts = attempts >= 3;
      const prevAttempts = item.prevId ? (attemptsData[item.prevId] || 0) : 1;
      const isUnlocked = prevAttempts > 0;
      const status = attempts >= 1 ? 'Practiced' : 'Not Practiced';
      return { ...item, attempts, isMaxAttempts, isUnlocked, status };
    });
  }, [initialData, attemptsData]);

  // 4. Computed Stats (Dashboard Metrics)
  const stats = useMemo(() => {
    const total = processedData.length;
    const completed = processedData.filter(item => item.status === 'Practiced').length;
    return {
      total,
      completed
    };
  }, [processedData]);

  // 5. Filtering Logic
  const filteredData = useMemo(() => {
    return processedData.filter(item => {
      const matchSection = item.section === activeTab;
      const matchDifficulty = difficultyFilter === 'All' || item.level === difficultyFilter;
      const matchStatus = statusFilter === 'All' || item.status === statusFilter;
      const matchSearch = item.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSection && matchDifficulty && matchStatus && matchSearch;
    });
  }, [processedData, activeTab, difficultyFilter, statusFilter, searchQuery]);

  const resetFilters = () => {
    setDifficultyFilter('All');
    setStatusFilter('All');
    setSearchQuery('');
  };

  // 4. Styles & Badges
  const getDifficultyColor = (level) => {
    switch (level) {
      case 'Easy': return { bg: '#ecfdf5', text: '#10b981', border: '#d1fae5' };
      case 'Medium': return { bg: '#fffbeb', text: '#f59e0b', border: '#fef3c7' };
      case 'Hard': return { bg: '#fef2f2', text: '#ef4444', border: '#fee2e2' };
      default: return { bg: '#f3f4f6', text: '#6b7280', border: '#e5e7eb' };
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Practiced': return { bg: '#78350f', text: '#ffffff', border: '#78350f' }; // Brown as requested
      case 'Not Practiced': return { bg: '#f3f4f6', text: '#6b7280', border: '#e5e7eb' };
      default: return { bg: '#f3f4f6', text: '#6b7280', border: '#e5e7eb' };
    }
  };

  const sectionIcons = {
    Listening: <Headphones size={20} />,
    Speaking: <MessageSquare size={20} />,
    Reading: <Glasses size={20} />,
    Writing: <PenTool size={20} />
  };

  const sectionColors = {
    Listening: '#8b5cf6',
    Speaking: '#f97316',
    Reading: '#10b981',
    Writing: '#2563eb'
  };

  if (isPracticing) {
    return (
      <div className="practice-container fade-in" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              {activeTab} Practice Session
            </h2>
            <p style={{ color: 'var(--text-muted)' }}>Focus on improving your {activeTab.toLowerCase()} accuracy and fluency.</p>
          </div>
          <button 
            onClick={stopPractice}
            style={{ 
              padding: '0.75rem 1.5rem', 
              borderRadius: '12px', 
              background: '#f8fafc', 
              color: '#64748b', 
              border: '1px solid var(--border)', 
              fontWeight: 700, 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.background = '#f1f5f9'}
            onMouseOut={e => e.currentTarget.style.background = '#f8fafc'}
          >
            <ArrowLeft size={18} />
            Back to Library
          </button>
        </div>

        {practiceCompleted ? (
          practiceResults?.overallScore >= 60 ? (
            <PracticeCelebration practiceResults={practiceResults} sectionId={activeTab} onContinue={stopPractice} />
          ) : (
            <div className="assessment-card" style={{ padding: '3rem', maxWidth: '800px', margin: '0 auto' }}>
               <h2 style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '2rem' }}>Practice Session Results</h2>
               <PracticeReport practiceResults={practiceResults} sectionId={activeTab} />
               <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                  <motion.button 
                    onClick={stopPractice}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{ padding: '1rem 2.5rem', background: 'var(--accent)', color: '#fff', borderRadius: '12px', fontWeight: 800, border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    Try Again 💪
                  </motion.button>
               </div>
            </div>
          )
        ) : (
          <PracticeSectionManager />
        )}
      </div>
    );
  }

  if (isLoadingQuestions) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '1.5rem' }}>
        <div className="loader" style={{ width: '50px', height: '50px', border: '5px solid var(--border)', borderTop: '5px solid var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <p style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '1.25rem' }}>Generating Smart Practice Set...</p>
      </div>
    );
  }

  return (
    <div className="skills-library-container fade-in" style={{ paddingBottom: '2rem' }}>
      {/* Header Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {[
          { label: 'Total Practice', value: `${stats.total} Assets`, icon: <Trophy />, color: '#8b5cf6' },
          { label: 'Completed', value: `${stats.completed} / ${stats.total}`, icon: <Target />, color: '#10b981' },
          { label: 'Live Sessions', value: '3 Active', icon: <Zap />, color: '#f59e0b' },
          { label: 'Current Streak', value: '5 Days', icon: <BarChart />, color: '#3b82f6' }
        ].map((stat, i) => (
          <div key={i} className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid var(--border)' }}>
            <div style={{ background: `${stat.color}15`, color: stat.color, padding: '0.75rem', borderRadius: '12px' }}>
              {stat.icon}
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>{stat.label}</p>
              <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>{stat.value}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Main Container */}
      <div className="card" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)' }}>
        
        {/* Section Tabs */}
        <div style={{ display: 'flex', background: '#f8fafc', borderBottom: '1px solid var(--border)', padding: '0 1rem' }}>
          {sections.map(section => (
            <button
              key={section}
              onClick={() => setActiveTab(section)}
              style={{
                padding: '1.25rem 2rem',
                fontSize: '0.95rem',
                fontWeight: 800,
                color: activeTab === section ? sectionColors[section] : 'var(--text-muted)',
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === section ? `3px solid ${sectionColors[section]}` : '3px solid transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              {sectionIcons[section]}
              {section}
              {activeTab === section && (
                <motion.div layoutId="tab-underline" style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: '3px', background: sectionColors[section] }} />
              )}
            </button>
          ))}
        </div>

        {/* Filters Bar */}
        <div style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '0.6rem 1rem 0.6rem 2.5rem',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  fontSize: '0.875rem',
                  width: '200px',
                  outline: 'none',
                  background: 'var(--bg-app)'
                }}
              />
            </div>

            {/* Difficulty Filter */}
            <select 
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              style={{
                padding: '0.6rem 1rem',
                borderRadius: '10px',
                border: '1px solid var(--border)',
                fontSize: '0.875rem',
                outline: 'none',
                background: 'var(--bg-app)',
                fontWeight: 600,
                color: 'var(--text-body)'
              }}
            >
              <option value="All">All Difficulty</option>
              {levels.map(l => <option key={l} value={l}>{l}</option>)}
            </select>

            {/* Status Filter */}
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '0.6rem 1rem',
                borderRadius: '10px',
                border: '1px solid var(--border)',
                fontSize: '0.875rem',
                outline: 'none',
                background: 'var(--bg-app)',
                fontWeight: 600,
                color: 'var(--text-body)'
              }}
            >
              <option value="All">All Status</option>
              <option value="Practiced">Practiced</option>
              <option value="Not Practiced">Not Practiced</option>
            </select>

            {/* Reset Button */}
            <button 
              onClick={resetFilters}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem', 
                background: 'transparent', border: '1px solid var(--border)', borderRadius: '10px',
                fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', cursor: 'pointer'
              }}
            >
              <RotateCcw size={14} /> Reset
            </button>
          </div>

          <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600 }}>
            Showing <strong>{filteredData.length}</strong> Assessments
          </div>
        </div>

        {/* Table Content */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '1rem 2rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>ID / Assessment Name</th>
                <th style={{ padding: '1rem 2rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Difficulty</th>
                <th style={{ padding: '1rem 2rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Questions</th>
                <th style={{ padding: '1rem 2rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Status</th>
                <th style={{ padding: '1rem 2rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Attempts</th>
                <th style={{ padding: '1rem 2rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {filteredData.length > 0 ? filteredData.map((item, idx) => (
                  <motion.tr 
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.03 }}
                    style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }}
                    onMouseOver={(e) => { e.currentTarget.style.background = '#fcfdfe'; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <td style={{ padding: '1.25rem 2rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ 
                          width: '40px', height: '40px', borderRadius: '10px', 
                          background: `${sectionColors[item.section]}10`, color: sectionColors[item.section],
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          {sectionIcons[item.section]}
                        </div>
                        <div>
                          <p style={{ margin: 0, fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem' }}>{item.id}</p>
                          <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.section} Practice Set {idx + 1}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1.25rem 2rem' }}>
                      <span style={{ 
                        padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 800,
                        background: getDifficultyColor(item.level).bg,
                        color: getDifficultyColor(item.level).text,
                        border: `1px solid ${getDifficultyColor(item.level).border}`
                      }}>
                        {item.level}
                      </span>
                    </td>
                    <td style={{ padding: '1.25rem 2rem', fontWeight: 700, color: 'var(--text-body)', fontSize: '0.9rem' }}>
                      {item.questions}
                    </td>
                    <td style={{ padding: '1.25rem 2rem' }}>
                      <span style={{ 
                        padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 800,
                        background: getStatusColor(item.status).bg,
                        color: getStatusColor(item.status).text
                      }}>
                        {item.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '1.25rem 2rem' }}>
                      <span style={{ 
                        padding: '4px 12px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 800,
                        background: '#f8fafc', color: 'var(--text-main)', border: '1px solid var(--border)'
                      }}>
                        {item.attempts}/3
                      </span>
                    </td>
                    <td style={{ padding: '1.25rem 2rem', textAlign: 'right' }}>
                      {item.isMaxAttempts || !item.isUnlocked ? (
                        <button 
                          disabled
                          style={{ 
                            padding: '0.5rem 1rem', borderRadius: '10px', background: '#f1f5f9', 
                            border: '1px solid #e2e8f0', color: '#94a3b8', fontWeight: 800,
                            fontSize: '0.85rem', cursor: 'not-allowed', display: 'inline-flex', alignItems: 'center', gap: '0.5rem'
                          }}
                        >
                          🔒 Locked
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleLaunch(item)}
                          style={{ 
                            padding: '0.5rem 1rem', borderRadius: '10px', background: 'var(--bg-app)', 
                            border: '1px solid var(--border)', color: 'var(--accent)', fontWeight: 800,
                            fontSize: '0.85rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                            transition: 'all 0.2s'
                          }}
                          onMouseOver={(e) => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = '#fff'; }}
                          onMouseOut={(e) => { e.currentTarget.style.background = 'var(--bg-app)'; e.currentTarget.style.color = 'var(--accent)'; }}
                        >
                          Launch <ChevronRight size={14} />
                        </button>
                      )}
                    </td>
                  </motion.tr>
                )) : (
                  <tr>
                    <td colSpan="6" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      <Filter size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                      <p style={{ fontWeight: 600 }}>No assessments found matching the selected filters.</p>
                      <button onClick={resetFilters} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}>Clear All Filters</button>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SkillsLibrary;
