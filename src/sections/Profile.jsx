import React, { useState, useRef } from 'react';
import { useTest } from '../context/TestContext';
import { motion } from 'framer-motion';
import { 
  User, Mail, Calendar, Settings, PenTool, Headphones, MessageSquare, 
  Glasses, TrendingUp, Target, BookOpen, Award, ChevronRight, Activity, 
  Sparkles, Lock, Bell, Download, CheckCircle2, LogOut, Edit3, Camera
} from 'lucide-react';

const CircularProgress = ({ value, color, size = 100, strokeWidth = 8 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          stroke="#f1f5f9"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <motion.circle
          stroke={color}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset: offset }}
          strokeLinecap="round"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>{value}</span>
        <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b' }}>/ 100</span>
      </div>
    </div>
  );
};

const Profile = () => {
  const { state, logoutUser } = useTest();

  const [avatar, setAvatar] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
    }
  };

  // Real User Data from State
  const user = {
    name: state.user ? `${state.user.firstName} ${state.user.lastName}` : (state.userName || 'Alexander Wright'),
    id: state.user ? `LSRW-${state.user.id}` : 'LSRW-9024',
    email: state.user ? state.user.email : `${(state.userName || 'alexander').toLowerCase().replace(' ', '.')}@enterprise.com`,
    joinDate: 'Joined Oct 2024',
    level: 'Advanced',
    overallScore: 84
  };

  const skills = [
    { name: 'Listening', score: 88, color: '#8b5cf6', icon: Headphones, improvement: '+5%', level: 'Master' },
    { name: 'Speaking', score: 76, color: '#f97316', icon: MessageSquare, improvement: '+2%', level: 'Intermediate' },
    { name: 'Reading', score: 92, color: '#10b981', icon: Glasses, improvement: '+8%', level: 'Master' },
    { name: 'Writing', score: 80, color: '#3b82f6', icon: PenTool, improvement: '+4%', level: 'Advanced' }
  ];

  const statCards = [
    { title: 'Total Tests Taken', value: '24', icon: Activity, color: '#3b82f6' },
    { title: 'Average Score', value: '81.5', icon: Target, color: '#8b5cf6' },
    { title: 'Best Score', value: '92.0', icon: Award, color: '#10b981' },
    { title: 'Improvement', value: '+14%', icon: TrendingUp, color: '#f59e0b' }
  ];

  const recentTests = [
    { name: 'Full LSRW Core Assessment', date: 'Mar 15, 2026', l: 88, s: 76, r: 92, w: 80, total: 84, status: 'C1 Proficient' },
    { name: 'Diagnostic Module Alpha', date: 'Feb 28, 2026', l: 82, s: 70, r: 85, w: 75, total: 78, status: 'B2 Certified' },
    { name: 'Baseline Initial Test', date: 'Jan 10, 2026', l: 75, s: 65, r: 80, w: 68, total: 72, status: 'B2 Certified' }
  ];

  const badges = [
    { name: 'First Test Completed', icon: CheckCircle2, color: '#3b82f6', bg: '#dbeafe' },
    { name: 'Listening Master', icon: Headphones, color: '#8b5cf6', bg: '#ede9fe' },
    { name: 'Reading Expert', icon: Glasses, color: '#10b981', bg: '#d1fae5' },
    { name: 'Top Performer', icon: Award, color: '#f59e0b', bg: '#fef3c7' }
  ];

  const settingsLinks = [
    { name: 'Update Profile Information', icon: User },
    { name: 'Change Password', icon: Lock },
    { name: 'Notification Settings', icon: Bell },
    { name: 'Privacy Settings', icon: Activity },
    { name: 'Download Performance Report', icon: Download }
  ];

  return (
    <div className="fade-in" style={{ paddingBottom: '4rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* 1. Profile Header Section */}
      <div className="card shadow-premium" style={{ 
        background: 'linear-gradient(135deg, #fdf4ff 0%, #f3e8ff 100%)', 
        borderRadius: '24px', 
        padding: '3rem', 
        position: 'relative', 
        overflow: 'hidden',
        color: '#0f172a',
        border: '1px solid #f1f5f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '2rem'
      }}>
        {/* Glow Effects */}
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(167,139,250,0.2) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%' }}></div>
        
        <div style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div 
            style={{ position: 'relative', cursor: 'pointer', borderRadius: '50%' }}
            onClick={() => fileInputRef.current?.click()}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div style={{ 
              width: '120px', height: '120px', borderRadius: '50%', 
              background: avatar ? `url(${avatar}) center/cover` : 'linear-gradient(135deg, #c4b5fd 0%, #a78bfa 100%)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '4px solid #fff',
              boxShadow: '0 12px 24px rgba(0,0,0,0.05)',
              overflow: 'hidden'
            }}>
              {!avatar && <User size={50} color="#fff" strokeWidth={1.5} />}
            </div>
            {isHovering && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', border: '4px solid transparent' }}>
                <Camera size={28} />
              </div>
            )}
            <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageUpload} />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.03em', margin: 0, color: '#0f172a' }}>{user.name}</h1>
              <span style={{ 
                background: '#ecfdf5', color: '#10b981', 
                padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em',
                border: '1px solid #a7f3d0'
              }}>{user.level}</span>
            </div>
            <p style={{ color: '#64748b', fontSize: '1.05rem', margin: 0, fontWeight: 500 }}>Username / ID: {user.id}</p>
            
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>
                <Mail size={16} color="#8b5cf6" /> {user.email}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>
                <Calendar size={16} color="#8b5cf6" /> {user.joinDate}
              </div>
            </div>
          </div>
        </div>

        <button style={{ 
          background: '#fff', color: '#0f172a', border: '1px solid #e2e8f0',
          padding: '0.875rem 1.5rem', borderRadius: '12px', fontSize: '0.95rem', fontWeight: 700,
          display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', transition: 'all 0.2s',
          boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
        }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
          <Edit3 size={18} color="#8b5cf6" /> Edit Profile
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) 1fr', gap: '2rem' }}>
        
        {/* ---- LEFT COLUMN ---- */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* 3. AI Skill Insights Panel */}
          <div className="card shadow-sm" style={{ padding: '2rem', border: '1px solid #e2e8f0', borderRadius: '16px', background: 'linear-gradient(to right, #f8fafc, #f1f5f9)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <Sparkles size={24} color="#8b5cf6" fill="#ede9fe" />
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>AI Performance Insights</h2>
            </div>
            <p style={{ fontSize: '1.05rem', color: '#334155', lineHeight: 1.6, marginBottom: '1.5rem' }}>
               Your <strong style={{color: '#10b981'}}>Reading comprehension is strong</strong>. Focus on improving <strong style={{color: '#f97316'}}>speaking fluency</strong> and <strong style={{color: '#3b82f6'}}>writing structure</strong>. Telemetry indicates a 14% growth in phonetic accuracy over the last 30 days.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '1.25rem', borderRadius: '12px' }}>
                <h4 style={{ color: '#065f46', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Strength Areas</h4>
                <p style={{ color: '#047857', fontSize: '0.85rem', fontWeight: 600 }}>Lexical accuracy & reading.</p>
              </div>
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '1.25rem', borderRadius: '12px' }}>
                <h4 style={{ color: '#991b1b', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Weak Areas</h4>
                <p style={{ color: '#b91c1c', fontSize: '0.85rem', fontWeight: 600 }}>Speaking flow & articulation.</p>
              </div>
              <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', padding: '1.25rem', borderRadius: '12px' }}>
                <h4 style={{ color: '#9a3412', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Recommended</h4>
                <p style={{ color: '#c2410c', fontSize: '0.85rem', fontWeight: 600 }}>Practice audio shadowing.</p>
              </div>
            </div>
          </div>

          {/* 2. LSRW Skill Overview */}
          <div className="card shadow-sm" style={{ padding: '2rem', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>LSRW Skill Overview</h2>
                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Real-time telemetry across auditory, speech, and literature domains.</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                 <div style={{ textAlign: 'right' }}>
                   <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Overall Score</p>
                   <p style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>C1 Proficient</p>
                 </div>
                 <CircularProgress value={user.overallScore} color="#2563eb" size={80} strokeWidth={6} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
              {skills.map((skill, index) => {
                const IconName = skill.icon;
                return (
                  <div key={index} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', background: '#f8fafc', transition: 'box-shadow 0.2s', cursor: 'grab' }} onMouseOver={e => e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.05)'} onMouseOut={e => e.currentTarget.style.boxShadow = 'none'}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${skill.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <IconName size={20} color={skill.color} />
                        </div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>{skill.name}</h3>
                      </div>
                      <div style={{ background: '#fff', padding: '4px 8px', borderRadius: '6px', border: '1px solid #e2e8f0', color: skill.color, fontSize: '0.75rem', fontWeight: 800 }}>
                        {skill.level}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <p style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{skill.score}<span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>/100</span></p>
                      <p style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 700 }}>{skill.improvement} from last test</p>
                    </div>
                    
                    <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${skill.score}%` }} transition={{ duration: 1, ease: 'easeOut' }} style={{ height: '100%', background: skill.color, borderRadius: '4px' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 6. Skill Progress Tracker Graph */}
          <div className="card shadow-sm" style={{ padding: '2rem', borderRadius: '16px' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '2.5rem' }}>Skill Progress Tracker</h2>
            <div style={{ height: '220px', width: '100%', display: 'flex', alignItems: 'flex-end', gap: '8px', position: 'relative' }}>
               <div style={{ position: 'absolute', top: 0, left: 0, right: 0, borderTop: '1px dashed #e2e8f0', zIndex: 0 }}></div>
               <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, borderTop: '1px dashed #e2e8f0', zIndex: 0 }}></div>
               <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, borderTop: '1px solid #cbd5e1', zIndex: 0 }}></div>
               
               {/* Multi-Series Graph Mockup representing 4 Skills over Time */}
               {Array.from({ length: 15 }).map((_, i) => {
                 const heightsL = [50, 52, 55, 58, 62, 65, 68, 70, 75, 78, 80, 82, 85, 87, 88];
                 const heightsS = [40, 42, 43, 45, 50, 52, 55, 58, 60, 62, 65, 68, 70, 75, 76];
                 return (
                   <div key={i} style={{ flex: 1, height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '2px', position: 'relative', zIndex: 1, paddingBottom: '1px' }}>
                     <motion.div initial={{ height: 0 }} animate={{ height: `${heightsL[i]}%` }} style={{ width: '40%', background: 'var(--accent)', borderRadius: '2px', opacity: 0.9 }} title={`Listening: ${heightsL[i]}%`} />
                     <motion.div initial={{ height: 0 }} animate={{ height: `${heightsS[i]}%` }} style={{ width: '40%', background: '#f97316', borderRadius: '2px', opacity: 0.9 }} title={`Speaking: ${heightsS[i]}%`} />
                   </div>
                 )
               })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1.5rem', fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: '12px', height: '12px', background: 'var(--accent)', borderRadius: '2px' }}></div> Listening Trend</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: '12px', height: '12px', background: '#f97316', borderRadius: '2px' }}></div> Speaking Trend</div>
              {/* Additional legend notes for clarity without cluttering graph */}
            </div>
          </div>

          {/* 5. Recent Test History Table */}
          <div className="card shadow-sm" style={{ padding: '0', borderRadius: '16px', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Recent Test History</h2>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <th style={{ padding: '1.5rem 2rem' }}>Test Name</th>
                    <th style={{ padding: '1.5rem 1rem' }}>Date</th>
                    <th style={{ padding: '1.5rem 1rem', textAlign: 'center' }}>L</th>
                    <th style={{ padding: '1.5rem 1rem', textAlign: 'center' }}>S</th>
                    <th style={{ padding: '1.5rem 1rem', textAlign: 'center' }}>R</th>
                    <th style={{ padding: '1.5rem 1rem', textAlign: 'center' }}>W</th>
                    <th style={{ padding: '1.5rem 1rem', textAlign: 'center' }}>Total</th>
                    <th style={{ padding: '1.5rem 1rem' }}>Status</th>

                  </tr>
                </thead>
                <tbody>
                  {recentTests.map((t, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.background = '#f8fafc'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '1.25rem 2rem', fontWeight: 700, color: '#1e293b', fontSize: '0.95rem' }}>{t.name}</td>
                      <td style={{ padding: '1.25rem 1rem', color: '#64748b', fontSize: '0.9rem' }}>{t.date}</td>
                      <td style={{ padding: '1.25rem 1rem', textAlign: 'center', fontWeight: 700, color: '#8b5cf6' }}>{t.l}</td>
                      <td style={{ padding: '1.25rem 1rem', textAlign: 'center', fontWeight: 700, color: '#f97316' }}>{t.s}</td>
                      <td style={{ padding: '1.25rem 1rem', textAlign: 'center', fontWeight: 700, color: '#10b981' }}>{t.r}</td>
                      <td style={{ padding: '1.25rem 1rem', textAlign: 'center', fontWeight: 700, color: '#3b82f6' }}>{t.w}</td>
                      <td style={{ padding: '1.25rem 1rem', textAlign: 'center', fontWeight: 800, color: '#0f172a', fontSize: '1.1rem' }}>{t.total}</td>
                      <td style={{ padding: '1.25rem 1rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: t.total >= 80 ? '#10b981' : '#3b82f6', background: t.total >= 80 ? '#ecfdf5' : '#dbeafe', padding: '4px 10px', borderRadius: '8px' }}>
                          {t.status}
                        </span>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* ---- RIGHT COLUMN ---- */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* 4. Test Activity Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            {statCards.map((stat, i) => {
              const StatIcon = stat.icon;
              return (
                <div key={i} className="card shadow-sm" style={{ padding: '1.5rem', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', borderTop: `4px solid ${stat.color}` }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                    <StatIcon size={18} color={stat.color} />
                  </div>
                  <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>{stat.value}</p>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.title}</p>
                </div>
              )
            })}
          </div>

          {/* 7. Gamification: Achievements and Badges */}
          <div className="card shadow-sm" style={{ padding: '2rem', borderRadius: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={20} color="#f59e0b" fill="#fef3c7" /> Verified Achievements
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {badges.map((badge, i) => {
                const BadgeIcon = badge.icon;
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', transition: 'transform 0.2s cursor: "pointer"' }} onMouseOver={e => e.currentTarget.style.transform = 'translateX(4px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateX(0)'}>
                     <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: badge.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                       <BadgeIcon size={24} color={badge.color} />
                     </div>
                     <div>
                       <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1e293b' }}>{badge.name}</h4>
                       <p style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>Unlocked based on analytics.</p>
                     </div>
                  </div>
                )
              })}
            </div>
            <button style={{ width: '100%', marginTop: '1.5rem', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '10px', background: '#fff', fontSize: '0.9rem', fontWeight: 700, color: '#3b82f6', cursor: 'pointer' }}>
              View All 12 Badges
            </button>
          </div>

          {/* 8. Account Settings */}
          <div className="card shadow-sm" style={{ padding: '0', borderRadius: '16px', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
               <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 <Settings size={20} color="#64748b" /> Account Settings
               </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {settingsLinks.map((link, i) => {
                const LinkIcon = link.icon;
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: i < settingsLinks.length - 1 ? '1px solid #f1f5f9' : 'none', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#f8fafc'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <LinkIcon size={18} color={i === settingsLinks.length - 1 ? '#3b82f6' : '#64748b'} />
                      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: i === settingsLinks.length - 1 ? '#3b82f6' : '#334155' }}>{link.name}</span>
                    </div>
                    <ChevronRight size={16} color="#cbd5e1" />
                  </div>
                )
              })}
              <div 
                onClick={() => logoutUser()}
                style={{ padding: '1.25rem 1.5rem', background: '#fef2f2', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#ef4444', fontSize: '0.95rem', fontWeight: 800, borderTop: '1px solid #fee2e2', transition: 'all 0.2s' }} 
                onMouseOver={e => e.currentTarget.style.background = '#fee2e2'} 
                onMouseOut={e => e.currentTarget.style.background = '#fef2f2'}
              >
                <LogOut size={18} /> Logout
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
