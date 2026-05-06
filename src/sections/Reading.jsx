import React, { useState } from 'react';
import { useTest } from '../context/TestContext';
import { usePractice } from '../context/PracticeContext';
import { ChevronRight, BookOpen, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { evaluateMCQ, calculateSimilarity } from '../utils/evaluation';

const Reading = ({ isPractice = false }) => {
  const testContext = useTest();
  const practiceContext = usePractice();
  
  const state = isPractice ? practiceContext.practiceState : testContext.state;
  const testQuestions = isPractice ? practiceContext.practiceQuestions : testContext.testQuestions;
  const nextQuestion = isPractice ? practiceContext.nextPracticeQuestion : testContext.nextQuestion;

  const [answers, setAnswers] = useState(() => {
    const initial = {};
    if (state.responses.reading) {
      state.responses.reading.forEach((ans, idx) => {
        if (ans && ans.response) initial[idx] = ans.response;
      });
    }
    return initial;
  });

  const passageIndex = Math.floor(state.currentQuestionIndex / 10);
  const questionInPassage = state.currentQuestionIndex % 10;
  
  const passage = testQuestions?.reading?.[passageIndex];
  const question = passage?.questions?.[questionInPassage];
  const currentGlobalIndex = state.currentQuestionIndex;

  if (!passage || !question) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <div style={{ color: 'var(--error)' }}><AlertCircle size={48} /></div>
        <h2 style={{ mt: '1rem' }}>Configuration Mismatch</h2>
        <p style={{ color: 'var(--text-muted)' }}>Attempting to access non-existent audit data.</p>
        <button className="btn btn-primary" style={{ mt: '2rem' }} onClick={() => nextQuestion('reading', { skipped: true })}>Skip Error</button>
      </div>
    );
  }

  const handleAnswer = (val) => {
    setAnswers({ ...answers, [currentGlobalIndex]: val });
  };

  const handleNext = () => {
    const userAnswer = answers[currentGlobalIndex] || '';
    let score = 0;
    
    if (question.type === 'mcq') {
      score = evaluateMCQ(question.answer, userAnswer);
    } else {
      score = calculateSimilarity(question.answer, userAnswer);
    }

    nextQuestion('reading', {
      passage_id: passage.id,
      question_id: question.id,
      student_answer: userAnswer,
      correct_answer: question.answer,
      mcq_score: question.type === 'mcq' ? score : 0,
      descriptive_evaluation_score: question.type !== 'mcq' ? score : 0,
      response: userAnswer,
      score: score
    });
  };

  return (
    <div className="reading-container fade-in">
      {/* Passage Panel */}
      <div className="passage-box" style={{ borderTop: '4px solid var(--accent)', padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', fontWeight: 800, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>
          <BookOpen size={14} /> Source Document 0{passageIndex + 1}
        </div>
        <h1 style={{ marginBottom: '1rem', fontSize: '1.75rem', letterSpacing: '-0.03em', lineHeight: 1.2 }}>{passage.title}</h1>
        <div style={{ color: 'var(--text-body)', fontSize: '0.95rem', lineHeight: 1.6 }}>
          {passage.text.split('\n').map((p, i) => (
            <p key={i} style={{ marginBottom: '1rem' }}>{p}</p>
          ))}
        </div>
      </div>

      {/* Evaluation Panel */}
      <div className="question-box">
        <motion.div 
          key={currentGlobalIndex}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="assessment-card" 
          style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1.5rem', borderTop: '4px solid var(--accent)', marginBottom: '1rem' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Question {currentGlobalIndex + 1}/20
            </span>
            <div style={{ fontSize: '0.6rem', padding: '4px 10px', background: 'var(--bg-app)', border: '1px solid var(--border)', borderRadius: '100px', color: 'var(--text-main)', fontWeight: 800, letterSpacing: '0.05em' }}>
              {question.type.toUpperCase()}
            </div>
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '1.5rem', lineHeight: 1.3, letterSpacing: '-0.01em' }}>
            {question.question}
          </h3>

          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', paddingRight: '4px' }}>
            {question.type === 'mcq' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {question.options.map((opt, i) => (
                  <label 
                    key={i}
                    style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0.85rem 1.25rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid',
                      borderColor: answers[currentGlobalIndex] === opt ? 'var(--accent)' : 'var(--border)',
                      background: answers[currentGlobalIndex] === opt ? 'var(--accent-soft)' : '#fff',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: answers[currentGlobalIndex] === opt ? '0 4px 12px rgba(37, 99, 235, 0.05)' : 'none'
                    }}
                  >
                    <input 
                      type="radio"
                      name={`q-${currentGlobalIndex}`}
                      className="hidden"
                      style={{ display: 'none' }}
                      onChange={() => handleAnswer(opt)}
                      checked={answers[currentGlobalIndex] === opt}
                    />
                    <div style={{ 
                      width: '28px', height: '28px', borderRadius: '8px', 
                      background: answers[currentGlobalIndex] === opt ? 'var(--accent)' : 'var(--bg-app)',
                      color: answers[currentGlobalIndex] === opt ? '#fff' : 'var(--text-muted)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '1rem',
                      fontSize: '0.8rem', fontWeight: 800, flexShrink: 0,
                      border: '1px solid',
                      borderColor: answers[currentGlobalIndex] === opt ? 'var(--accent)' : 'var(--border)'
                    }}>
                      {String.fromCharCode(65 + i)}
                    </div>
                    <span style={{ fontSize: '0.95rem', fontWeight: 600, color: answers[currentGlobalIndex] === opt ? 'var(--text-main)' : 'var(--text-body)' }}>{opt}</span>
                  </label>
                ))}
              </div>
            ) : (
              <div style={{ position: 'relative' }}>
                <textarea 
                  className="input-field"
                  style={{ height: '180px', resize: 'none', lineHeight: 1.6, padding: '1rem', fontSize: '0.95rem' }}
                  placeholder="Formulate your analytical response here..."
                  value={answers[currentGlobalIndex] || ''}
                  onChange={(e) => handleAnswer(e.target.value)}
                  onPaste={(e) => e.preventDefault()}
                />
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.5rem', textAlign: 'right', fontWeight: 500 }}>
                  Note: External input (paste) is deactivated for this module.
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={handleNext} 
            disabled={!answers[currentGlobalIndex]}
            style={{ 
              width: '100%', height: '52px', marginTop: '1.5rem', background: 'var(--accent)', color: '#fff', 
              border: 'none', borderRadius: '14px', fontWeight: 800, fontSize: '0.95rem', display: 'flex', 
              alignItems: 'center', justifyContent: 'center', gap: '0.75rem', cursor: !answers[currentGlobalIndex] ? 'not-allowed' : 'pointer',
              opacity: !answers[currentGlobalIndex] ? 0.6 : 1, boxShadow: '0 8px 16px -4px rgba(37, 99, 235, 0.4)',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={e => !e.currentTarget.disabled && (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseOut={e => !e.currentTarget.disabled && (e.currentTarget.style.transform = 'translateY(0)')}
          >
            {currentGlobalIndex === 19 ? 'FINALIZE READING' : 'NEXT ITEM'}
            <ChevronRight size={20} />
          </button>
        </motion.div>

        {/* Audit Progress - Compact Mode */}
        <div style={{ 
          background: '#fff', 
          border: '1px solid var(--border)', 
          borderRadius: 'var(--radius-lg)', 
          padding: '1rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(20, 1fr)',
          gap: '4px'
        }}>
          {Array.from({ length: 20 }).map((_, i) => (
            <div 
              key={i} 
              style={{ 
                height: '3px', borderRadius: '2px',
                background: i === currentGlobalIndex ? 'var(--accent)' : 
                            (state.responses.reading[i]?.response) ? 'var(--success)' : 'var(--border-light)',
                transition: 'all 0.3s'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reading;
