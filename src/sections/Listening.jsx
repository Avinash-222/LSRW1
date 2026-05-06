import React, { useState } from 'react';
import { useTest } from '../context/TestContext';
import { usePractice } from '../context/PracticeContext';
import { useRecorder } from '../hooks/useRecorder';
import { calculateSimilarity } from '../utils/evaluation';
import { Headphones, Mic, CheckCircle, Volume2, AlertCircle, Radio, Square, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Listening = ({ isPractice = false }) => {
  const testContext = useTest();
  const practiceContext = usePractice();
  
  const state = isPractice ? practiceContext.practiceState : testContext.state;
  const testQuestions = isPractice ? practiceContext.practiceQuestions : testContext.testQuestions;
  const nextQuestion = isPractice ? practiceContext.nextPracticeQuestion : testContext.nextQuestion;

  const { isRecording, isInitializing, transcript, setTranscript, error, volume, isTranscribing, devices, selectedDeviceId, setSelectedDeviceId, startRecording, stopRecording } = useRecorder();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [playCount, setPlayCount] = useState(0);
  const [audioEnded, setAudioEnded] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const sentence = testQuestions.listening[state.currentQuestionIndex];

  const playAudio = () => {
    if (playCount >= 2) return;
    
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    setIsPlaying(true);
    const utterance = new SpeechSynthesisUtterance(sentence);
    utterance.rate = 0.85; 
    
    utterance.onend = () => {
      setIsPlaying(false);
      setAudioEnded(true);
      setPlayCount(prev => prev + 1);
    };

    utterance.onerror = (e) => {
      console.error("SpeechSynthesis error:", e);
      setIsPlaying(false);
      setAudioEnded(true);
      setPlayCount(prev => prev + 1);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleFinish = () => {
    console.log("Listening: handleFinish triggered");
    setSubmitting(true);
    try {
      stopRecording();
    } catch(e) {}
    
    setTimeout(() => {
      try {
        const finalTranscript = transcript || "";
        const score = calculateSimilarity(sentence, finalTranscript);
        console.log("Listening: Calculated score:", score);

        nextQuestion('listening', {
          question_id: `L-0${state.currentQuestionIndex + 1}`,
          original_sentence: sentence,
          student_transcript: finalTranscript,
          fluency_score: score > 50 ? 90 : 40,
          correctness_score: score,
          score: score 
        });
      } catch (err) {
        console.error("Listening evaluation error:", err);
        nextQuestion('listening', { error: "Processing failed" });
      } finally {
        setSubmitting(false);
        setAudioEnded(false);
        setPlayCount(0);
        setTranscript(''); // Clear the previous transcript
      }
    }, 1000);
  };

  return (
    <div className="flex justify-center fade-in" style={{ height: 'calc(100vh - 160px)', alignItems: 'center' }}>
      <div className="assessment-card" style={{ maxWidth: '1000px', width: '100%', display: 'flex', flexDirection: 'column', height: '100%', maxHeight: '720px' }}>
        
        <div style={{ padding: '1.5rem 2.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-app)' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', marginTop: '0' }}>Question {state.currentQuestionIndex + 1}/10</h2>
          </div>
          <div style={{ background: '#fff', padding: '8px 16px', borderRadius: '100px', border: '1px solid var(--border)', color: 'var(--text-main)', fontWeight: 800, fontSize: '0.7rem', letterSpacing: '0.05em' }}>
            CREDITS: {2 - playCount}
          </div>
        </div>

        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: (audioEnded || playCount > 0) ? '1fr 1.2fr' : '1fr', gap: '2rem', padding: '2.5rem', background: '#fff', overflow: 'hidden' }}>
          
          <div style={{ 
            background: 'var(--bg-app)', 
            borderRadius: 'var(--radius-xl)', 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            border: '1px solid var(--border)',
            position: 'relative',
            height: '100%'
          }}>
            <button 
              className={`mic-btn ${isPlaying ? 'active' : ''}`}
              onClick={playAudio}
              disabled={isPlaying || playCount >= 2 || isRecording}
              style={{ width: '100px', height: '100px', background: isPlaying ? 'var(--accent)' : 'var(--primary-900)', color: '#fff', border: 'none', borderRadius: '50%' }}
            >
              {isPlaying ? <Volume2 size={40} className="recording-pulse" /> : <Headphones size={40} />}
            </button>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>{isPlaying ? 'Playing audio...' : 'Play audio'}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center' }}>
              {playCount === 0 ? "Ensure auditory isolation for maximum score accuracy." : 
               playCount === 1 ? "Final play-back sequence initiated. Prepare replication." : "Maximum credits exhausted. Proceed to capture."}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {(audioEnded || playCount > 0) && !submitting ? (
              <motion.div 
                key="capture"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}
              >
                <div style={{ flex: 1, background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }}>
                    {isRecording && <div className="recording-pulse" style={{ color: 'var(--accent)', fontSize: '0.6rem', fontWeight: 800 }}>LIVE DECODING</div>}
                  </div>

                  <button 
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={isInitializing || isTranscribing}
                    style={{ 
                      width: '80px', height: '80px', borderRadius: '50%', border: 'none', 
                      background: isRecording ? '#ef4444' : 'var(--accent)', color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem'
                    }}
                  >
                    {isInitializing ? <Activity className="recording-pulse" size={24} /> : (isRecording ? <Square size={24} /> : <Mic size={24} />)}
                  </button>

                  <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <p style={{ fontSize: '0.65rem', color: isRecording ? 'var(--accent)' : 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                      {isRecording ? 'Transcription Active' : 'Voice Capture Ready'}
                    </p>
                  </div>
                  
                  {isRecording && (
                    <div style={{ width: '40px', height: '3px', background: '#e2e8f0', borderRadius: '10px', margin: '0 auto 12px auto', overflow: 'hidden' }}>
                      <div style={{ width: `${Math.min(100, (volume / 128) * 100)}%`, height: '100%', background: 'var(--accent)' }}></div>
                    </div>
                  )}

                  <div style={{ maxHeight: '180px', overflowY: 'auto', width: '100%', padding: '0 0.5rem' }}>
                    <p style={{ fontSize: '1.3rem', fontStyle: 'italic', color: 'var(--text-main)', fontWeight: 700, lineHeight: 1.4, wordBreak: 'break-word', textAlign: 'center' }}>
                      {transcript ? `"${transcript}"` : isTranscribing ? "Processing Voice..." : isRecording ? "Decoding Voice..." : "Your words will appear here."}
                    </p>
                  </div>
                </div>

                <button 
                  onClick={handleFinish}
                  disabled={isRecording || isInitializing || isTranscribing}
                  style={{ 
                    width: '100%', 
                    height: '56px', 
                    background: 'var(--accent)', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: '16px', 
                    fontWeight: 800, 
                    fontSize: '1rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '0.75rem', 
                    cursor: (isRecording || isInitializing || isTranscribing) ? 'not-allowed' : 'pointer',
                    opacity: (isRecording || isInitializing || isTranscribing) ? 0.6 : 1,
                    boxShadow: '0 8px 16px -4px rgba(37, 99, 235, 0.4)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={e => !e.currentTarget.disabled && (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onMouseOut={e => !e.currentTarget.disabled && (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  {isTranscribing ? (
                    <Activity className="recording-pulse" size={20} />
                  ) : (
                    <CheckCircle size={20} />
                  )}
                  {isTranscribing ? "Processing Final Audio..." : "SUBMIT RESPONSE"}
                </button>
                {error && <div style={{ color: '#ef4444', fontSize: '0.75rem', textAlign: 'center' }}>{error}</div>}
              </motion.div>
            ) : submitting ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}
              >
                <div className="recording-pulse" style={{ color: 'var(--accent)', fontWeight: 800, fontSize: '0.9rem', marginBottom: '1.5rem' }}>Decoding Correlation...</div>
                <div className="progress-bar" style={{ maxWidth: '240px' }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 1 }} className="progress-fill" />
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Listening;
