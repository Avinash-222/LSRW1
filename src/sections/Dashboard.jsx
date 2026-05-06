import React from 'react';
import { useTest } from '../context/TestContext';
import { 
  Headphones, 
  MessageSquare, 
  Glasses, 
  PenTool, 
  TrendingUp, 
  Award, 
  CheckCircle2, 
  Clock, 
  Play, 
  Activity, 
  Target, 
  ChevronRight,
  Layers,
  FileText
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  ComposedChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Area
} from 'recharts';

const CircularProgress = ({ value, color, size = 60, strokeWidth = 6 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`${color}20`}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <div style={{ position: 'absolute', fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>
        {value}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { setCurrentTab, state } = useTest();

  // Mock Data
  const user = {
    name: "Avinash",
    level: "Advanced (C1)",
    overallScore: 84
  };

  const skills = [
    { name: 'Listening', score: 88, color: '#8b5cf6', icon: Headphones, trend: '+5%', level: 'Master' },
    { name: 'Speaking', score: 76, color: '#f97316', icon: MessageSquare, trend: '+2%', level: 'Proficient' },
    { name: 'Reading', score: 92, color: '#10b981', icon: Glasses, trend: '+8%', level: 'Master' },
    { name: 'Writing', score: 80, color: '#3b82f6', icon: PenTool, trend: '+4%', level: 'Advanced' }
  ];

  const quickStats = [
    { label: 'Total Tests Taken', value: '12', icon: Layers, color: '#3b82f6' },
    { label: 'Average Score', value: '81.5', icon: Target, color: '#8b5cf6' },
    { label: 'Best Score', value: '92.0', icon: Award, color: '#10b981' },
    { label: 'Improvement', value: '+14%', icon: TrendingUp, color: '#f59e0b' }
  ];

  const recentActivity = [
    { name: 'Full LSRW Core Assessment', date: 'Mar 05, 2026', score: 84, status: 'C1 Proficient', statusColor: '#10b981', statusBg: '#d1fae5' },
    { name: 'Speaking & Listening Check', date: 'Feb 28, 2026', score: 78, status: 'B2 Certified', statusColor: '#3b82f6', statusBg: '#dbeafe' },
    { name: 'Initial Baseline Evaluation', date: 'Jan 10, 2026', score: 72, status: 'B2 Certified', statusColor: '#3b82f6', statusBg: '#dbeafe' }
  ];

  const achievements = [
    { name: 'First Test Completed', icon: CheckCircle2, color: '#3b82f6', bg: '#dbeafe' },
    { name: 'Listening Expert', icon: Headphones, color: '#8b5cf6', bg: '#ede9fe' },
    { name: 'Reading Master', icon: Glasses, color: '#10b981', bg: '#d1fae5' },
    { name: 'Consistency Streak', icon: Activity, color: '#f59e0b', bg: '#fef3c7' }
  ];

  return (
    <div className="fade-in" style={{ paddingBottom: '4rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* 1. Dashboard Header */}
      <div className="card shadow-premium" style={{ 
        background: 'linear-gradient(135deg, #fdf4ff 0%, #fffbeb 100%)', 
        borderRadius: '24px', 
        padding: '3rem', 
        position: 'relative', 
        overflow: 'hidden',
        color: '#0f172a',
        border: '1px solid #fce7f3',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '2rem'
      }}>
        {/* Decorative Glow */}
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(244,114,182,0.15) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', bottom: '-50px', left: '20%', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(250,204,21,0.2) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%' }}></div>

        <div style={{ position: 'relative', zIndex: 10 }}>
          <p style={{ fontSize: '0.9rem', color: '#db2777', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 800, marginBottom: '0.5rem' }}>Personalized Analytics</p>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            Welcome back, {user.name}.
          </h1>
          <p style={{ color: '#475569', fontSize: '1.1rem', maxWidth: '500px', lineHeight: 1.6, margin: 0 }}>
            Track your communication skill progress and continue improving your LSRW performance.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '2rem', position: 'relative', zIndex: 10, background: 'rgba(255,255,255,0.7)', padding: '1.5rem 2.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 800 }}>Skill Level</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>{user.level}</span>
          </div>
          <div style={{ width: '1px', background: 'rgba(0,0,0,0.1)' }}></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 800 }}>Overall Score</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>{user.overallScore}/100</span>
          </div>
        </div>
      </div>

      {/* Grid Layout for Analytics & Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
        {/* 8. Quick Statistics Cards */}
        {quickStats.map((stat, i) => (
          <div key={i} className="card shadow-sm" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${stat.color}15`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <stat.icon size={24} />
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.25rem 0' }}>{stat.label}</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '2rem' }}>
        {/* Left Column: Skills & Progress */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* 2. LSRW Skill Overview Cards */}
          <div className="card shadow-sm" style={{ padding: '2rem', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Activity size={20} color="#3b82f6" /> LSRW Skill Core
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              {skills.map((skill, idx) => (
                <div key={idx} style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ background: `${skill.color}20`, color: skill.color, padding: '8px', borderRadius: '10px' }}>
                        <skill.icon size={20} />
                      </div>
                      <span style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>{skill.name}</span>
                    </div>
                    <CircularProgress value={skill.score} color={skill.color} size={48} strokeWidth={4} />
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <p style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, margin: '0 0 0.25rem 0', textTransform: 'uppercase' }}>Proficiency</p>
                      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: skill.color }}>{skill.level}</span>
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <TrendingUp size={14} /> {skill.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 6. Progress Tracking Indicator */}
          <div className="card shadow-sm" style={{ padding: '2rem', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <TrendingUp size={20} color="#8b5cf6" /> Performance Trend
            </h3>
            <div style={{ height: '300px', width: '100%', marginTop: '1rem' }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={[
                    { name: 'Test 1', lsrw: 65, ai: 60, trend: 55 },
                    { name: 'Test 2', lsrw: 72, ai: 67, trend: 62 },
                    { name: 'Test 3', lsrw: 78, ai: 73, trend: 70 },
                    { name: 'Test 4', lsrw: 84, ai: 79, trend: 82 },
                  ]}
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }} 
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: '1px solid #e2e8f0', 
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      padding: '12px'
                    }} 
                    cursor={{ fill: '#f8fafc' }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    formatter={(value) => <span style={{ color: '#475569', fontSize: '0.85rem', fontWeight: 700 }}>{value}</span>}
                  />
                  <Bar 
                    dataKey="lsrw" 
                    name="LSRW Average" 
                    barSize={24} 
                    fill="#3b82f6" 
                    radius={[6, 6, 0, 0]} 
                    animationDuration={1500}
                  />
                  <Bar 
                    dataKey="ai" 
                    name="AI Confidence" 
                    barSize={24} 
                    fill="#8b5cf6" 
                    radius={[6, 6, 0, 0]} 
                    animationDuration={1800}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="trend" 
                    name="Growth Trend" 
                    stroke="#10b981" 
                    strokeWidth={4} 
                    dot={{ r: 6, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 8, strokeWidth: 0 }}
                    animationDuration={2000}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Right Column: Dashboard Utilities */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* 4. Assessment Quick Access */}
          <div className="card shadow-premium" style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '0', overflow: 'hidden' }}>
            <div style={{ height: '4px', background: 'linear-gradient(90deg, #10b981, #3b82f6)' }}></div>
            <div style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  {state.currentSectionIndex !== -1 && !state.completed ? 'Ongoing Assessment' : 'Upcoming Assessment'}
                </h3>
                <span style={{ 
                  padding: '4px 10px', 
                  background: state.currentSectionIndex !== -1 && !state.completed ? '#fff7ed' : '#ecfdf5', 
                  color: state.currentSectionIndex !== -1 && !state.completed ? '#ea580c' : '#10b981', 
                  fontSize: '0.75rem', fontWeight: 800, borderRadius: '20px', textTransform: 'uppercase' 
                }}>
                  {state.currentSectionIndex !== -1 && !state.completed ? 'In Progress' : 'Ready'}
                </span>
              </div>
              
              <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>LSRW Core Evaluation</h4>
                <div style={{ display: 'flex', gap: '1rem', color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={14} /> 45 Mins</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Layers size={14} /> All 4 Modules</span>
                </div>
              </div>

              <button 
                onClick={() => setCurrentTab('assessments')}
                style={{ 
                  width: '100%', padding: '1rem', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(37,99,235,0.2)', transition: 'all 0.2s'
                }}
                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {state.currentSectionIndex !== -1 && !state.completed ? 'Resume Assessment' : 'Start Assessment'} <Play size={16} fill="currentColor" />
              </button>
            </div>
          </div>

          {/* 3. Overall Performance Analytics (Radial Meter) */}
          <div className="card shadow-sm" style={{ padding: '2rem', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              Skill Balance Match <Target size={20} color="#f59e0b" />
            </h3>
            
            <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', marginBottom: '2rem' }}>
              <CircularProgress value={84} color="#3b82f6" size={160} strokeWidth={12} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>84</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Overall</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {skills.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ width: '80px', fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>{s.name}</span>
                  <div style={{ flex: 1, height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${s.score}%` }} style={{ height: '100%', background: s.color, borderRadius: '3px' }}></motion.div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 7. Achievements and Badges */}
          <div className="card shadow-sm" style={{ padding: '2rem', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award size={20} color="#10b981" /> Badges
              </h3>
              <button style={{ background: 'none', border: 'none', color: '#3b82f6', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>View All</button>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {achievements.map((badge, idx) => (
                <div key={idx} style={{ flex: '1 1 45%', background: badge.bg, padding: '1rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', textAlign: 'center', border: `1px solid ${badge.color}30` }}>
                  <badge.icon size={24} color={badge.color} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>{badge.name}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* 5. Recent Activity Section */}
      <div className="card shadow-sm" style={{ padding: '2rem', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Clock size={20} color="#64748b" /> Recent Activity
          </h3>
          <button style={{ background: 'none', border: 'none', color: '#3b82f6', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            View Full History <ChevronRight size={16} />
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.85rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Assessment Name</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.85rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date Completed</th>
                <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.85rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Score</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.85rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Performance Level</th>
                <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.85rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.map((test, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#f8fafc'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '1.25rem 1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ background: '#eff6ff', padding: '8px', borderRadius: '8px' }}>
                       <FileText size={18} color="#3b82f6" />
                    </div>
                    <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>{test.name}</span>
                  </td>
                  <td style={{ padding: '1.25rem 1rem', color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>{test.date}</td>
                  <td style={{ padding: '1.25rem 1rem', textAlign: 'center' }}>
                    <span style={{ fontSize: '1rem', fontWeight: 900, color: '#0f172a' }}>{test.score}</span><span style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 700 }}>/100</span>
                  </td>
                  <td style={{ padding: '1.25rem 1rem' }}>
                    <span style={{ 
                      padding: '4px 12px', background: test.statusBg, color: test.statusColor, borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' 
                    }}>
                      {test.status}
                    </span>
                  </td>
                  <td style={{ padding: '1.25rem 1rem', textAlign: 'center' }}>
                    <button style={{ background: 'transparent', border: '1px solid #cbd5e1', padding: '6px 16px', borderRadius: '8px', color: '#475569', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.color = '#3b82f6'; }} onMouseOut={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.color = '#475569'; }}>
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
