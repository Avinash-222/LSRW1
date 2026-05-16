import React, { useState } from 'react';
import { useTest } from '../context/TestContext';
import { usePractice } from '../context/PracticeContext';
import { useRecorder } from '../hooks/useRecorder';
import { calculateSimilarity, evaluatePauses } from '../utils/evaluation';
import { Mic, CheckCircle, Info, Activity, Square, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Speaking = ({ isPractice = false }) => {
  const testContext = useTest();
  const practiceContext = usePractice();
  
  const state = isPractice ? practiceContext.practiceState : testContext.state;
  const testQuestions = isPractice ? practiceContext.practiceQuestions : testContext.testQuestions;
  const nextQuestion = isPractice ? practiceContext.nextPracticeQuestion : testContext.nextQuestion;

  const { isRecording, isInitializing, transcript, setTranscript, error, volume, isTranscribing, devices, selectedDeviceId, setSelectedDeviceId, startRecording, stopRecording } = useRecorder();
  
  const [hasRecorded, setHasRecorded] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  // Reset state for each new question
  React.useEffect(() => {
    setHasRecorded(false);
    setStartTime(null);
    setSubmitting(false);
    setIsLocked(false);
    setTranscript('');
  }, [state.currentQuestionIndex]);

  const sentence = testQuestions.speaking[state.currentQuestionIndex];

  const handleStart = () => {
    setStartTime(Date.now());
    startRecording();
  };

  const handleStop = () => {
    stopRecording();
    setHasRecorded(true);
    if (!isPractice) setIsLocked(true);
  };

  const handleFinish = () => {
    setSubmitting(true);
    const duration = (Date.now() - startTime) / 1000;

    
    setTimeout(() => {
      const accuracy = calculateSimilarity(sentence, transcript);
      const pauseAnalysis = evaluatePauses(sentence, duration);
      
      nextQuestion('speaking', {
        question_id: `S-0${state.currentQuestionIndex + 1}`,
        displayed_sentence: sentence,
        student_spoken_transcript: transcript,
        fluency: pauseAnalysis.score,
        accuracy: accuracy,
        duration: duration,
      });
    }, 1000);
  };

  return (
    <div className="flex justify-center fade-in" style={{ height: 'calc(100vh - 160px)', alignItems: 'center' }}>
      <div className="assessment-card" style={{ maxWidth: '1000px', width: '100%', display: 'flex', flexDirection: 'column', height: '100%', maxHeight: '720px' }}>
        
        {/* Header */}
        <div style={{ padding: '1.5rem 2.5rem', borderBottom: '1px solid var(--border)', background: 'var(--bg-app)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', marginTop: '0' }}>Question {state.currentQuestionIndex + 1}/10</h2>
          </div>
          <div style={{ padding: '8px 16px', borderRadius: '100px', background: '#fff', border: '1px solid var(--border)', color: 'var(--text-main)', fontWeight: 800, fontSize: '0.7rem', letterSpacing: '0.05em' }}>
            STATUS: ACTIVE
          </div>
        </div>

        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: '2rem', padding: '2.5rem', background: '#fff', overflow: 'hidden' }}>
          
          {/* Left: Source Text */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: 'var(--bg-app)', borderRadius: 'var(--radius-md)', color: 'var(--text-body)', borderLeft: '4px solid var(--accent)', fontSize: '0.85rem' }}>
              <Info size={16} color="var(--accent)" />
              <p>Articulation Protocol: Read the source text with natural cadence.</p>
            </div>

            <div style={{ 
              flex: 1,
              background: '#fff', 
              padding: '2rem 1.5rem', 
              borderRadius: 'var(--radius-xl)', 
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)',
              overflowY: 'auto'
            }}>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 700, lineHeight: 1.4, color: 'var(--text-main)', letterSpacing: '-0.02em', textAlign: 'center' }}>
                "{sentence}"
              </h3>
            </div>
          </div>

          {/* Right: Capture Area */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', borderLeft: '1px solid var(--border)', paddingLeft: '2rem' }}>
            <AnimatePresence mode="wait">
              {!hasRecorded ? (
                <motion.div 
                  key="idle"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  style={{ textAlign: 'center' }}
                >
                  <span className="capture-label" style={{ display: 'block', marginBottom: '1rem', color: isRecording ? 'var(--accent)' : 'var(--text-muted)' }}>
                    {isInitializing ? 'Activating Microphone...' : isRecording ? (isTranscribing ? 'Processing...' : 'Listening...') : 'Ready to Capture'}
                  </span>
                  <div style={{ position: 'relative', width: '90px', height: '90px', margin: '0 auto' }}>
                    {/* Pulse Visualizer */}
                    {isRecording && (
                      <motion.div 
                        style={{ 
                          position: 'absolute', 
                          inset: 0, 
                          borderRadius: '50%', 
                          background: '#ef4444', 
                          opacity: 0.2,
                          scale: 1 + (volume / 128) * 1.5,
                          zIndex: 0
                        }} 
                      />
                    )}
                    <div 
                      className={`mic-btn ${isRecording ? 'active' : ''}`}
                      onClick={isRecording ? handleStop : (isLocked ? null : handleStart)}
                      style={{ 
                        position: 'relative', 
                        width: '90px', 
                        height: '90px', 
                        background: isInitializing || isLocked ? 'var(--border)' : (isRecording ? '#ef4444' : 'var(--accent)'), 
                        color: '#fff', 
                        zIndex: 1,
                        cursor: isInitializing || isLocked ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {isInitializing ? <Activity className="recording-pulse" size={32} /> : (isRecording ? <Square size={36} /> : <Mic size={36} />)}
                    </div>
                  </div>

                  {/* Real-time Sensitivity Meter */}
                  {isRecording && (
                    <div style={{ width: '120px', height: '4px', background: '#f1f5f9', borderRadius: '10px', margin: '1.5rem auto 0', overflow: 'hidden' }}>
                      <motion.div 
                        animate={{ width: `${Math.min(100, (volume / 128) * 100)}%` }}
                        style={{ height: '100%', background: 'var(--accent)', transition: 'width 0.1s' }}
                      />
                    </div>
                  )}
                  
                  {/* Error Display */}
                  {error && (
                    <div style={{ 
                      marginTop: '1rem', 
                      background: '#fef2f2', 
                      padding: '0.75rem', 
                      borderRadius: 'var(--radius-md)', 
                      color: '#b91c1c', 
                      fontSize: '0.8rem', 
                      border: '1px solid #fee2e2',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <AlertCircle size={14} />
                      {error}
                    </div>
                  )}

                  {/* ENHANCED LIVE PRINT BOX */}
                  {isRecording && (
                    <div style={{ 
                      marginTop: '1.5rem', 
                      padding: '2rem', 
                      background: 'var(--bg-app)', 
                      borderRadius: 'var(--radius-xl)', 
                      border: '2px solid var(--accent)',
                      textAlign: 'center',
                      boxShadow: '0 12px 30px rgba(37, 99, 235, 0.15)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                        <span className="recording-pulse" style={{ width: '10px', height: '10px', background: 'var(--accent)', borderRadius: '50%' }}></span>
                        <p style={{ fontSize: '0.65rem', color: 'var(--accent)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em' }}>System Printing Voice...</p>
                      </div>
                      <p style={{ fontSize: '1.5rem', color: 'var(--text-main)', fontStyle: 'italic', fontWeight: 700, lineHeight: 1.4, wordBreak: 'break-word' }}>
                        {transcript ? `"${transcript}"` : (isTranscribing ? "Finalizing synthesis..." : "Listening...")}
                      </p>
                      {!transcript && !isTranscribing && (
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>Speak clearly for real-time transcription.</p>
                      )}
                    </div>
                  )}
                </motion.div>
              ) : submitting ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ textAlign: 'center' }}
                >
                  <div className="recording-pulse" style={{ color: 'var(--accent)', fontWeight: 800, fontSize: '0.9rem', marginBottom: '1rem' }}>Metrics Synthesis...</div>
                  <div className="progress-bar" style={{ margin: '0 auto' }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 1 }} className="progress-fill" />
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  style={{ width: '100%' }}
                >
                  <div style={{ padding: '2rem', background: 'var(--bg-app)', borderRadius: 'var(--radius-xl)', marginBottom: '1.5rem', border: '1px solid var(--border)', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1rem' }}>Transcript Captured</p>
                    <p style={{ fontSize: '1.5rem', color: 'var(--text-main)', fontWeight: 700, fontStyle: 'italic', lineHeight: 1.4 }}>
                      {transcript ? `"${transcript}"` : (isTranscribing ? "... Processing Final Audio ..." : "Empty Transcript")}
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <button 
                      onClick={handleFinish} 
                      style={{ 
                        width: '100%', height: '56px', background: 'var(--accent)', color: '#fff', border: 'none', 
                        borderRadius: '16px', fontWeight: 800, fontSize: '1rem', display: 'flex', alignItems: 'center', 
                        justifyContent: 'center', gap: '0.75rem', cursor: 'pointer', boxShadow: '0 8px 16px -4px rgba(37, 99, 235, 0.4)',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <CheckCircle size={20} />
                      FINALIZE ENTRY
                    </button>
                    {!isPractice ? (
                      <div style={{ marginTop: '0.5rem', textAlign: 'center', padding: '1rem', background: 'var(--bg-app)', borderRadius: '12px', border: '1px dashed var(--border)' }}>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                          <Info size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                          Assessment Mode: Single attempt captured.
                        </p>
                      </div>
                    ) : (
                      <button 
                        onClick={() => {
                          setHasRecorded(false);
                          setIsLocked(false);
                          setTranscript('');
                        }} 
                        style={{ 
                          width: '100%', height: '48px', background: 'transparent', color: 'var(--text-muted)', 
                          border: '1px solid var(--border)', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 700, 
                          cursor: 'pointer' 
                        }}
                      >
                        Discard & Reset
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Speaking;
