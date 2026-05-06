import React, { useState, useEffect } from 'react';
import { useTest } from '../context/TestContext';
import { usePractice } from '../context/PracticeContext';
import { 
  ChevronRight, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  PenTool, 
  Zap,
  Info,
  Text,
  RefreshCcw,
  Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateSectionScore, calculateSimilarity } from '../utils/evaluation';
import { evaluateWritingWithAI } from '../utils/groq';

const Writing = ({ isPractice = false }) => {
  const testContext = useTest();
  const practiceContext = usePractice();
  
  const state = isPractice ? practiceContext.practiceState : testContext.state;
  const testQuestions = isPractice ? practiceContext.practiceQuestions : testContext.testQuestions;
  const updateWriting = isPractice ? practiceContext.updatePracticeWriting : testContext.updateWriting;
  const completeTest = isPractice ? practiceContext.completePracticeWriting : testContext.completeTest;

  const writingData = state.responses.writing || { essay: '', grammar: {} };
  
  const [step, setStep] = useState('essay_info'); // essay_info, thinking, writing, grammar
  const [essayText, setEssayText] = useState(writingData.essay || '');
  const [grammarAnswers, setGrammarAnswers] = useState(writingData.grammar || {});
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes for essay
  const [isTyping, setIsTyping] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const topic = testQuestions?.writing?.topics?.[currentTopicIndex] || testQuestions?.writing?.topics?.[0];
  const grammarQuestions = testQuestions?.writing?.grammar || [];

  if (!topic || grammarQuestions.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <div style={{ color: 'var(--error)' }}><AlertCircle size={48} /></div>
        <h2 style={{ marginTop: '1rem' }}>Data Integrity Error</h2>
        <p style={{ color: 'var(--text-muted)' }}>The Authoring Phase parameters could not be initialized.</p>
        <button className="btn btn-primary" style={{ marginTop: '2rem' }} onClick={() => completeTest({})}>Skip Section</button>
      </div>
    );
  }

  const goToGrammar = () => {
    updateWriting({ essay: essayText, grammar: grammarAnswers });
    setStep('grammar');
  };

  useEffect(() => {
    let timer;
    if (step === 'writing' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && step === 'writing') {
      goToGrammar();
    }
    return () => clearInterval(timer);
  }, [step, timeLeft, goToGrammar]);

  const wordCount = essayText.trim() ? essayText.trim().split(/\s+/).length : 0;

  const calculateFinalResultsData = async (essay, grammarAnswers) => {
    // 1. Evaluate Essay with AI
    const essayEval = await evaluateWritingWithAI(topic, essay);
    const wordCount = essay.trim() ? essay.trim().split(/\s+/).length : 0;
    
    // Normalize 0-20 score to 0-100 percentage
    // Robust parsing for overallScore (handles strings like "15/20" or just 15)
    let rawScore = 0;
    if (typeof essayEval.overallScore === 'number') {
      rawScore = essayEval.overallScore;
    } else if (typeof essayEval.overallScore === 'string') {
      rawScore = parseFloat(essayEval.overallScore.split('/')[0]) || 0;
    }
    
    const normalizedScore = (rawScore / 20) * 100;
    
    // Simulate more granular essay scores
    const essayScoreData = {
      essay_topic: topic,
      student_response: essay,
      word_count: wordCount,
      grammar_score: Math.max(0, Math.min(100, normalizedScore)),
      punctuation_score: Math.max(0, Math.min(100, normalizedScore + 5)),
      sentence_structure_score: Math.max(0, Math.min(100, normalizedScore - 5)),
      coherence_score: Math.max(0, Math.min(100, normalizedScore)),
      score: Math.max(0, Math.min(100, normalizedScore)),
      ai_assessment: essayEval
    };

    // 2. Evaluate Grammar Subsection
    const grammarScores = (grammarQuestions || []).map((q, idx) => {
      const score = calculateSimilarity(q.answer, grammarAnswers[idx] || '');
      return {
        question_id: q.id,
        category: q.category || 'General', 
        student_answer: grammarAnswers[idx] || '',
        correct_answer: q.answer,
        grammar_score: score,
        score: score
      };
    });

    return {
      essayScore: essayScoreData,
      grammarScores: grammarScores
    };
  };

  const handleGrammarFinish = async () => {
    setIsEvaluating(true);
    try {
      const finalData = await calculateFinalResultsData(essayText, grammarAnswers);
      completeTest(finalData);
    } catch (error) {
      console.error("Submission/Calculation failed:", error);
      setIsEvaluating(false);
      alert("Submission failed during evaluation. Error: " + error.message);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (step === 'essay_info') {
    return (
    <div className="flex justify-center fade-in" style={{ height: 'calc(100vh - 160px)', alignItems: 'center' }}>
      <div className="assessment-card" style={{ maxWidth: '700px', width: '100%', padding: '3rem', borderTop: '4px solid var(--accent)', textAlign: 'center' }}>
        <div style={{ padding: '12px', background: 'var(--accent-soft)', borderRadius: '14px', color: 'var(--accent)', width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <PenTool size={32} />
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: '0.5rem' }}>Writing Module</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Section 1: Essay Writing | Section 2: Grammar Assessment</p>
        
        <div style={{ background: 'var(--bg-app)', padding: '2rem', borderRadius: 'var(--radius-lg)', marginBottom: '2.5rem', textAlign: 'left' }}>
           <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
             <Info size={18} color="var(--accent)" />
             Module Instructions
           </h3>
           <div style={{ display: 'grid', gap: '1rem', color: 'var(--text-body)' }}>
             <div style={{ display: 'flex', gap: '1rem' }}>
               <div style={{ background: 'var(--primary-900)', color: '#fff', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', flexShrink: 0 }}>1</div>
               <div>
                 <strong style={{ display: 'block', marginBottom: '4px' }}>Section 1: Essay Writing (10 Marks)</strong>
                 <span style={{ fontSize: '0.85rem' }}>Draft an analytical response (150-300 words) in 15 minutes.</span>
               </div>
             </div>
             <div style={{ display: 'flex', gap: '1rem' }}>
               <div style={{ background: 'var(--primary-900)', color: '#fff', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', flexShrink: 0 }}>2</div>
               <div>
                 <strong style={{ display: 'block', marginBottom: '4px' }}>Section 2: Grammar Assessment (10 Marks)</strong>
                 <span style={{ fontSize: '0.85rem' }}>Specific grammar items including tense, voice, and error detection.</span>
               </div>
             </div>
           </div>
        </div>

        <button 
          onClick={() => setStep('thinking')}
          style={{ 
            width: '100%', height: '56px', background: 'var(--accent)', color: '#fff', border: 'none', 
            borderRadius: '16px', fontWeight: 800, fontSize: '1rem', display: 'flex', alignItems: 'center', 
            justifyContent: 'center', gap: '0.75rem', cursor: 'pointer', boxShadow: '0 8px 16px -4px rgba(37, 99, 235, 0.4)',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          BEGIN WRITING MODULE
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
    );
  }

  if (step === 'thinking' || step === 'writing') {
    return (
      <div className="fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <FileText color="var(--accent)" /> Section 1: Essay Writing
            </h2>
            <p style={{ color: 'var(--text-muted)' }}>{step === 'thinking' ? 'Phase: Structural Planning' : 'Phase: Content Synthesis'}</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '10px 20px', background: timeLeft < 60 ? 'var(--error-light)' : 'var(--primary-900)', color: timeLeft < 60 ? 'var(--error)' : '#fff', borderRadius: 'var(--radius-pill)', fontWeight: 700, fontFamily: 'monospace', fontSize: '1.1rem' }}>
                <Clock size={18} /> {formatTime(timeLeft)}
             </div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '10px 20px', background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-pill)', fontWeight: 700, fontSize: '0.9rem' }}>
               <Text size={18} color="var(--accent)" /> {wordCount} Words
             </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2.5rem', height: 'calc(100vh - 250px)' }}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 800, margin: 0 }}>Inquiry Prompt</h3>
              {testQuestions?.writing?.topics?.length > 1 && (
                <button 
                  onClick={() => {
                    if (testQuestions?.writing?.topics?.length > 1) {
                      setCurrentTopicIndex(prev => (prev + 1) % testQuestions.writing.topics.length);
                    }
                  }}
                  title="Try another topic"
                  style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 700 }}
                >
                  <RefreshCcw size={14} /> NEW TOPIC
                </button>
              )}
            </div>
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '1rem' }}>
               <p style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)', lineHeight: 1.5, marginBottom: '2rem' }}>{topic}</p>
               <div style={{ padding: '1.5rem', background: 'var(--bg-app)', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', color: 'var(--text-body)', borderLeft: '4px solid var(--accent)' }}>
                 <strong>Evaluation Protocol:</strong> Essay scores are derived from relevance, lexical richness, and syntactic coherence. Target word count is 150-300.
               </div>
            </div>
          </div>

          <div className="card" style={{ padding: '0', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <textarea 
              className="input-field"
              style={{ flex: 1, border: 'none', borderRadius: '0', padding: '3rem', fontSize: '1.125rem', lineHeight: 1.8, resize: 'none' }}
              placeholder={step === 'thinking' ? "Use this space for planning (not evaluated)..." : "Begin authoring your formal response..."}
              value={essayText}
              onChange={(e) => setEssayText(e.target.value)}
              disabled={step === 'thinking'}
            />
            
            {step === 'thinking' && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                <div style={{ textAlign: 'center', padding: '3rem', background: '#fff', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)', maxWidth: '400px' }}>
                  <Zap size={48} color="var(--accent)" fill="var(--accent)" style={{ marginBottom: '1.5rem' }} />
                  <h3 style={{ marginBottom: '0.75rem' }}>Planning Period</h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>Visualize your structure. Typing will be enabled in a few moments or you can initialize now.</p>
                  <button 
                    onClick={() => setStep('writing')}
                    style={{ 
                      width: '100%', height: '56px', background: 'var(--accent)', color: '#fff', border: 'none', 
                      borderRadius: '16px', fontWeight: 800, fontSize: '1rem', display: 'flex', alignItems: 'center', 
                      justifyContent: 'center', gap: '0.75rem', cursor: 'pointer', boxShadow: '0 8px 16px -4px rgba(37, 99, 235, 0.4)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Initialize Editor
                  </button>
                </div>
              </div>
            )}

            <div style={{ padding: '1.5rem 3rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: wordCount < 150 ? 'var(--warning)' : 'var(--success)', fontSize: '0.85rem', fontWeight: 700 }}>
                {wordCount < 150 ? <AlertCircle size={14} /> : <CheckCircle size={14} />}
                {wordCount < 150 ? `Target: 150+ Words (${Math.max(0, 150 - wordCount)} remaining)` : 'Complexity Threshold Reached'}
              </div>
              <button 
                onClick={goToGrammar} 
                disabled={wordCount < 20}
                style={{ 
                  height: '52px', padding: '0 24px', background: 'var(--accent)', color: '#fff', border: 'none', 
                  borderRadius: '14px', fontWeight: 800, fontSize: '0.9rem', display: 'flex', alignItems: 'center', 
                  justifyContent: 'center', gap: '0.75rem', cursor: wordCount < 20 ? 'not-allowed' : 'pointer',
                  opacity: wordCount < 20 ? 0.6 : 1, transition: 'all 0.2s ease'
                }}
              >
                GRAMMAR ASSESSMENT
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Zap color="var(--accent)" /> Section 2: Grammar Assessment
            </h2>
            <p style={{ color: 'var(--text-muted)' }}>Phase: Syntactic Audit & Rule Validation</p>
          </div>
          <div style={{ padding: '8px 16px', background: 'var(--bg-app)', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent)' }}>
             Progress: {Object.keys(grammarAnswers).length} / {grammarQuestions.length} Items Captured
          </div>
        </div>

      <div className="assessment-card" style={{ maxWidth: '1000px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ flex: 1, padding: '3rem', overflowY: 'auto', background: 'var(--bg-app)' }}>
          <div style={{ display: 'grid', gap: '2rem' }}>
            {grammarQuestions.map((q, idx) => (
              <div key={idx} className="card" style={{ padding: '2rem', borderLeft: '6px solid var(--accent)', transition: 'transform 0.2s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <p style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Question {idx + 1}</p>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: grammarAnswers[idx] ? 'var(--success)' : 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     {grammarAnswers[idx] && <CheckCircle size={14} color="#fff" />}
                  </div>
                </div>
                {(() => {
                  let instruction = q.instruction || "";
                  let sentence = q.prompt || "";

                  // If instruction is missing but type exists, map it
                  if (!instruction && q.type) {
                    const typeMap = {
                      'active_passive': (() => {
                        const s = sentence.toLowerCase();
                        if (s.includes(' by ') || (s.includes(' been ') && (s.includes('ed ') || s.includes('en ')))) {
                          return 'Convert the given sentence into Active Voice';
                        }
                        return 'Convert the given sentence into Passive Voice';
                      })(),
                      'reported_speech': 'Convert the given sentence into Reported Speech',
                      'verb_forms': 'Supply the correct verb form for the sentence',
                      'error_detection': 'Identify and correct the grammatical error',
                      'sentence_joining': 'Join the two aspects into a single coherent sentence',
                      'Speech': 'Convert from Direct to Indirect speech',
                      'Voice': (() => {
                        const s = sentence.toLowerCase();
                        if (s.includes(' by ') || (s.includes(' been ') && (s.includes('ed ') || s.includes('en ')))) {
                          return 'Convert the given sentence into Active Voice';
                        }
                        return 'Convert the given sentence into Passive Voice';
                      })()
                    };
                    instruction = typeMap[q.type] || typeMap[q.category] || "Apply the correct grammatical transformation";
                  }

                  // Handle legacy static format (Instruction: Sentence)
                  if (!instruction && sentence.includes(':')) {
                    const parts = sentence.split(':');
                    instruction = parts[0].trim();
                    sentence = parts[1].trim();
                  }

                  return (
                    <>
                      <p style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.75rem', fontWeight: 700 }}>
                        {sentence}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 800, background: 'var(--accent-soft)', padding: '4px 10px', borderRadius: '6px', whiteSpace: 'nowrap' }}>Task:</span>
                        <span style={{ fontSize: '1.05rem', color: 'var(--text-body)', fontWeight: 600 }}>{instruction}</span>
                      </div>
                    </>
                  );
                })()}

                {q.type === 'mcq' ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                    {q.options.map((opt, oIdx) => (
                      <label key={oIdx} style={{ 
                        display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', 
                        background: '#fff', border: `1px solid ${grammarAnswers[idx] === opt ? 'var(--accent)' : 'var(--border)'}`,
                        borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'all 0.2s'
                      }}>
                        <input 
                          type="radio" 
                          name={`q-${idx}`}
                          checked={grammarAnswers[idx] === opt}
                          onChange={() => setGrammarAnswers({ ...grammarAnswers, [idx]: opt })}
                          style={{ accentColor: 'var(--accent)', width: '18px', height: '18px' }}
                        />
                        <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>{opt}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <input 
                    className="input-field"
                    placeholder="Provide corrected linguistic synthesis..."
                    value={grammarAnswers[idx] || ''}
                    style={{ padding: '1rem 1.5rem', fontSize: '1rem' }}
                    onChange={(e) => setGrammarAnswers({ ...grammarAnswers, [idx]: e.target.value })}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '1.5rem 3rem', borderTop: '1px solid var(--border)', background: '#fff', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setStep('writing')}>
            Return to Editor
          </button>
          <div style={{ flex: 1 }}>
             <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Completion Status</p>
             <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${(Object.keys(grammarAnswers).length / grammarQuestions.length) * 100}%` }} />
             </div>
          </div>
          <button 
            onClick={handleGrammarFinish} 
            disabled={isEvaluating || Object.keys(grammarAnswers).length < Math.min(grammarQuestions.length, 1)}
            style={{ 
              flex: 2, height: '56px', background: 'var(--accent)', color: '#fff', border: 'none', 
              borderRadius: '16px', fontWeight: 800, fontSize: '1rem', display: 'flex', alignItems: 'center', 
              justifyContent: 'center', gap: '0.75rem', cursor: 'pointer', boxShadow: '0 8px 16px -4px rgba(37, 99, 235, 0.4)',
              transition: 'all 0.2s ease', opacity: (isEvaluating || Object.keys(grammarAnswers).length < Math.min(grammarQuestions.length, 1)) ? 0.6 : 1
            }}
          >
            {isEvaluating ? 'EXECUTING VALIDATION...' : 'FINALIZE & SUBMIT'}
            {!isEvaluating && <CheckCircle size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Writing;
