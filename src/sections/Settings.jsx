import React, { useState } from 'react';
import { 
  User, Shield, Monitor, Bell, Lock, Download, HelpCircle, 
  Save, CheckCircle2, AlertTriangle, Upload, LogOut, FileText, Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ToggleSwitch = ({ active, onToggle }) => (
  <div 
    onClick={onToggle}
    style={{ 
      width: '44px', height: '24px', background: active ? 'var(--accent)' : '#cbd5e1', 
      borderRadius: '12px', position: 'relative', cursor: 'pointer', transition: '0.3s',
      flexShrink: 0
    }}
  >
    <div style={{ 
      position: 'absolute', top: '2px', left: active ? '22px' : '2px', 
      width: '20px', height: '20px', background: '#fff', borderRadius: '50%', transition: '0.3s',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }} />
  </div>
);

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showNotification, setShowNotification] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // States for toggles
  const [toggles, setToggles] = useState({
    autoSubmit: true,
    practiceMode: false,
    enableTimers: true,
    emailNotif: true,
    testAlerts: true,
    performanceReports: true,
    weeklyUpdates: false,
    twoFactor: false,
    dataSharing: true,
  });

  const handleToggle = (key) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const [avatar, setAvatar] = useState(null);
  const fileInputRef = React.useRef(null);
  const dobRef = React.useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile Settings', icon: User },
    { id: 'account', label: 'Account Settings', icon: Shield },
    { id: 'test_prefs', label: 'Test Preferences', icon: FileText },
    { id: 'notifications', label: 'Notification Settings', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Lock },
    { id: 'appearance', label: 'Appearance', icon: Monitor },
    { id: 'data', label: 'Data & Reports', icon: Download },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
  ];

  return (
    <div className="fade-in" style={{ padding: '0 1rem 2rem 1rem', maxWidth: '1200px', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
      <input 
        type="file" 
        ref={fileInputRef} 
        hidden 
        accept="image/*" 
        onChange={handleImageUpload} 
      />
      
      {/* Toast Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed', top: '24px', right: '24px', zIndex: 1000,
              background: '#10b981', color: '#fff', padding: '12px 24px',
              borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)', fontWeight: 600
            }}
          >
            <CheckCircle2 size={18} /> Settings successfully updated
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', letterSpacing: '-0.03em', color: 'var(--primary-900)', fontWeight: 800 }}>Settings & Configuration</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage your personal details, test preferences, and platform security.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem' }}>
        
        {/* Left Side: Navigation Menu */}
        <div className="card" style={{ padding: '1rem', background: '#fff', border: '1px solid var(--border)', height: 'fit-content' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 16px', border: 'none', 
                  background: activeTab === tab.id ? 'var(--accent-soft)' : 'transparent',
                  color: activeTab === tab.id ? 'var(--accent)' : 'var(--text-main)',
                  borderRadius: '8px', cursor: 'pointer', textAlign: 'left',
                  fontWeight: activeTab === tab.id ? 700 : 500,
                  transition: 'all 0.2s'
                }}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Detailed Settings Panel */}
        <div className="card" style={{ padding: '2.5rem', minHeight: '600px', background: '#fff', border: '1px solid var(--border)' }}>
          
          {/* PROFILE SETTINGS */}
          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', color: 'var(--primary-900)', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', fontWeight: 800 }}>Profile Settings</h2>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div style={{ 
                  width: '80px', height: '80px', borderRadius: '50%', 
                  background: avatar ? `url(${avatar}) center/cover` : 'var(--accent)', 
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  fontSize: '2rem', fontWeight: 800, overflow: 'hidden'
                }}>
                  {!avatar && 'JD'}
                </div>
                <div>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => fileInputRef.current?.click()}
                    style={{ padding: '6px 16px', height: 'auto', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Upload size={14}/> Upload New Picture
                  </button>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>JPG or PNG. Max size 2MB.</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', color: 'var(--primary-900)' }}>Full Name</label>
                  <input type="text" className="input-field" defaultValue="John Doe" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', color: 'var(--primary-900)' }}>Email Address</label>
                  <input type="email" className="input-field" defaultValue="john.doe@example.com" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', color: 'var(--primary-900)' }}>Phone Number</label>
                  <input type="tel" className="input-field" defaultValue="+1 (555) 123-4567" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', color: 'var(--primary-900)' }}>Date of Birth</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="date" 
                      ref={dobRef}
                      className="input-field" 
                      defaultValue="2001-05-15" 
                      style={{ paddingRight: '40px' }}
                    />
                    <Calendar 
                      size={18} 
                      color="var(--text-muted)" 
                      style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }} 
                      onClick={() => dobRef.current?.showPicker()}
                    />
                  </div>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', color: 'var(--primary-900)' }}>Language Preference</label>
                  <select className="input-field">
                    <option>English (US)</option>
                    <option>English (UK)</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <button className="btn btn-primary" onClick={handleSave} style={{ gap: '8px' }}>
                  <Save size={16} /> Save Changes
                </button>
              </div>
            </motion.div>
          )}

          {/* ACCOUNT SETTINGS */}
          {activeTab === 'account' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', color: 'var(--primary-900)', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', fontWeight: 800 }}>Account Settings</h2>
              
              <div style={{ marginBottom: '2.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-900)', marginBottom: '1rem' }}>Change Password</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', maxWidth: '400px' }}>
                  <input type="password" className="input-field" placeholder="Current Password" />
                  <input type="password" className="input-field" placeholder="New Password" />
                  <input type="password" className="input-field" placeholder="Confirm New Password" />
                  <button className="btn btn-secondary" onClick={handleSave} style={{ width: 'max-content' }}>Update Password</button>
                </div>
                <div style={{ marginTop: '1rem' }}>
                  <button style={{ background: 'transparent', border: 'none', color: 'var(--accent)', fontWeight: 600, cursor: 'pointer', padding: 0 }}>Send Reset Password Email</button>
                </div>
              </div>

              <div style={{ marginBottom: '2.5rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-900)', marginBottom: '4px' }}>Account Email Verification</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Status: <span style={{ color: '#10b981', fontWeight: 700 }}>Verified</span></p>
                  </div>
                  <CheckCircle2 color="#10b981" size={24} />
                </div>
              </div>

              <div style={{ padding: '1.5rem', border: '1px solid #fee2e2', borderRadius: '12px', background: '#fef2f2' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ef4444', marginBottom: '0.5rem' }}>Danger Zone</h3>
                <p style={{ fontSize: '0.85rem', color: '#b91c1c', marginBottom: '1rem' }}>Deleting your account will permanently erase all test history and profile data. This action cannot be undone.</p>
                {showDeleteConfirm ? (
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ef4444' }}>Are you absolutely sure?</span>
                    <button className="btn" style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 16px', fontSize: '0.85rem' }}>Yes, Delete My Account</button>
                    <button className="btn btn-secondary" style={{ padding: '6px 16px', fontSize: '0.85rem' }} onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                  </div>
                ) : (
                  <button className="btn" style={{ background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', padding: '6px 16px', fontSize: '0.85rem' }} onClick={() => setShowDeleteConfirm(true)}>Delete Account</button>
                )}
              </div>
            </motion.div>
          )}

          {/* TEST PREFERENCES */}
          {activeTab === 'test_prefs' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', color: 'var(--primary-900)', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', fontWeight: 800 }}>Test Preferences</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', color: 'var(--primary-900)' }}>Default Test Duration</label>
                    <select className="input-field">
                      <option>Standard (60 mins)</option>
                      <option>Accelerated (30 mins)</option>
                      <option>Comprehensive (120 mins)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', color: 'var(--primary-900)' }}>Difficulty Level</label>
                    <select className="input-field">
                      <option>Adaptive (AI Controlled)</option>
                      <option>Beginner (A1-A2)</option>
                      <option>Intermediate (B1-B2)</option>
                      <option>Advanced (C1-C2)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-900)' }}>Auto-submit when time ends</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Automatically finish the section when the timer hits zero.</p>
                  </div>
                  <ToggleSwitch active={toggles.autoSubmit} onToggle={() => handleToggle('autoSubmit')} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-900)' }}>Enable Practice Mode</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Show hints and disable strict scoring for casual practice.</p>
                  </div>
                  <ToggleSwitch active={toggles.practiceMode} onToggle={() => handleToggle('practiceMode')} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0' }}>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-900)' }}>Enable Timers</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Display countdown timers during assessments.</p>
                  </div>
                  <ToggleSwitch active={toggles.enableTimers} onToggle={() => handleToggle('enableTimers')} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                <button className="btn btn-primary" onClick={handleSave} style={{ gap: '8px' }}>
                  <Save size={16} /> Save Preferences
                </button>
              </div>
            </motion.div>
          )}

          {/* NOTIFICATION SETTINGS */}
          {activeTab === 'notifications' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', color: 'var(--primary-900)', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', fontWeight: 800 }}>Notification Settings</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 0', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-900)' }}>Email Notifications</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Receive general system updates and announcements.</p>
                  </div>
                  <ToggleSwitch active={toggles.emailNotif} onToggle={() => handleToggle('emailNotif')} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 0', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-900)' }}>Test Completion Alerts</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Get notified immediately when your AI assessment is fully graded.</p>
                  </div>
                  <ToggleSwitch active={toggles.testAlerts} onToggle={() => handleToggle('testAlerts')} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 0', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-900)' }}>Performance Reports</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Receive an email with your generated PDF report after a test.</p>
                  </div>
                  <ToggleSwitch active={toggles.performanceReports} onToggle={() => handleToggle('performanceReports')} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 0' }}>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-900)' }}>Weekly Progress Updates</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Weekly insights into your skill trajectory and improvements.</p>
                  </div>
                  <ToggleSwitch active={toggles.weeklyUpdates} onToggle={() => handleToggle('weeklyUpdates')} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                <button className="btn btn-primary" onClick={handleSave} style={{ gap: '8px' }}>
                  <Save size={16} /> Save Notifications
                </button>
              </div>
            </motion.div>
          )}

          {/* PRIVACY & SECURITY */}
          {activeTab === 'privacy' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', color: 'var(--primary-900)', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', fontWeight: 800 }}>Privacy & Security</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 0', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-900)' }}>Two-Factor Authentication (2FA)</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Require an extra security code during login.</p>
                  </div>
                  <ToggleSwitch active={toggles.twoFactor} onToggle={() => handleToggle('twoFactor')} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 0', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-900)' }}>Data Sharing Preferences</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Allow anonymized assessment data to improve our AI models.</p>
                  </div>
                  <ToggleSwitch active={toggles.dataSharing} onToggle={() => handleToggle('dataSharing')} />
                </div>
              </div>

              <div style={{ marginTop: '2.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-900)', marginBottom: '1rem' }}>Account Activity Logs</h3>
                <div style={{ border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ padding: '1rem', background: '#f8fafc', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ fontWeight: 600 }}>Windows PC - Chrome</span>
                    <span style={{ color: 'var(--text-muted)' }}>New York, USA - Today 10:00 AM</span>
                  </div>
                  <div style={{ padding: '1rem', background: '#fff', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ fontWeight: 600 }}>iPhone 13 - Safari</span>
                    <span style={{ color: 'var(--text-muted)' }}>New York, USA - Yesterday 4:30 PM</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                <button className="btn btn-primary" onClick={handleSave} style={{ gap: '8px' }}>
                  <Save size={16} /> Save Security Settings
                </button>
              </div>
            </motion.div>
          )}

          {/* APPEARANCE */}
          {activeTab === 'appearance' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', color: 'var(--primary-900)', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', fontWeight: 800 }}>Appearance Settings</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', maxWidth: '400px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', color: 'var(--primary-900)' }}>Theme</label>
                  <select className="input-field">
                    <option>Light Mode</option>
                    <option>Dark Mode</option>
                    <option>System Default</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', color: 'var(--primary-900)' }}>Dashboard Layout Preference</label>
                  <select className="input-field">
                    <option>Standard (Cards)</option>
                    <option>Compact (List View)</option>

                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', color: 'var(--primary-900)' }}>Font Size Adjustment</label>
                  <select className="input-field">
                    <option>Small</option>
                    <option selected>Medium (Default)</option>
                    <option>Large</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                <button className="btn btn-primary" onClick={handleSave} style={{ gap: '8px' }}>
                  <Save size={16} /> Save Appearance
                </button>
              </div>
            </motion.div>
          )}

          {/* DATA & REPORTS */}
          {activeTab === 'data' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', color: 'var(--primary-900)', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', fontWeight: 800 }}>Data & Reports</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="card" style={{ padding: '1.5rem', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary-900)', marginBottom: '4px' }}>Download Test Reports</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Generate an aggregate PDF of all your past assessment reports.</p>
                  </div>
                  <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', height: 'auto' }}><Download size={16}/> Download PDF</button>
                </div>

                <div className="card" style={{ padding: '1.5rem', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary-900)', marginBottom: '4px' }}>Export Performance Data</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Export your raw skill metrics as a CSV file for external analysis.</p>
                  </div>
                  <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', height: 'auto' }}><Download size={16}/> Export CSV</button>
                </div>

                <div style={{ padding: '1.5rem', border: '1px solid #fee2e2', borderRadius: '12px', background: '#fef2f2', marginTop: '1rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ef4444', marginBottom: '0.5rem' }}>Clear Test History</h3>
                  <p style={{ fontSize: '0.85rem', color: '#b91c1c', marginBottom: '1rem' }}>Wipe all previous assessment data and reset your proficiency tracking to zero.</p>
                  {showClearConfirm ? (
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ef4444' }}>Are you sure?</span>
                      <button className="btn" style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 16px', fontSize: '0.85rem' }}>Yes, Clear History</button>
                      <button className="btn btn-secondary" style={{ padding: '6px 16px', fontSize: '0.85rem' }} onClick={() => setShowClearConfirm(false)}>Cancel</button>
                    </div>
                  ) : (
                    <button className="btn" style={{ background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', padding: '6px 16px', fontSize: '0.85rem' }} onClick={() => setShowClearConfirm(true)}>Clear History</button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* HELP & SUPPORT */}
          {activeTab === 'help' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', color: 'var(--primary-900)', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', fontWeight: 800 }}>Help & Support</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div className="card" style={{ padding: '1.5rem', border: '1px solid var(--border)', background: '#f8fafc', cursor: 'pointer' }}>
                  <HelpCircle size={24} color="var(--accent)" style={{ marginBottom: '1rem' }} />
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary-900)', marginBottom: '4px' }}>FAQ Section</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Browse answers to commonly asked questions.</p>
                </div>
                <div className="card" style={{ padding: '1.5rem', border: '1px solid var(--border)', background: '#f8fafc', cursor: 'pointer' }}>
                  <AlertTriangle size={24} color="#f59e0b" style={{ marginBottom: '1rem' }} />
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary-900)', marginBottom: '4px' }}>Report Issue</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Report a bug or a problem with an assessment.</p>
                </div>
              </div>

              <div className="card" style={{ padding: '2rem', border: '1px solid var(--border)', background: '#fff' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-900)', marginBottom: '1.5rem' }}>Contact Support</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', color: 'var(--primary-900)' }}>Subject</label>
                    <input type="text" className="input-field" placeholder="How can we help?" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', color: 'var(--primary-900)' }}>Message</label>
                    <textarea className="input-field" rows={5} placeholder="Describe your issue in detail..."></textarea>
                  </div>
                  <button className="btn btn-primary" onClick={handleSave} style={{ width: 'max-content' }}>Submit Request</button>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Settings;
