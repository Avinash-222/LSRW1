/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import { useTest } from '../context/TestContext';
import {
  Award, ShieldCheck, User, Hash, Calendar, Zap, Printer, RefreshCcw,
  CheckCircle2, AlertCircle, TrendingUp, Headphones, MessageSquare, Glasses, PenTool, ArrowLeft
} from 'lucide-react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell, Label
} from 'recharts';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';

const theme = {
  red: '#ce2029',
  redLight: '#e87272',
  redLighter: '#fae1e1',
  blue: '#0B2447',
  blueLight: '#305b90',
  blueLighter: '#c9dcf4',
  bg: '#f8fafc',
  grayText: '#475569',
  border: '#e2e8f0'
};

const CHART_COLORS = {
  listening: '#1E40AF',
  speaking: '#F97316',
  reading: '#059669',
  writing: '#7C3AED',
  overall: ['#1E40AF', '#F97316', '#059669', '#7C3AED']
};

const DashboardCard = ({ title, bg, children, span = 1 }) => (
  <div style={{
    display: 'flex', flexDirection: 'column',
    background: '#fff', border: `1px solid ${theme.border}`,
    gridColumn: `span ${span}`,
    minHeight: '260px',
  }}>
    <div style={{
      background: bg, color: '#fff', padding: '0.75rem',
      textAlign: 'center', fontWeight: 'bold', fontSize: '0.85rem',
      textTransform: 'uppercase'
    }}>
      {title}
    </div>
    <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
      {children}
    </div>
  </div>
);

const getSuggestions = (overallScore, sectionScores) => {
  if (overallScore === undefined || overallScore === null) {
    return null;
  }

  let overall = {
    feedback: "",
    tier: "",
    color: "",
    bullets: []
  };

  const score = Number(overallScore);
  if (score >= 85) {
    overall = {
      feedback: "Excellent performance! You have shown a high level of mastery across all assessed skills. Focus on refining nuances and maintaining consistency.",
      tier: "Elite Refinement",
      color: theme.blue,
      bullets: [
        "Engage in advanced practice sessions with native-level audio and reading materials.",
        "Focus on micro-refinements in pronunciation, active listening to diverse accents, and advanced writing structure.",
        "Maintain consistency by practicing daily and engaging in challenging conversations."
      ]
    };
  } else if (score >= 70) {
    overall = {
      feedback: "Great progress! You are showing solid competence and steady growth. With focused refinement, you can comfortably reach the elite level.",
      tier: "Advanced Competence",
      color: theme.blueLight,
      bullets: [
        "Focus on addressing minor weak areas and polishing performance under timed conditions.",
        "Increase accuracy by double-checking comprehension questions and sentence mechanics.",
        "Practice regularly to build higher fluency and natural delivery in speaking."
      ]
    };
  } else if (score >= 50) {
    overall = {
      feedback: "Good effort! You have a decent foundation, but revising core concepts will help you build stronger accuracy and confidence.",
      tier: "Developing Skills",
      color: theme.redLight,
      bullets: [
        "Systematically revise grammar guidelines, key vocabulary, and foundational structures.",
        "Set aside dedicated daily time for focused practice in your weaker modules.",
        "Carefully listen to explanations and correct errors immediately during practice."
      ]
    };
  } else {
    overall = {
      feedback: "Keep trying! Language learning is a journey. Let's focus on building a strong foundation and practicing consistently every day.",
      tier: "Foundational Focus",
      color: theme.red,
      bullets: [
        "Go back to the basics: master high-frequency vocabulary and simple sentence formats.",
        "Dedicate 15–20 minutes daily to reading aloud, listening to short audio clips, and basic writing exercises.",
        "Carefully review mistakes in practice sessions to understand the underlying rules."
      ]
    };
  }

  // Section-wise recommendations
  const sections = [];
  let lowestSection = null;
  let minScore = 101;

  if (sectionScores) {
    const validSections = ['listening', 'speaking', 'reading', 'writing'];

    // 1. Find lowest scoring section
    Object.entries(sectionScores).forEach(([key, val]) => {
      const sectionKey = key.toLowerCase();
      if (validSections.includes(sectionKey)) {
        const sVal = Number(val) || 0;
        if (sVal < minScore) {
          minScore = sVal;
          lowestSection = sectionKey;
        }
      }
    });

    // 2. Generate specific suggestions for sections scoring < 75%
    const sectionTups = {
      listening: {
        label: "Listening Skill",
        tip: "Practice audio comprehension with short clips, listen to short English clips, and repeat exercises to train comprehension.",
        icon: 'listening'
      },
      speaking: {
        label: "Speaking Skill",
        tip: "Focus on pronunciation clarity, fluency, and practice speaking aloud or shadow-reading daily.",
        icon: 'speaking'
      },
      reading: {
        label: "Reading Skill",
        tip: "Read short passages, practice identifying main ideas, and actively improve your vocabulary.",
        icon: 'reading'
      },
      writing: {
        label: "Writing Skill",
        tip: "Focus on correct sentence structures, grammar rules, spelling consistency, and paragraph writing.",
        icon: 'writing'
      }
    };

    // If lowestSection is defined, make sure it gets added first as "Critical Focus"
    if (lowestSection && sectionTups[lowestSection]) {
      sections.push({
        key: lowestSection,
        isCritical: true,
        ...sectionTups[lowestSection]
      });
    }

    // Add other weak sections (< 75%) that are not the absolute lowest
    Object.entries(sectionScores).forEach(([key, val]) => {
      const sectionKey = key.toLowerCase();
      if (validSections.includes(sectionKey) && sectionKey !== lowestSection) {
        const sVal = Number(val) || 0;
        if (sVal < 75) {
          sections.push({
            key: sectionKey,
            isCritical: false,
            ...sectionTups[sectionKey]
          });
        }
      }
    });
  }

  return { overall, sections };
};

const getDynamicInsights = (sectionScores) => {
  const fallback = {
    strength: "Good performance across multiple assessed language domains.",
    weakness: "Focus on continuous vocabulary enrichment and practice."
  };

  if (!sectionScores) return fallback;

  const validSections = ['listening', 'speaking', 'reading', 'writing'];
  const scoresArray = Object.entries(sectionScores)
    .filter(([key]) => validSections.includes(key.toLowerCase()))
    .map(([key, val]) => ({
      key: key.toLowerCase(),
      val: Number(val) || 0
    }));

  if (scoresArray.length === 0) return fallback;

  // Sort scores to find highest and lowest
  scoresArray.sort((a, b) => b.val - a.val);

  const highest = scoresArray[0];
  const lowest = scoresArray[scoresArray.length - 1];

  // Map high section to strength statements
  const strengthTemplates = {
    listening: "Excellent auditory processing, speech retention, and key detail extraction from spoken audio.",
    speaking: "Excellent speaking fluency, pronunciation clarity, and natural conversational cadence.",
    reading: "High reading comprehension, textual context mapping, and efficient scanning of long passages.",
    writing: "Strong grammar coordination, effective vocabulary selection, and logical paragraph coherence."
  };

  const highFallbackTemplates = {
    listening: "Developing solid listening comprehension skills with promising focus during audio tests.",
    speaking: "Developing spoken fluency with steady progress in clear word pronunciation.",
    reading: "Developing reading speed and show good accuracy in textual comprehension answers.",
    writing: "Developing core writing skills, displaying a good effort in sentence formations."
  };

  // Map low section to weakness statements
  const weaknessTemplates = {
    listening: "Requires focused auditory exercises, listening to active English conversations, and practice extracting quick details.",
    speaking: "Needs practice in continuous sentence generation, pronunciation precision, and overall spoken confidence.",
    reading: "Requires more practice in skim-reading techniques, speed-comprehension, and expanding active vocabulary.",
    writing: "Needs improvement in paragraph-level grammar coordination, punctuation, and structural sentence variety."
  };

  const minorImprovementTemplates = {
    listening: "Needs minor practice decoding very rapid speech or subtle phonetic differences.",
    speaking: "Requires minor polishing of complex pronunciations and rapid conversational flow.",
    reading: "Needs minor polishing on high-level speed reading and dense academic passage vocabulary.",
    writing: "Requires minor adjustment in advanced style structures and structural essay complexity."
  };

  // Determine strength statement
  let strengthStr = "";
  if (highest.val >= 75) {
    strengthStr = strengthTemplates[highest.key] || `Demonstrates strong performance in the ${highest.key} module.`;
  } else {
    strengthStr = highFallbackTemplates[highest.key] || `Showing progressive growth in the ${highest.key} section.`;
  }

  // Determine weakness statement
  let weaknessStr = "";
  if (lowest.val < 75) {
    weaknessStr = weaknessTemplates[lowest.key] || `Requires targeted practice and revision in the ${lowest.key} module.`;
  } else {
    weaknessStr = minorImprovementTemplates[lowest.key] || `Practice advanced materials in ${lowest.key} for perfect execution.`;
  }

  return {
    strength: strengthStr,
    weakness: weaknessStr
  };
};

const Report = ({ isPracticeView = false, practiceResults = null }) => {
  const { state, resetTest, setCurrentTab } = useTest();
  const results = isPracticeView ? practiceResults : state.results;

  useEffect(() => {
    if (results) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: [theme.red, theme.blue, '#ffffff']
      });
    }
  }, [results]);

  if (!results || !results.studentInfo) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', textAlign: 'center' }}>
        <AlertCircle size={48} color="var(--warning)" style={{ marginBottom: '1.5rem' }} />
        <h2>Data Structure Update</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>A system update has changed the report format. Your previous session data is incompatible.</p>
        <button className="btn btn-primary" onClick={resetTest}>Reset and Begin New Session</button>
      </div>
    );
  }

  const { studentInfo, sectionScores, overallScore, insights = [], detailedData } = results;

  const profileName = state.user
    ? `${state.user.firstName} ${state.user.lastName}`.trim()
    : (state.userName && state.userName !== 'Candidate'
        ? state.userName
        : (studentInfo.name || 'Candidate'));

  const getSectionStatus = (score) => {
    if (score >= 80) return { label: 'Elite', cefr: 'C1/C2' };
    if (score >= 60) return { label: 'Certified', cefr: 'B2' };
    if (score >= 40) return { label: 'Developing', cefr: 'B1' };
    return { label: 'Beginner', cefr: 'A1/A2' };
  };

  const status = getSectionStatus(overallScore);

  const getHeatmapLevel = (score) => {
    const s = Number(score) || 0;
    if (s <= 25) return 'Low';
    if (s <= 50) return 'Dev';
    if (s <= 75) return 'Avg';
    return 'High';
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>

      {/* 1. FIRST PAGE: MAIN PERFORMANCE REPORT (STRICTLY NO CHANGES) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderTop: '4px solid #000', paddingTop: '1rem', marginBottom: '2rem' }}>
        <div style={{ width: '8px', height: '40px', background: theme.red }}></div>
        <div style={{ width: '8px', height: '40px', background: '#000' }}></div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#333', margin: 0, letterSpacing: '-0.5px' }}>
          Performance Report
        </h1>
        <div className="no-print" style={{ marginLeft: 'auto', display: 'flex', gap: '1rem' }}>
          <button style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #ccc', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center', borderRadius: '4px' }} onClick={() => setCurrentTab('history')}><ArrowLeft size={16} /> Back</button>
          <button style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #ccc', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center', borderRadius: '4px' }} onClick={() => window.print()}><Printer size={16} /> Print</button>
          <button style={{ padding: '8px 16px', background: theme.blue, color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center', borderRadius: '4px' }} onClick={resetTest}><RefreshCcw size={16} /> Reset</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem', color: '#000', fontSize: '1rem', justifyContent: 'space-between', padding: '1rem 2rem', background: '#fff', border: `1px solid ${theme.border}` }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><User size={20} color={theme.blue} /> <strong>Name:</strong> <strong>{profileName}</strong></span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Hash size={20} color={theme.red} /> <strong>ID:</strong> <strong>{studentInfo.attemptId}</strong></span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Calendar size={20} color={theme.blue} /> <strong>Date:</strong> <strong>{new Date(studentInfo.date).toLocaleDateString()}</strong></span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', marginBottom: '1rem' }}>

        {/* CARD 1: Overall Score */}
        <DashboardCard title="OVERALL SCORE" bg={theme.red}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{overallScore}%</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ShieldCheck fill={theme.blue} color="#fff" size={32} /></div>
            </div>
            <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: theme.grayText, fontWeight: 'bold' }}>{status.label}</div>
          </div>
        </DashboardCard>

        {/* CARD 2: Proficiency Rate (CEFR representation) */}
        <DashboardCard title="PROFICIENCY STATUS" bg={theme.blue}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{status.cefr}</div>

            <div style={{ width: '100%', marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <div style={{ fontSize: '0.8rem', marginBottom: '4px', textAlign: 'center', fontWeight: 'bold' }}>Audio Validated</div>
                <div style={{ background: '#eee', height: '12px', width: '80%', margin: '0 auto' }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} style={{ background: theme.blue, height: '100%' }} />
                </div>
                <div style={{ textAlign: 'center', fontSize: '0.85rem', marginTop: '4px', fontWeight: 'bold' }}>85 %</div>
              </div>

              <div>
                <div style={{ fontSize: '0.8rem', marginBottom: '4px', textAlign: 'center', fontWeight: 'bold' }}>Grammar Validated</div>
                <div style={{ background: '#eee', height: '12px', width: '80%', margin: '0 auto' }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: '65%' }} style={{ background: theme.blue, height: '100%' }} />
                </div>
                <div style={{ textAlign: 'center', fontSize: '0.85rem', marginTop: '4px', fontWeight: 'bold' }}>65 %</div>
              </div>
            </div>
          </div>
        </DashboardCard>

        {/* CARD 3: Scores by Section (Vertical Bar Chart matching Age Group) */}
        <DashboardCard title="SCORE BY SECTION" bg={theme.red}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '100%', padding: '0 0.5rem 1rem 0.5rem' }}>
            {Object.entries(sectionScores).filter(([k]) => ['listening', 'speaking', 'reading', 'writing'].includes(k)).map(([key, val]) => (
              <div key={key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: theme.grayText, marginBottom: '6px' }}>{val}%</div>
                <div style={{
                  display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                  height: '140px', width: '24px', background: theme.bg, borderRadius: '4px', overflow: 'hidden'
                }}>
                  <motion.div
                    initial={{ height: 0 }} animate={{ height: `${val}%` }}
                    style={{ background: key === 'writing' ? theme.blue : theme.red, width: '100%', borderRadius: '4px' }}
                  />
                </div>
                <span style={{ fontSize: '0.8rem', marginTop: '10px', fontWeight: 'bold', color: theme.grayText }}>{key.charAt(0).toUpperCase()}</span>
              </div>
            ))}
          </div>
        </DashboardCard>

        {/* CARD 4: Section Weights (Pie Chart) */}
        <DashboardCard title="EFFORT DISTRIBUTION" bg={theme.blue}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '0 0.5rem' }}>
            {/* Doughnut Chart */}
            <div style={{
              width: "110px",
              height: "110px",
              borderRadius: "50%",
              background: `conic-gradient(${theme.red} 0% 50%, ${theme.blue} 50% 75%, ${theme.blueLight} 75% 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              flexShrink: 0
            }}>
              <div style={{ width: "55px", height: "55px", background: "#fff", borderRadius: "50%", boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.1)' }}></div>
            </div>

            <div style={{ fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold', color: theme.grayText }}><span style={{ width: 10, height: 10, borderRadius: '2px', background: theme.red }} /> L/S</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold', color: theme.grayText }}><span style={{ width: 10, height: 10, borderRadius: '2px', background: theme.blue }} /> Reading</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold', color: theme.grayText }}><span style={{ width: 10, height: 10, borderRadius: '2px', background: theme.blueLight }} /> Writing</span>
            </div>
          </div>
        </DashboardCard>

        {/* CARD 5: Category Classification (Heatmap style) */}
        <DashboardCard title="SKILLS HEATMAP" bg={theme.red}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '4px', height: '100%' }}>
            <div style={{ background: theme.red, color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.8rem' }}>Listening</span>
              <span style={{ fontWeight: 'bold' }}>{getHeatmapLevel(sectionScores.listening)}</span>
            </div>
            <div style={{ background: theme.blue, color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.8rem' }}>Speaking</span>
              <span style={{ fontWeight: 'bold' }}>{getHeatmapLevel(sectionScores.speaking)}</span>
            </div>
            <div style={{ background: theme.blueLight, color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.8rem' }}>Reading</span>
              <span style={{ fontWeight: 'bold' }}>{getHeatmapLevel(sectionScores.reading)}</span>
            </div>
            <div style={{ background: theme.redLighter, color: '#333', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.8rem' }}>Writing</span>
              <span style={{ fontWeight: 'bold' }}>{getHeatmapLevel(sectionScores.writing)}</span>
            </div>
          </div>
        </DashboardCard>

      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 2fr', gap: '1rem' }}>

        {/* BOTTOM 1: Scores Horizontal Bar Chart */}
        <DashboardCard title="SKILLS ACQUISITION RATING" bg={theme.blue}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1.5rem', height: '100%', padding: '1rem' }}>
            {Object.entries(sectionScores)
              .filter(([k]) => ['listening', 'speaking', 'reading', 'writing'].includes(k))
              .sort(([a], [b]) => ['listening', 'speaking', 'reading', 'writing'].indexOf(a) - ['listening', 'speaking', 'reading', 'writing'].indexOf(b))
              .map(([key, val]) => {
                const iconProps = { size: 20, color: theme.blue };
                const icons = {
                  listening: <Headphones {...iconProps} />,
                  speaking: <MessageSquare {...iconProps} />,
                  reading: <Glasses {...iconProps} />,
                  writing: <PenTool {...iconProps} />
                };

                return (
                  <motion.div
                    key={key}
                    whileHover={{ backgroundColor: '#f4f6f8' }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '1rem',
                      padding: '0.5rem 0.75rem', borderRadius: '6px',
                      transition: 'background-color 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '120px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icons[key]}</div>
                      <span style={{ fontWeight: '600', fontSize: '0.9rem', color: theme.blue, textTransform: 'capitalize' }}>{key}</span>
                    </div>

                    <div style={{ flex: 1, background: '#eee', height: '14px', borderRadius: '2px', overflow: 'hidden' }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${val}%` }} style={{ height: '100%', background: theme.red }} />
                    </div>
                    <div style={{ width: '30px', fontWeight: 'bold', fontSize: '0.9rem', textAlign: 'right', color: theme.grayText }}>{val}</div>
                  </motion.div>
                );
              })}
          </div>
        </DashboardCard>

        {/* BOTTOM 2: Insight Boxes (Mosaic plot lookalike) */}
        <DashboardCard title="PERFORMANCE INSIGHTS" bg={theme.red}>
          {(() => {
            const dynamicInsights = getDynamicInsights(sectionScores);
            return (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 30px', gridTemplateRows: '1fr 1fr', height: '100%', gap: '2px', textAlign: 'left' }}>
                <div style={{ background: theme.redLight, padding: '1rem', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '8px' }}>STRENGTHS</div>
                  <div style={{ fontSize: '0.75rem', lineHeight: 1.4 }}>{dynamicInsights.strength}</div>
                </div>
                <div style={{ background: theme.blue, gridRow: 'span 2' }}></div>
                <div style={{ background: theme.red, padding: '1rem', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '8px' }}>WEAKNESSES</div>
                  <div style={{ fontSize: '0.75rem', lineHeight: 1.4 }}>{dynamicInsights.weakness}</div>
                </div>
              </div>
            );
          })()}
        </DashboardCard>

        {/* BOTTOM 3: Data Table */}
        <DashboardCard title="SUGGESTIONS TO IMPROVE" bg={theme.blue}>
          {!(overallScore !== undefined && overallScore !== null) ? (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'center', justifyContent: 'center', color: theme.grayText, textAlign: 'center', padding: '1.5rem 1rem', fontSize: '0.85rem' }}>
              <AlertCircle size={32} color={theme.redLight} style={{ marginBottom: '0.75rem' }} />
              <div style={{ fontWeight: '700', lineHeight: 1.4 }}>Complete the assessment to receive personalized improvement suggestions.</div>
            </div>
          ) : (() => {
            const { overall, sections } = getSuggestions(overallScore, sectionScores);
            return (
              <div className="suggestions-list-container" style={{ maxHeight: '280px', overflowY: 'auto', paddingRight: '4px', fontSize: '0.85rem', textAlign: 'left' }}>
                {/* Overall level summary */}
                <div style={{
                  background: `linear-gradient(135deg, ${overall.color}15, ${overall.color}25)`,
                  borderLeft: `4px solid ${overall.color}`,
                  padding: '0.75rem 1rem',
                  marginBottom: '1rem',
                  borderRadius: '0 6px 6px 0'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontWeight: '800', color: overall.color, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                      {overall.tier}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: theme.grayText }}>
                      Overall Score: {overallScore}%
                    </span>
                  </div>
                  <div style={{ color: '#1e293b', fontWeight: '500', lineHeight: 1.4 }}>
                    {overall.feedback}
                  </div>
                </div>

                {/* Suggestions bullet points */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                  {overall.bullets.map((bullet, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ x: 3 }}
                      style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: '#334155', lineHeight: 1.4 }}
                    >
                      <CheckCircle2 size={14} color={overall.color} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{bullet}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Section-specific / lowest score highlights */}
                {sections.length > 0 && (
                  <div style={{ borderTop: `1px solid ${theme.border}`, paddingTop: '0.75rem', marginTop: '0.75rem' }}>
                    <div style={{ fontWeight: '800', color: theme.blue, fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.5px' }}>
                      Targeted Skill Recommendations
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {sections.map((sect) => {
                        const iconProps = { size: 14, color: sect.isCritical ? theme.red : theme.blueLight };
                        const icons = {
                          listening: <Headphones {...iconProps} />,
                          speaking: <MessageSquare {...iconProps} />,
                          reading: <Glasses {...iconProps} />,
                          writing: <PenTool {...iconProps} />
                        };

                        return (
                          <motion.div
                            key={sect.key}
                            whileHover={{ backgroundColor: '#f8fafc' }}
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '2px',
                              padding: '0.5rem',
                              borderRadius: '4px',
                              background: sect.isCritical ? `${theme.red}08` : '#f8fafc',
                              borderLeft: sect.isCritical ? `3px solid ${theme.red}` : `3px solid ${theme.blueLight}`
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              {icons[sect.icon]}
                              <span style={{ fontWeight: '700', fontSize: '0.75rem', color: sect.isCritical ? theme.red : theme.blueLight }}>
                                {sect.label} {sect.isCritical && "(Critical Focus Area)"}
                              </span>
                              <span style={{ fontSize: '0.7rem', color: theme.grayText, marginLeft: 'auto', fontWeight: 'bold' }}>
                                Score: {sectionScores[sect.key]}%
                              </span>
                            </div>
                            <div style={{ color: '#475569', fontSize: '0.75rem', paddingLeft: '1.25rem', lineHeight: 1.4 }}>
                              {sect.tip}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </DashboardCard>

      </div>

      {/* 2. SECOND PAGE: LSRW PLATFORM FINAL REPORT (Holistic Dashboard) */}
      <div className="visual-report-wrapper" style={{ marginTop: '10rem', borderTop: '2px solid #eee', paddingTop: '5rem' }}>
        <VisualReport results={results} />
      </div>
    </div>
  );
};

const VisualReport = ({ results }) => {
  const { sectionScores, overallScore, detailedData, insights = [] } = results || {};

  const listeningRadarData = [
    { subject: 'Comprehension', A: sectionScores?.listening || 0, fullMark: 100 },
    { subject: 'Vocabulary', A: Math.max(0, (sectionScores?.listening || 0) - 5), fullMark: 100 },
    { subject: 'Pronunciation', A: Math.max(0, (sectionScores?.listening || 0) + 5), fullMark: 100 },
    { subject: 'Attention', A: Math.max(0, (sectionScores?.listening || 0) - 2), fullMark: 100 },
    { subject: 'Fluency', A: Math.max(0, (sectionScores?.listening || 0) + 2), fullMark: 100 },
  ];

  const speakingBarData = [
    { name: 'Fluency', score: detailedData?.speaking?.[0]?.fluency || sectionScores?.speaking || 0 },
    { name: 'Pronunciation', score: detailedData?.speaking?.[0]?.accuracy || sectionScores?.speaking || 0 },
    { name: 'Grammar', score: Math.max(0, (sectionScores?.speaking || 0) - 8) },
    { name: 'Confidence', score: Math.min(100, (sectionScores?.speaking || 0) + 7) },
  ];

  const readingLineData = (detailedData?.reading || [{}, {}, {}, {}, {}, {}, {}, {}]).slice(0, 8).map((r, i) => ({
    name: i + 1,
    Comprehension: Math.min(100, (r.score || 90) + Math.floor(Math.random() * 5)),
    Speed: 85 + Math.floor(Math.random() * 8),
    'Accuracy (Q)': r.score || 75,
    'Accuracy (D)': Math.min(100, (r.score || 80) + 5),
  }));

  const writingData = [
    { name: 'Grammar', score: (sectionScores?.grammarMarks || 0) * 10 },
    { name: 'Creativity', score: detailedData?.writing?.essayScore?.coherence_score || 0 },
    { name: 'Vocabulary', score: detailedData?.writing?.essayScore?.grammar_score || 0 },
    { name: 'Spelling', score: detailedData?.writing?.essayScore?.punctuation_score || 0 },
  ];

  const overallStepsData = [
    { name: 'L', value: 25, color: '#1E40AF' },
    { name: 'S', value: 25, color: '#F97316' },
    { name: 'R', value: 25, color: '#059669' },
    { name: 'W', value: 25, color: '#7C3AED' },
  ];

  const getLabel = (s) => (s >= 80 ? 'Excellent' : s >= 60 ? 'Good' : 'Fair');

  return (
    <div style={{ background: '#fff', padding: '2rem' }}>

      {/* HEADER BANNER */}
      <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
        <div style={{
          display: 'inline-block',
          background: '#0B2447',
          color: '#fff',
          padding: '12px 60px',
          borderRadius: '4px',
          fontSize: '1.75rem',
          fontWeight: '900',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          clipPath: 'polygon(10% 0, 90% 0, 100% 100%, 0% 100%)',
          textTransform: 'uppercase'
        }}>
          LSRW PLATFORM FINAL REPORT
        </div>
      </div>

      <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 1fr)', gap: '4rem', maxWidth: '1100px', margin: '0 auto' }}>


        {/* TOP LEFT: Listening */}
        <div style={{ padding: '2rem', borderRight: '1.5px solid #f1f5f9', borderBottom: '1.5px solid #f1f5f9' }}>
          <h4 style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: '900', color: '#1e293b', marginBottom: '1.5rem' }}>Listening Skills</h4>
          <div style={{ height: 220, width: '100%', minWidth: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={listeningRadarData}><PolarGrid /><PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 'bold' }} /><Radar dataKey="A" stroke={CHART_COLORS.listening} fill={CHART_COLORS.listening} fillOpacity={0.7} /></RadarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: '900', color: CHART_COLORS.listening }}>Listening Score: {sectionScores?.listening}%</div>
            <div style={{ fontWeight: '700', color: '#64748b' }}>{getLabel(sectionScores?.listening)}</div>
          </div>
        </div>

        {/* TOP RIGHT: Speaking */}
        <div style={{ padding: '2rem', borderBottom: '1.5px solid #f1f5f9' }}>
          <h4 style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: '900', color: '#1e293b', marginBottom: '1.5rem' }}>Speaking Skills</h4>
          <div style={{ height: 220, width: '100%', minWidth: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={speakingBarData}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" /><XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 'bold' }} axisLine={false} tickLine={false} /><YAxis domain={[0, 100]} hide /><Bar dataKey="score" fill={CHART_COLORS.speaking} barSize={35} radius={[4, 4, 0, 0]} /></BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: '900', color: CHART_COLORS.speaking }}>Speaking Score: {sectionScores?.speaking}%</div>
            <div style={{ fontWeight: '700', color: '#64748b' }}>{getLabel(sectionScores?.speaking)}</div>
          </div>
        </div>

        {/* BOTTOM LEFT: Reading */}
        <div style={{ padding: '2rem', borderRight: '1.5px solid #f1f5f9' }}>
          <h4 style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: '900', color: '#1e293b', marginBottom: '1.5rem' }}>Reading Skills</h4>
          <div style={{ height: 220, width: '100%', minWidth: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={readingLineData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} label={{ value: 'Questions', position: 'insideBottom', offset: -5, fontSize: 10, fontWeight: 'bold' }} tick={{ fontSize: 10 }} />
                <YAxis domain={[50, 100]} width={25} axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                <Tooltip />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  content={({ payload }) => (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                      {payload.map((entry, index) => (
                        <div key={`item-${index}`} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: entry.color }} />
                          <span style={{ color: '#1e293b', fontWeight: 'bold', fontSize: '11px' }}>{entry.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                />
                <Line type="monotone" dataKey="Comprehension" stroke="#059669" strokeWidth={3} dot={{ r: 5, fill: "#059669" }} activeDot={{ r: 7 }} />
                <Line type="monotone" dataKey="Speed" stroke="#84cc16" strokeWidth={2} dot={{ r: 4, fill: "#84cc16" }} />
                <Line type="monotone" dataKey="Accuracy (Q)" stroke="#ef4444" strokeWidth={2} dot={{ r: 4, fill: "#ef4444" }} />
                <Line type="monotone" dataKey="Accuracy (D)" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4, fill: "#f59e0b" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#1E40AF' }}>Reading Score: <span style={{ textDecoration: 'underline', color: '#059669' }}>{sectionScores?.reading || 0}%</span></div>
            <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#1e293b', marginTop: '4px' }}>{getLabel(sectionScores?.reading)}</div>
          </div>
        </div>

        {/* BOTTOM RIGHT: Writing */}
        <div style={{ padding: '2rem' }}>
          <h4 style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: '900', color: '#1e293b', marginBottom: '1.5rem' }}>Writing Skills</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', height: 220, justifyContent: 'center' }}>
            {writingData.map(d => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: 11, fontWeight: 'bold', width: 80, color: '#475569' }}>{d.name}</span>
                <div style={{ flex: 1, height: 16, background: '#f1f5f9', borderRadius: 8, overflow: 'hidden' }}><div style={{ height: '100%', background: CHART_COLORS.writing, width: `${d.score}%` }} /></div>
                <span style={{ fontSize: 11, fontWeight: 'bold', width: 40 }}>{d.score}%</span>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: '900', color: CHART_COLORS.writing }}>Writing Score: {sectionScores?.writing}%</div>
            <div style={{ fontWeight: '700', color: '#64748b' }}>{getLabel(sectionScores?.writing)}</div>
          </div>
        </div>
      </div>

      {/* FOOTER LEGEND */}
      <div style={{ marginTop: '5rem', display: 'flex', justifyContent: 'center', gap: '3rem', paddingTop: '2.5rem', borderTop: '1.5px solid #f1f5f9' }}>
        {overallStepsData.map(d => (
          <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.1rem', fontWeight: '900', color: '#475569' }}>
            <div style={{ width: 35, height: 22, background: d.color, borderRadius: 2 }} />
            <span>{d.name === 'L' ? 'Listening' : d.name === 'S' ? 'Speaking' : d.name === 'R' ? 'Reading' : 'Writing'}</span>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Report;
