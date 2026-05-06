import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

const PracticeCelebration = ({ practiceResults, sectionId, onContinue }) => {
  const { width, height } = useWindowSize();
  const score = practiceResults?.overallScore || 0;
  
  // States for animation sequence
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCharacter, setShowCharacter] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [showScore, setShowScore] = useState(false);
  const [showCTA, setShowCTA] = useState(false);
  const [countUpScore, setCountUpScore] = useState(0);
  const [xp, setXp] = useState(0);

  useEffect(() => {
    // Cinematic Flow Sequence
    setTimeout(() => setShowConfetti(true), 300);
    setTimeout(() => setShowCharacter(true), 800);
    setTimeout(() => setShowTitle(true), 1400);
    setTimeout(() => {
      setShowScore(true);
      // Count up animation
      let start = 0;
      const duration = 1500;
      const interval = 20;
      const steps = duration / interval;
      const increment = score / steps;
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= score) {
          setCountUpScore(score);
          clearInterval(timer);
          
          // Trigger XP burst
          let xpStart = 0;
          const xpMax = 150;
          const xpIncrement = xpMax / (500 / interval);
          const xpTimer = setInterval(() => {
            xpStart += xpIncrement;
            if (xpStart >= xpMax) {
              setXp(xpMax);
              clearInterval(xpTimer);
            } else {
              setXp(Math.floor(xpStart));
            }
          }, interval);
          
        } else {
          setCountUpScore(Math.floor(start));
        }
      }, interval);
    }, 2000);
    setTimeout(() => setShowCTA(true), 4000);
    
    // Play sounds if possible
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      
      const playTone = (freq, type, duration, vol, timeOffset) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + timeOffset);
        gain.gain.setValueAtTime(vol, audioCtx.currentTime + timeOffset);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + timeOffset + duration);
        osc.stop(audioCtx.currentTime + timeOffset + duration);
      };

      // Simple victory arpeggio
      setTimeout(() => {
        if(audioCtx.state === 'suspended') audioCtx.resume();
        playTone(440, 'sine', 0.2, 0.1, 0);   // A4
        playTone(554.37, 'sine', 0.2, 0.1, 0.1); // C#5
        playTone(659.25, 'sine', 0.2, 0.1, 0.2); // E5
        playTone(880, 'sine', 0.4, 0.1, 0.3);   // A5
      }, 300);

    } catch(e) {
      console.log('Audio disabled by browser policy');
    }

  }, [score]);

  // Gradient background
  const containerStyle = {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'linear-gradient(135deg, #fffbeb 0%, #ffedd5 50%, #fef08a 100%)',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  };

  return ReactDOM.createPortal(
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={containerStyle}
    >
      {showConfetti && (
        <Confetti 
          width={width} 
          height={height} 
          recycle={true}
          numberOfPieces={400}
          gravity={0.15}
          initialVelocityY={20}
          colors={['#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6', '#fcd34d']}
        />
      )}

      {/* Background radial gradient glow */}
      <motion.div 
        animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }} 
        transition={{ repeat: Infinity, duration: 3 }}
        style={{ position: 'absolute', width: '100%', height: '100%', background: 'radial-gradient(circle, rgba(253, 224, 71, 0.4) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 1 }} 
      />

      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%' }}>
        
        {/* Cartoon Character */}
        <div style={{ height: '140px', position: 'relative', display: 'flex', justifyContent: 'center' }}>
          <AnimatePresence>
            {showCharacter && (
              <motion.div
                initial={{ y: 150, scale: 0, opacity: 0 }}
                animate={{ y: [0, -25, 0], scale: 1, opacity: 1 }}
                transition={{ 
                  type: "spring", stiffness: 200, damping: 12,
                  y: { repeat: Infinity, duration: 1.5, ease: "easeInOut" } 
                }}
                style={{ fontSize: '7rem', filter: 'drop-shadow(0 10px 20px rgba(245, 158, 11, 0.4))', position: 'absolute', bottom: 0 }}
              >
                <div style={{ position: 'absolute', inset: -20, background: 'radial-gradient(circle, rgba(253,224,71,0.8) 0%, transparent 60%)', zIndex: -1, borderRadius: '50%', animation: 'pulse 2s infinite' }} />
                🥳
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Text Animation */}
        <div style={{ height: '140px', position: 'relative', display: 'flex', justifyContent: 'center', width: '100%' }}>
          <AnimatePresence>
            {showTitle && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.15, 1], opacity: 1 }}
                transition={{ duration: 0.6, ease: "backOut" }}
                style={{ textAlign: 'center', position: 'absolute', width: '100%' }}
              >
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], rotate: [-15, 15, -15] }} 
                    transition={{ repeat: Infinity, duration: 0.8 }} 
                    style={{ fontSize: '3rem', position: 'absolute', left: '-60px', top: '10px' }}
                  >👏</motion.div>
                  
                  <h1 style={{ 
                    fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, margin: 0, 
                    background: 'linear-gradient(to right, #ea580c, #ca8a04)', 
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    textShadow: '0 4px 15px rgba(234, 88, 12, 0.2)',
                    letterSpacing: '-1px'
                  }}>
                    🎉 CONGRATULATIONS!
                  </h1>

                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], rotate: [15, -15, 15] }} 
                    transition={{ repeat: Infinity, duration: 0.8 }} 
                    style={{ fontSize: '3rem', position: 'absolute', right: '-60px', top: '10px' }}
                  >👏</motion.div>
                </div>
                
                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  style={{ fontSize: '1.5rem', fontWeight: 700, color: '#9a3412', margin: '0.5rem 0', textShadow: '0 2px 4px rgba(255,255,255,0.8)' }}
                >
                  You have qualified this test!
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Score Reveal & Reward */}
        <div style={{ height: '220px', display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
          <AnimatePresence>
            {showScore && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: "spring", bounce: 0.6 }}
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  padding: '2.5rem 4rem',
                  borderRadius: '32px',
                  boxShadow: '0 20px 40px rgba(234, 88, 12, 0.15), 0 0 0 6px rgba(255, 255, 255, 0.6)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1rem',
                  position: 'relative'
                }}
              >
                <div style={{ position: 'absolute', top: '-20px', background: '#10b981', color: 'white', padding: '8px 24px', borderRadius: '100px', fontWeight: 900, fontSize: '1.2rem', boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)', border: '3px solid #fff', zIndex: 2 }}>
                  Qualified ✅
                </div>
                
                <div style={{ position: 'relative', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="120" height="120" style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
                    <circle cx="60" cy="60" r="50" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                    <motion.circle 
                      cx="60" cy="60" r="50" fill="none" 
                      stroke="url(#score-gradient)" strokeWidth="10" 
                      strokeLinecap="round"
                      initial={{ strokeDasharray: "0 314.2" }}
                      animate={{ strokeDasharray: `${(countUpScore / 100) * 314.2} 314.2` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                    <defs>
                      <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#ea580c" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <motion.div 
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    style={{ fontSize: '2.2rem', fontWeight: 900, color: '#1e293b' }}
                  >
                    {countUpScore}%
                  </motion.div>
                </div>

                {/* XP Reward */}
                <div style={{ position: 'absolute', bottom: '-20px' }}>
                  {xp > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.5, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fffbeb', padding: '8px 24px', borderRadius: '100px', border: '3px solid #fde047', boxShadow: '0 8px 16px rgba(217, 119, 6, 0.2)' }}
                    >
                      <span style={{ fontSize: '1.5rem' }}>⚡</span>
                      <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#d97706' }}>+{xp} XP</span>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CTA Button */}
        <div style={{ height: '80px', marginTop: '2.5rem', display: 'flex', justifyContent: 'center' }}>
          <AnimatePresence>
            {showCTA && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <motion.button
                  onClick={onContinue}
                  whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(234, 88, 12, 0.5)' }}
                  whileTap={{ scale: 0.95 }}
                  animate={{ scale: [1, 1.03, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  style={{
                    background: 'linear-gradient(to right, #f97316, #eab308)',
                    color: 'white',
                    border: 'none',
                    padding: '1.25rem 3.5rem',
                    borderRadius: '100px',
                    fontSize: '1.5rem',
                    fontWeight: 900,
                    cursor: 'pointer',
                    boxShadow: '0 10px 25px rgba(234, 88, 12, 0.3)',
                    borderBottom: '5px solid #c2410c', // 3D Button effect
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}
                >
                  Next Challenge 🚀
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </motion.div>,
    document.body
  );
};

export default PracticeCelebration;
