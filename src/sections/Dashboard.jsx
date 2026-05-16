import React from 'react';
import { useTest } from '../context/TestContext';
import { 
  Headphones, 
  Mic, 
  BookOpen, 
  Edit3, 
  TrendingUp, 
  Award, 
  CheckCircle2, 
  Clock, 
  Play, 
  Activity, 
  Target, 
  ChevronRight,
  Layers,
  Zap,
  Trophy,
  ArrowRight,
  Star,
  Rocket
} from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, label, value, subtext, color, progress }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="card" 
    style={{ 
      padding: '1.5rem', 
      background: '#fff', 
      borderRadius: '24px', 
      border: '1px solid #f1f5f9',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
      <div style={{ 
        width: '56px', 
        height: '56px', 
        borderRadius: '16px', 
        background: `${color}15`, 
        color: color, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        flexShrink: 0 
      }}>
        <Icon size={28} />
      </div>
      <div>
        <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem' }}>{label}</p>
        <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{value}</p>
        <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', margin: 0 }}>{subtext}</p>
      </div>
    </div>
    <div style={{ height: '6px', width: '100%', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden', marginTop: '0.5rem' }}>
      <div style={{ height: '100%', width: `${progress}%`, background: color, borderRadius: '3px' }} />
    </div>
  </motion.div>
);

const PracticeCard = ({ icon: Icon, title, description, color, onClick }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="card" 
    style={{ 
      padding: '1.5rem', 
      background: '#fff', 
      borderRadius: '20px', 
      border: '1px solid #f1f5f9',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
    }}
  >
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
        <div style={{ 
          width: '56px', 
          height: '56px', 
          borderRadius: '12px', 
          background: color, 
          color: '#fff', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          flexShrink: 0 
        }}>
          <Icon size={28} />
        </div>
        <div style={{ flex: 1 }}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0' }}>{title}</h4>
          <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.4, margin: 0 }}>{description}</p>
        </div>
      </div>
      
      <div style={{ alignSelf: 'center', marginTop: 'auto', paddingBottom: '0.5rem' }}>
        <span style={{ 
          background: '#ecfdf5', 
          color: '#10b981', 
          padding: '4px 12px', 
          borderRadius: '20px', 
          fontSize: '0.7rem', 
          fontWeight: 800, 
          textTransform: 'uppercase' 
        }}>READY</span>
      </div>
    </div>

    <button 
      onClick={onClick}
      style={{ 
        width: '100%', 
        padding: '0.75rem', 
        borderRadius: '12px', 
        background: color, 
        color: '#fff', 
        border: 'none', 
        fontSize: '0.9rem', 
        fontWeight: 700, 
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem'
      }}
    >
      Start Practice <ArrowRight size={16} />
    </button>
  </motion.div>
);

const ProgressBarWithStar = ({ label, score, color, icon: Icon }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '130px', flexShrink: 0 }}>
      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: `${color}15`, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={16} />
      </div>
      <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#334155' }}>{label}</span>
    </div>
    
    <div style={{ flex: 1, position: 'relative', height: '8px', background: '#f1f5f9', borderRadius: '4px' }}>
      <div style={{ height: '100%', width: `${score}%`, background: color, borderRadius: '4px', position: 'relative' }}>
        <div style={{ 
          position: 'absolute', 
          right: '-6px', 
          top: '50%', 
          transform: 'translateY(-50%)',
          color: '#f59e0b',
          zIndex: 10
        }}>
          <Star size={14} fill="#f59e0b" />
        </div>
      </div>
    </div>

    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#64748b', width: '50px', textAlign: 'right', flexShrink: 0 }}>
      {score}/100
    </span>
  </div>
);

const Dashboard = () => {
  const { setCurrentTab, state, setSelectedPracticeSkill } = useTest();
  const userName = state.user?.firstName || 'Avinash';

  const handlePracticeClick = (skill) => {
    setSelectedPracticeSkill(skill);
    setCurrentTab('skills');
  };

  const latestReport = state.history && state.history.length > 0 ? state.history[0] : null;
  const scores = latestReport ? latestReport.sectionScores : { listening: 0, speaking: 0, reading: 0, writing: 0 };

  return (
    <div className="fade-in" style={{ paddingBottom: '4rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      
      {/* 0. Hero Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ 
          background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)', 
          borderRadius: '24px', 
          padding: '3.5rem 3rem', 
          position: 'relative', 
          overflow: 'hidden',
          color: '#fff',
          boxShadow: '0 20px 40px rgba(37, 99, 235, 0.15)'
        }}
      >
        {/* Decorative Elements */}
        <div style={{ position: 'absolute', top: '-50px', left: '-50px', width: '200px', height: '200px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', bottom: '-100px', right: '-20px', width: '300px', height: '300px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', top: '30px', right: '40px', opacity: 0.2, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} style={{ width: '4px', height: '4px', background: '#fff', borderRadius: '50%' }}></div>
          ))}
        </div>

        <div style={{ position: 'relative', zIndex: 10 }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, margin: '0 0 1rem 0', letterSpacing: '-0.02em' }}>
            Welcome back, {userName}.
          </h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9, maxWidth: '600px', lineHeight: 1.5, margin: 0 }}>
            Track your communication skill progress and continue improving your LSRW performance.
          </p>
        </div>
      </motion.div>

      {/* 1. Top Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
        <StatCard 
          icon={Award} 
          label="Total Points" 
          value={(state.history || []).reduce((acc, curr) => acc + (curr.overallScore * 10), 0).toLocaleString()} 
          subtext="Points" 
          color="#f59e0b" 
          progress={Math.min(100, ((state.history || []).reduce((acc, curr) => acc + (curr.overallScore * 10), 0) / 10000) * 100)} 
        />
        <StatCard 
          icon={Target} 
          label="Completed" 
          value={`${(state.history || []).length} / 36`} 
          subtext="Assessments" 
          color="#8b5cf6" 
          progress={Math.min(100, ((state.history || []).length / 36) * 100)} 
        />
        <StatCard 
          icon={Zap} 
          label="Current Streak" 
          value="5 Days" 
          subtext="Amazing!" 
          color="#10b981" 
          progress={70} 
        />
        <StatCard 
          icon={Trophy} 
          label="Global Rank" 
          value={latestReport ? (latestReport.overallScore >= 80 ? "Top 5%" : latestReport.overallScore >= 60 ? "Top 15%" : "Top 40%") : "N/A"} 
          subtext="Keep it up!" 
          color="#ef4444" 
          progress={latestReport ? latestReport.overallScore : 0} 
        />
      </div>

      {/* 2. Quick Access Row */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Quick Access – <span style={{ color: 'var(--accent)' }}>Start Practicing</span>
          </h2>
          <button 
            onClick={() => setCurrentTab('skills')}
            style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
          >
            View All <ChevronRight size={16} />
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
          <PracticeCard 
            icon={Headphones} 
            title="Listening" 
            description="Improve your listening skills" 
            color="#4c1d95" 
            onClick={() => handlePracticeClick('Listening')}
          />
          <PracticeCard 
            icon={Mic} 
            title="Speaking" 
            description="Speak with confidence" 
            color="#f97316" 
            onClick={() => handlePracticeClick('Speaking')}
          />
          <PracticeCard 
            icon={BookOpen} 
            title="Reading" 
            description="Read and understand" 
            color="#2563eb" 
            onClick={() => handlePracticeClick('Reading')}
          />
          <PracticeCard 
            icon={Edit3} 
            title="Writing" 
            description="Express your ideas clearly" 
            color="#059669" 
            onClick={() => handlePracticeClick('Writing')}
          />
        </div>
      </div>

      {/* 3. Bottom Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', alignItems: 'start' }}>
        
        {/* Left: Your Progress */}
        <div className="card shadow-sm" style={{ padding: '2rem', background: '#fff', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Your Progress</h3>
          </div>

          <div style={{ 
            marginBottom: '2rem', 
            padding: '1rem 1.5rem', 
            background: 'linear-gradient(90deg, #f5f3ff 0%, #fff 100%)', 
            borderRadius: '16px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            border: '1px solid #ede9fe'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Star size={20} color="#f59e0b" fill="#f59e0b" />
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#4c1d95' }}>
                {latestReport 
                  ? latestReport.overallScore >= 80 ? "You're doing fantastic! Keep shining! ✨" : "Great effort! Keep practicing to improve! 🚀"
                  : "Start your first assessment to track progress! ✨"
                }
              </span>
            </div>
            <Rocket size={24} color="#f59e0b" />
          </div>
          
          <ProgressBarWithStar label="Listening" score={scores.listening} color="#4c1d95" icon={Headphones} />
          <ProgressBarWithStar label="Speaking" score={scores.speaking} color="#f97316" icon={Mic} />
          <ProgressBarWithStar label="Reading" score={scores.reading} color="#2563eb" icon={BookOpen} />
          <ProgressBarWithStar label="Writing" score={scores.writing} color="#059669" icon={Edit3} />
        </div>

        {/* Right: Upcoming Assessment */}
        <div className="card" style={{ padding: '2rem', background: '#fff', borderRadius: '24px', border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Upcoming Assessment</h3>
            <span style={{ background: '#ecfdf5', color: '#10b981', padding: '4px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 800 }}>READY</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 1rem 0' }}>LSRW Core Evaluation</h4>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>
                  <Clock size={16} /> 45 Mins
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>
                  <Layers size={16} /> All 4 Modules
                </div>
              </div>
            </div>

            <button 
              onClick={() => setCurrentTab('assessments')}
              style={{ 
                width: '100%', 
                padding: '1rem', 
                borderRadius: '16px', 
                background: '#2563eb', 
                color: '#fff', 
                border: 'none', 
                fontSize: '1.1rem', 
                fontWeight: 800, 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                boxShadow: '0 8px 16px rgba(37, 99, 235, 0.2)'
              }}
            >
              Start Assessment <Play size={20} fill="currentColor" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
