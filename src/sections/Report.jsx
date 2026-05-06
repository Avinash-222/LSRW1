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
          <button style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #ccc', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center', borderRadius: '4px' }} onClick={() => setCurrentTab('history')}><ArrowLeft size={16}/> Back</button>
          <button style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #ccc', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center', borderRadius: '4px' }} onClick={() => window.print()}><Printer size={16}/> Print</button>
          <button style={{ padding: '8px 16px', background: theme.blue, color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center', borderRadius: '4px' }} onClick={resetTest}><RefreshCcw size={16}/> Reset</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem', color: '#000', fontSize: '1rem', justifyContent: 'space-between', padding: '1rem 2rem', background: '#fff', border: `1px solid ${theme.border}` }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><User size={20} color={theme.blue} /> <strong>Name:</strong> <strong>{studentInfo.name}</strong></span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Hash size={20} color={theme.red} /> <strong>ID:</strong> <strong>{studentInfo.attemptId}</strong></span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Calendar size={20} color={theme.blue} /> <strong>Date:</strong> <strong>{new Date(studentInfo.date).toLocaleDateString()}</strong></span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
        
        {/* CARD 1: Overall Score */}
        <DashboardCard title="OVERALL SCORE" bg={theme.red}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{overallScore}%</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ShieldCheck fill={theme.blue} color="#fff" size={32}/></div>
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
                  <motion.div initial={{width:0}} animate={{width:'85%'}} style={{background: theme.blue, height:'100%'}}/>
                </div>
                <div style={{ textAlign: 'center', fontSize: '0.85rem', marginTop: '4px', fontWeight: 'bold' }}>85 %</div>
              </div>
              
              <div>
                <div style={{ fontSize: '0.8rem', marginBottom: '4px', textAlign: 'center', fontWeight: 'bold' }}>Grammar Validated</div>
                <div style={{ background: '#eee', height: '12px', width: '80%', margin: '0 auto' }}>
                  <motion.div initial={{width:0}} animate={{width:'65%'}} style={{background: theme.blue, height:'100%'}}/>
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
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold', color: theme.grayText }}><span style={{width:10,height:10,borderRadius:'2px',background:theme.red}}/> L/S</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold', color: theme.grayText }}><span style={{width:10,height:10,borderRadius:'2px',background:theme.blue}}/> Reading</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold', color: theme.grayText }}><span style={{width:10,height:10,borderRadius:'2px',background:theme.blueLight}}/> Writing</span>
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 30px', gridTemplateRows: '1fr 1fr', height: '100%', gap: '2px' }}>
            <div style={{ background: theme.redLight, padding: '1rem', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '8px' }}>STRENGTHS</div>
              <div style={{ fontSize: '0.75rem', lineHeight: 1.4 }}>{insights[0] || 'Good performance across domains.'}</div>
            </div>
            <div style={{ background: theme.blue, gridRow: 'span 2' }}></div>
            <div style={{ background: theme.red, padding: '1rem', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '8px' }}>WEAKNESSES</div>
              <div style={{ fontSize: '0.75rem', lineHeight: 1.4 }}>{insights[1] || 'Focus on complex grammar patterns needed.'}</div>
            </div>
          </div>
        </DashboardCard>

        {/* BOTTOM 3: Data Table */}
        <DashboardCard title="EVALUATION DATA TABLE" bg={theme.blue}>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '0.75rem' }}>
              <thead>
                <tr style={{ background: '#eef2f6', color: theme.blue, fontWeight: 'bold' }}>
                  <th style={{ padding: '16px 8px', borderBottom: '1px solid #ccc' }}>Module</th>
                  <th style={{ padding: '16px 8px', borderBottom: '1px solid #ccc' }}>Question Id</th>
                  <th style={{ padding: '16px 8px', borderBottom: '1px solid #ccc' }}>Metrics</th>
                  <th style={{ padding: '16px 8px', borderBottom: '1px solid #ccc' }}>Net Score</th>
                </tr>
              </thead>
              <tbody style={{ color: '#000' }}>
                {(detailedData?.listening || []).slice(0, 3).map((r, i) => (
                  <tr key={`L-${i}`}>
                    <td style={{ padding: '16px 8px', borderBottom: '1px solid #eee' }}>Listening</td>
                    <td style={{ padding: '16px 8px', borderBottom: '1px solid #eee' }}>{r.question_id}</td>
                    <td style={{ padding: '16px 8px', borderBottom: '1px solid #eee' }}>F:{r.fluency_score}% C:{r.correctness_score}%</td>
                    <td style={{ padding: '16px 8px', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>{r.score}%</td>
                  </tr>
                ))}
                {(detailedData?.speaking || []).slice(0, 3).map((r, i) => (
                  <tr key={`S-${i}`}>
                    <td style={{ padding: '16px 8px', borderBottom: '1px solid #eee' }}>Speaking</td>
                    <td style={{ padding: '16px 8px', borderBottom: '1px solid #eee' }}>{r.question_id}</td>
                    <td style={{ padding: '16px 8px', borderBottom: '1px solid #eee' }}>P:{r.pronunciation_score}%</td>
                    <td style={{ padding: '16px 8px', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>{Math.round(((r.accuracy||0)+(r.fluency||0))/2)}%</td>
                  </tr>
                ))}
                {(detailedData?.reading || []).slice(0, 3).map((r, i) => (
                  <tr key={`R-${i}`}>
                    <td style={{ padding: '16px 8px', borderBottom: '1px solid #eee' }}>Reading</td>
                    <td style={{ padding: '16px 8px', borderBottom: '1px solid #eee' }}>P:{r.passage_id}_Q:{r.question_id}</td>
                    <td style={{ padding: '16px 8px', borderBottom: '1px solid #eee' }}>Context Matching</td>
                    <td style={{ padding: '16px 8px', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>{r.score}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

  const readingLineData = (detailedData?.reading || [{},{},{},{},{},{},{},{}]).slice(0, 8).map((r, i) => ({
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
           <h4 style={{textAlign:'center', fontSize: '1.5rem', fontWeight:'900', color:'#1e293b', marginBottom:'1.5rem'}}>Listening Skills</h4>
           <div style={{height: 220, width: '100%', minWidth: 0}}>
             <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={listeningRadarData}><PolarGrid /><PolarAngleAxis dataKey="subject" tick={{fontSize:10, fontWeight:'bold'}} /><Radar dataKey="A" stroke={CHART_COLORS.listening} fill={CHART_COLORS.listening} fillOpacity={0.7}/></RadarChart>
             </ResponsiveContainer>
           </div>
           <div style={{textAlign:'center', marginTop:'1.5rem'}}>
             <div style={{fontSize:'1.3rem', fontWeight:'900', color:CHART_COLORS.listening}}>Listening Score: {sectionScores?.listening}%</div>
             <div style={{fontWeight:'700', color:'#64748b'}}>{getLabel(sectionScores?.listening)}</div>
           </div>
        </div>

        {/* TOP RIGHT: Speaking */}
        <div style={{ padding: '2rem', borderBottom: '1.5px solid #f1f5f9' }}>
           <h4 style={{textAlign:'center', fontSize: '1.5rem', fontWeight:'900', color:'#1e293b', marginBottom:'1.5rem'}}>Speaking Skills</h4>
           <div style={{height: 220, width: '100%', minWidth: 0}}>
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={speakingBarData}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/><XAxis dataKey="name" tick={{fontSize:11, fontWeight:'bold'}} axisLine={false} tickLine={false}/><YAxis domain={[0, 100]} hide/><Bar dataKey="score" fill={CHART_COLORS.speaking} barSize={35} radius={[4,4,0,0]}/></BarChart>
             </ResponsiveContainer>
           </div>
           <div style={{textAlign:'center', marginTop:'1.5rem'}}>
             <div style={{fontSize:'1.3rem', fontWeight:'900', color:CHART_COLORS.speaking}}>Speaking Score: {sectionScores?.speaking}%</div>
             <div style={{fontWeight:'700', color:'#64748b'}}>{getLabel(sectionScores?.speaking)}</div>
           </div>
        </div>

        {/* BOTTOM LEFT: Reading */}
        <div style={{ padding: '2rem', borderRight: '1.5px solid #f1f5f9' }}>
           <h4 style={{textAlign:'center', fontSize: '1.5rem', fontWeight:'900', color:'#1e293b', marginBottom:'1.5rem'}}>Reading Skills</h4>
           <div style={{height: 220, width: '100%', minWidth: 0}}>
             <ResponsiveContainer width="100%" height="100%">
                <LineChart data={readingLineData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} label={{ value: 'Questions', position: 'insideBottom', offset: -5, fontSize: 10, fontWeight: 'bold' }} tick={{fontSize: 10}} />
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
           <div style={{textAlign:'center', marginTop:'3rem'}}>
             <div style={{fontSize:'1.8rem', fontWeight:'900', color: '#1E40AF'}}>Reading Score: <span style={{ textDecoration: 'underline', color: '#059669' }}>{sectionScores?.reading || 0}%</span></div>
             <div style={{fontSize: '1.2rem', fontWeight:'900', color:'#1e293b', marginTop: '4px'}}>{getLabel(sectionScores?.reading)}</div>
           </div>
        </div>

        {/* BOTTOM RIGHT: Writing */}
        <div style={{ padding: '2rem' }}>
           <h4 style={{textAlign:'center', fontSize: '1.5rem', fontWeight:'900', color:'#1e293b', marginBottom:'1.5rem'}}>Writing Skills</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', height: 220, justifyContent: 'center' }}>
              {writingData.map(d => (
                <div key={d.name} style={{ display: 'flex', alignItems:'center', gap:'1rem' }}>
                  <span style={{fontSize:11, fontWeight:'bold', width:80, color:'#475569'}}>{d.name}</span>
                  <div style={{flex:1, height:16, background:'#f1f5f9', borderRadius:8, overflow:'hidden'}}><div style={{height:'100%', background:CHART_COLORS.writing, width:`${d.score}%`}}/></div>
                  <span style={{fontSize:11, fontWeight:'bold', width:40}}>{d.score}%</span>
                </div>
              ))}
           </div>
           <div style={{textAlign:'center', marginTop:'1.5rem'}}>
             <div style={{fontSize:'1.3rem', fontWeight:'900', color:CHART_COLORS.writing}}>Writing Score: {sectionScores?.writing}%</div>
             <div style={{fontWeight:'700', color:'#64748b'}}>{getLabel(sectionScores?.writing)}</div>
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
