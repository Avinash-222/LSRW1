import React, { useState, useRef } from 'react';
import { useTest } from '../context/TestContext';
import { motion } from 'framer-motion';
import { 
  User, Mail, Calendar, Edit3, Camera, Check, Circle, 
  ChevronDown, Save, X, Phone, Globe, Languages, Hash,
  Award, Clock, ShieldCheck
} from 'lucide-react';

const Profile = () => {
  const { state } = useTest();
  const fileInputRef = useRef(null);
  const dobRef = useRef(null);
  const [avatar, setAvatar] = useState(null);

  // User data from state or defaults
  const user = {
    name: state.user ? `${state.user.firstName} ${state.user.lastName}` : (state.userName || 'Avinash Randhi'),
    id: state.user ? `LSRW-${state.user.id}` : 'LSRW-1',
    email: state.user ? state.user.email : 'randhiavinash9@gmail.com',
    username: state.user ? state.user.username : 'avinash_randhi',
    phone: '+91 98765 43210',
    dob: '15 May 2001',
    nativeLanguage: 'Hindi',
    gender: 'Male',
    country: 'India',
    joinDate: 'Joined Oct 2024',
    role: 'LSRW Learner',
    completion: 85,
    assessments: 28,
    badges: 6
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
    }
  };

  return (
    <div className="profile-container fade-in" style={{ 
      padding: '2rem', 
      maxWidth: '1200px', 
      margin: '0 auto', 
      fontFamily: "'Inter', sans-serif",
      color: '#1e293b'
    }}>
      
      {/* 1. Header Banner */}
      <div style={{ 
        background: 'linear-gradient(135deg, #0044cc 0%, #002266 100%)', 
        borderRadius: '24px', 
        padding: '3rem', 
        position: 'relative', 
        overflow: 'hidden',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '2.5rem',
        boxShadow: '0 10px 25px -5px rgba(0, 34, 102, 0.4)'
      }}>
        {/* Background Decorative Patterns */}
        <div style={{ 
          position: 'absolute', 
          right: '-100px', 
          top: '-100px', 
          width: '400px', 
          height: '400px', 
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '50%',
          zIndex: 1
        }}></div>
        <div style={{ 
          position: 'absolute', 
          right: '-50px', 
          top: '-50px', 
          width: '300px', 
          height: '300px', 
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '50%',
          zIndex: 1
        }}></div>
        <div style={{ 
          position: 'absolute', 
          right: '0', 
          top: '0', 
          width: '200px', 
          height: '200px', 
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '50%',
          zIndex: 1
        }}></div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', position: 'relative', zIndex: 2 }}>
          <div style={{ position: 'relative' }}>
            <div style={{ 
              width: '140px', 
              height: '140px', 
              borderRadius: '50%', 
              border: '4px solid rgba(255,255,255,0.3)',
              background: avatar ? `url(${avatar}) center/cover` : 'rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}>
              {!avatar && <User size={60} color="#fff" />}
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              style={{
                position: 'absolute',
                bottom: '5px',
                right: '5px',
                background: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
            >
              <Camera size={18} color="#3b82f6" />
            </button>
            <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageUpload} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 700, margin: 0 }}>{user.name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', opacity: 0.9, fontSize: '0.95rem' }}>
              <span>{user.role}</span>
              <span style={{ width: '4px', height: '4px', background: '#fff', borderRadius: '50%' }}></span>
              <span>ID: {user.id}</span>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                <Mail size={16} /> {user.email}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                <Calendar size={16} /> {user.joinDate}
              </div>
            </div>
          </div>
        </div>

        <button style={{ 
          background: 'rgba(255,255,255,0.1)', 
          border: '1px solid rgba(255,255,255,0.3)',
          color: '#fff',
          padding: '0.75rem 1.5rem',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontSize: '0.95rem',
          fontWeight: 600,
          cursor: 'pointer',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.2s'
        }}
        onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
        onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
        >
          <Edit3 size={18} /> Edit Profile
        </button>
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Quick Overview Card */}
          <div className="card" style={{ 
            background: '#fff', 
            borderRadius: '20px', 
            padding: '2rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            border: '1px solid #f1f5f9'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', color: '#0f172a' }}>Quick Overview</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {[
                { label: 'Account Type', value: 'Learner', icon: User, color: '#3b82f6' },
                { label: 'Member Since', value: 'Oct 2024', icon: Calendar, color: '#8b5cf6' },
                { label: 'Total Assessments', value: user.assessments, icon: Hash, color: '#10b981' },
                { label: 'Badges Earned', value: user.badges, icon: Award, color: '#f59e0b' }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '12px', 
                      background: `${item.color}10`, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center' 
                    }}>
                      <item.icon size={20} color={item.color} />
                    </div>
                    <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>{item.label}</span>
                  </div>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: i === 0 ? '#3b82f6' : '#1e293b' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Profile Completion Card */}
          <div className="card" style={{ 
            background: '#fff', 
            borderRadius: '20px', 
            padding: '2rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            border: '1px solid #f1f5f9'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '2rem', color: '#0f172a' }}>Profile Completion</h3>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }}>
              <div style={{ position: 'relative', width: '110px', height: '110px' }}>
                <svg width="110" height="110" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#f1f5f9" strokeWidth="6" />
                  <motion.circle 
                    cx="50" cy="50" r="45" fill="none" stroke="#2563eb" strokeWidth="6"
                    strokeDasharray="283"
                    initial={{ strokeDashoffset: 283 }}
                    animate={{ strokeDashoffset: 283 - (283 * user.completion) / 100 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    strokeLinecap="round"
                    style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                  />
                </svg>
                <div style={{ 
                  position: 'absolute', 
                  inset: 0, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '1.75rem',
                  fontWeight: 800,
                  color: '#1e293b'
                }}>
                  {user.completion}%
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { text: 'Email verified', completed: true },
                { text: 'Assessment completed', completed: true },
                { text: 'Add profile photo', completed: false }
              ].map((step, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {step.completed ? (
                    <Check size={16} color="#10b981" strokeWidth={3} />
                  ) : (
                    <Circle size={16} color="#cbd5e1" />
                  )}
                  <span style={{ fontSize: '0.9rem', color: step.completed ? '#1e293b' : '#64748b', fontWeight: 500 }}>
                    {step.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Profile Information Form */}
        <div style={{ 
          background: '#fff', 
          borderRadius: '24px', 
          padding: '2.5rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          border: '1px solid #f1f5f9'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', color: '#0f172a' }}>Profile Information</h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '2.5rem' }}>Update your personal details and profile information.</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {/* Form Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>Full Name</label>
              <input 
                type="text" 
                defaultValue={user.name}
                style={{
                  padding: '0.875rem 1.25rem',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={e => e.target.style.borderColor = '#3b82f6'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>Username</label>
              <input 
                type="text" 
                defaultValue={user.username}
                style={{
                  padding: '0.875rem 1.25rem',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={e => e.target.style.borderColor = '#3b82f6'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>Email Address</label>
              <input 
                type="email" 
                defaultValue={user.email}
                style={{
                  padding: '0.875rem 1.25rem',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={e => e.target.style.borderColor = '#3b82f6'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>Phone Number</label>
              <div style={{ position: 'relative', display: 'flex' }}>
                <div style={{ 
                  padding: '0.875rem 0.75rem', 
                  border: '1px solid #e2e8f0', 
                  borderRight: 'none',
                  borderRadius: '12px 0 0 12px',
                  background: '#f8fafc',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span style={{ fontSize: '1.2rem' }}>🇮🇳</span>
                  <ChevronDown size={14} color="#64748b" />
                </div>
                <input 
                  type="text" 
                  defaultValue={user.phone}
                  style={{
                    flex: 1,
                    padding: '0.875rem 1.25rem',
                    borderRadius: '0 12px 12px 0',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>Date of Birth</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="date" 
                  ref={dobRef}
                  defaultValue="2001-05-15"
                  style={{
                    width: '100%',
                    padding: '0.875rem 1.25rem',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    outline: 'none',
                    color: '#1e293b',
                    background: '#fff'
                  }}
                />
                <div 
                  onClick={() => dobRef.current?.showPicker()}
                  style={{ 
                    position: 'absolute', 
                    right: '1.25rem', 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#fff',
                    paddingLeft: '10px'
                  }}
                >
                  <Calendar size={18} color="#64748b" />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>Native Language</label>
              <div style={{ position: 'relative' }}>
                <select 
                  defaultValue={user.nativeLanguage}
                  style={{
                    width: '100%',
                    padding: '0.875rem 1.25rem',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    outline: 'none',
                    appearance: 'none',
                    background: '#fff'
                  }}
                >
                  <option value="Hindi">Hindi</option>
                  <option value="English">English</option>
                  <option value="Telugu">Telugu</option>
                </select>
                <ChevronDown size={18} color="#64748b" style={{ position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>Gender</label>
              <div style={{ position: 'relative' }}>
                <select 
                  defaultValue={user.gender}
                  style={{
                    width: '100%',
                    padding: '0.875rem 1.25rem',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    outline: 'none',
                    appearance: 'none',
                    background: '#fff'
                  }}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <ChevronDown size={18} color="#64748b" style={{ position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>Country</label>
              <div style={{ position: 'relative' }}>
                <select 
                  defaultValue={user.country}
                  style={{
                    width: '100%',
                    padding: '0.875rem 1.25rem',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    outline: 'none',
                    appearance: 'none',
                    background: '#fff'
                  }}
                >
                  <option value="India">India</option>
                  <option value="USA">USA</option>
                  <option value="UK">UK</option>
                </select>
                <ChevronDown size={18} color="#64748b" style={{ position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem' }}>
            <button style={{
              padding: '0.875rem 2.5rem',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              background: '#fff',
              color: '#64748b',
              fontSize: '0.95rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={e => { e.target.style.background = '#f8fafc'; e.target.style.borderColor = '#cbd5e1'; }}
            onMouseOut={e => { e.target.style.background = '#fff'; e.target.style.borderColor = '#e2e8f0'; }}
            >
              Cancel
            </button>
            <button style={{
              padding: '0.875rem 2.5rem',
              borderRadius: '12px',
              border: 'none',
              background: '#2563eb',
              color: '#fff',
              fontSize: '0.95rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
              transition: 'all 0.2s'
            }}
            onMouseOver={e => e.target.style.background = '#1d4ed8'}
            onMouseOut={e => e.target.style.background = '#2563eb'}
            >
              <Save size={18} /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
