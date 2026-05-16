import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  LISTENING_QUESTIONS, 
  SPEAKING_QUESTIONS, 
  READING_PASSAGES, 
  WRITING_TOPICS, 
  GRAMMAR_QUESTIONS 
} from "../data/questions";
import { generateAllQuestions } from "../utils/groq";

const TestContext = createContext();

export const SECTIONS = [
  {
    id: "listening",
    name: "Listening",
    questions: 10,
    instructions: "Listen to the audio sentence and repeat it clearly.",
  },
  {
    id: "speaking",
    name: "Speaking",
    questions: 10,
    instructions: "Read the sentence displayed on screen aloud.",
  },
  {
    id: "reading",
    name: "Reading",
    questions: 20,
    instructions: "Read the passages and answer the comprehension questions.",
  },
  {
    id: "writing",
    name: "Writing",
    questions: 1,
    instructions:
      "Write an essay on the given topic and complete the grammar exercises.",
  },
];

export const TestProvider = ({ children }) => {
  const [testQuestions, setTestQuestions] = useState(() => {
    try {
      const savedQuestions = localStorage.getItem("lsrw_test_questions");
      if (savedQuestions) {
        return JSON.parse(savedQuestions);
      }
    } catch (e) {
      console.error("Failed to load saved questions:", e);
    }
    return {
      listening: LISTENING_QUESTIONS,
      speaking: SPEAKING_QUESTIONS,
      reading: READING_PASSAGES,
      writing: { topics: WRITING_TOPICS, grammar: GRAMMAR_QUESTIONS }
    };
  });

  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);

  const initialState = {
    currentSectionIndex: -1, // -1 for landing/intro
    currentQuestionIndex: 0,
    userName: "Candidate",
    user: null, 
    hasEntered: false, 
    currentTab: "dashboard", // Persist active tab
    examAttemptId: `EXAM-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    testDate: new Date().toISOString(),
    responses: {
      listening: [],
      speaking: [],
      reading: [],
      writing: { essay: "", grammar: [] },
    },
    completed: false,
    startTime: null,
    results: null,
    history: [],
    isPracticing: false,
    practiceSectionId: null,
    practiceCompleted: false,
    practiceResults: null,
    selectedPracticeSkill: null
  };

  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem("lsrw_test_state");
      const savedHistory = localStorage.getItem("lsrw_test_history");

      let finalState = { ...initialState };
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && 'currentSectionIndex' in parsed) {
          finalState = { ...finalState, ...parsed };
        }
      }

      if (savedHistory) {
        finalState.history = JSON.parse(savedHistory);
      }

      return finalState;
    } catch (err) {
      console.error("Failed to parse test state", err);
    }
    return initialState;
  });

  useEffect(() => {
    try {
      const { history, ...rest } = state;
      localStorage.setItem("lsrw_test_state", JSON.stringify(rest));
      localStorage.setItem("lsrw_test_history", JSON.stringify(history));
      localStorage.setItem("lsrw_test_questions", JSON.stringify(testQuestions));
    } catch (err) {
      console.warn("Storage sequence failed (possibly quota exceeded):", err);
    }
  }, [state, testQuestions]);

  const shuffleArray = (array) => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  const startTest = async (userName = "Candidate") => {
    setIsLoadingQuestions(true);
    try {
      // Fetch new questions for this attempt
      const newQuestions = await generateAllQuestions();
      // Even AI questions should be shuffled if multiple are returned
      if (newQuestions.writing?.topics) newQuestions.writing.topics = shuffleArray(newQuestions.writing.topics);
      if (newQuestions.writing?.grammar) newQuestions.writing.grammar = shuffleArray(newQuestions.writing.grammar);
      if (newQuestions.listening) newQuestions.listening = shuffleArray(newQuestions.listening);
      if (newQuestions.speaking) newQuestions.speaking = shuffleArray(newQuestions.speaking);
      
      setTestQuestions(newQuestions);
      localStorage.setItem("lsrw_test_questions", JSON.stringify(newQuestions));
    } catch (err) {
      console.error("Falling back to static questions & randomizing", err);
      // Shuffle static questions for variety
      const randomizedStatic = {
        listening: shuffleArray(LISTENING_QUESTIONS),
        speaking: shuffleArray(SPEAKING_QUESTIONS),
        reading: shuffleArray(READING_PASSAGES),
        writing: { 
          topics: shuffleArray(WRITING_TOPICS), 
          grammar: shuffleArray(GRAMMAR_QUESTIONS) 
        }
      };
      setTestQuestions(randomizedStatic);
      localStorage.setItem("lsrw_test_questions", JSON.stringify(randomizedStatic));
    } finally {
      setIsLoadingQuestions(false);
      setState((prev) => ({
        ...prev,
        currentSectionIndex: 0,
        currentQuestionIndex: 0,
        userName: userName,
        examAttemptId: `EXAM-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        testDate: new Date().toISOString(),
        startTime: Date.now(),
        responses: {
          listening: [],
          speaking: [],
          reading: [],
          writing: { essay: "", grammar: {} },
        },
        completed: false,
        results: null,
      }));
    }
  };

  const nextQuestion = (sectionId, response) => {
    setState((prev) => {
      const newResponses = { ...prev.responses };
      
      // Ensure we preserve the attempt context
      const responseWithContext = {
        ...response,
        exam_attempt_id: prev.examAttemptId,
        timestamp: new Date().toISOString()
      };

      if (Array.isArray(newResponses[sectionId])) {
        newResponses[sectionId][prev.currentQuestionIndex] = responseWithContext;
      } else {
        newResponses[sectionId] = { ...newResponses[sectionId], ...responseWithContext };
      }

      const section = SECTIONS[prev.currentSectionIndex];
      const isLastQuestion =
        prev.currentQuestionIndex === section.questions - 1;

      if (isLastQuestion) {
        if (prev.isPracticing) {
          // If we are practicing, don't move to the next section
          // Instead, trigger report generation for this section
          setTimeout(() => {
            const report = generateReport(newResponses);
            setState(s => ({
              ...s,
              responses: newResponses,
              practiceCompleted: true,
              practiceResults: report
            }));
          }, 100);

          return {
            ...prev,
            responses: newResponses
          };
        }

        return {
          ...prev,
          responses: newResponses,
          currentSectionIndex: prev.currentSectionIndex + 1,
          currentQuestionIndex: 0,
        };
      }

      return {
        ...prev,
        responses: newResponses,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
      };
    });
  };

  const updateWriting = (data) => {
    setState((prev) => ({
      ...prev,
      responses: {
        ...prev.responses,
        writing: { ...prev.responses.writing, ...data },
      },
    }));
  };

  const generateReport = (responses) => {
    // 1. Listening Score Calculation (Fixed: Divide by total questions)
    const listeningTotal = SECTIONS.find(s => s.id === "listening")?.questions || 10;
    const listeningScores = (responses.listening || []).map(r => r.score || 0);
    const listeningScore = Math.round(listeningScores.reduce((a, b) => a + b, 0) / listeningTotal);

    // 2. Speaking Score Calculation (Fixed: Divide by total questions)
    const speakingTotal = SECTIONS.find(s => s.id === "speaking")?.questions || 10;
    const speakingScores = (responses.speaking || []).map(r => {
      const acc = typeof r.accuracy === 'number' ? r.accuracy : 0;
      const flu = typeof r.fluency === 'number' ? r.fluency : 0;
      return (acc + flu) / 2;
    });
    const speakingScore = Math.round(speakingScores.reduce((a, b) => a + b, 0) / speakingTotal);

    // 3. Reading Score Calculation (Fixed: Divide by total questions)
    const readingTotal = SECTIONS.find(s => s.id === "reading")?.questions || 20;
    const readingScores = (responses.reading || []).map(r => r.score || 0);
    const readingScore = Math.round(readingScores.reduce((a, b) => a + b, 0) / readingTotal);

    // 4. Writing Score Calculation (Essay 10 + Grammar 10 = Total 20)
    const essayData = responses.writing?.essayScore || { score: 0 };
    const grammarData = responses.writing?.grammarScores || [];
    
    // Essay: (Original 0-100 score) -> convert to 0-10 marks
    const essayMark = ((essayData.score || 0) / 100) * 10;
    
    // Grammar: 1 mark per question (Already 0 or 100 in logic, but let's be explicit)
    const grammarMarks = grammarData.reduce((acc, q) => acc + ((q.score || 0) >= 80 ? 1 : 0), 0);
    
    const combinedWritingScore = essayMark + grammarMarks;
    const writingPercentage = (combinedWritingScore / 20) * 100;

    // Overall Score (Average of all 4 sections)
    const overallScore = Math.round((listeningScore + speakingScore + readingScore + writingPercentage) / 4);

    // Topic-wise Grammar Performance
    const grammarCategories = ['Speech', 'Voice', 'Tense', 'Agreement', 'Articles', 'Error Detection', 'General'];
    const grammarPerformance = grammarCategories.reduce((acc, cat) => {
      const items = grammarData.filter(g => (g.category || 'General') === cat);
      if (items.length === 0) return acc;
      const correct = items.filter(i => (i.score || 0) >= 80).length;
      acc[cat] = { correct, total: items.length, accuracy: (correct / items.length) * 100 };
      return acc;
    }, {});

    // Skill Analysis
    const insights = [];
    if (listeningScore < 60) insights.push("Listening comprehension needs improvement.");
    else if (listeningScore >= 80) insights.push("Excellent auditory processing and retention.");

    if (speakingScore < 60) insights.push("Focus on oral articulation and professional pacing.");
    else if (speakingScore >= 80) insights.push("Strong speaking fluency and phonetic accuracy.");

    if (readingScore < 60) insights.push("Develop better textual semantic analysis and MCQ accuracy.");
    else if (readingScore >= 80) insights.push("High proficiency in reading comprehension.");

    if (writingPercentage < 60) insights.push("Focus on grammar accuracy and syntactic coherence in writing.");
    else if (writingPercentage >= 80) insights.push("Sophisticated authoring skills and grammatical precision.");

    return {
      studentInfo: {
        name: state.userName || "Candidate",
        attemptId: state.examAttemptId || "N/A",
        date: state.testDate || new Date().toISOString()
      },
      sectionScores: {
        listening: listeningScore,
        speaking: speakingScore,
        reading: readingScore,
        writing: Math.round(writingPercentage) || 0,
        essayMark: Number((essayMark || 0).toFixed(1)),
        grammarMarks: grammarMarks,
        grammarPerformance: grammarPerformance
      },
      overallScore: overallScore || 0,
      feedback: {
        listening: listeningScore < 70 ? "Needs focus on identifying key arguments in speed-normal speech." : "Capable of understanding complex academic discourse.",
        speaking: speakingScore < 70 ? "Practice reducing hesitations and maintaining consistent rhythm." : "Natural professional articulation with minimal disfluencies.",
        reading: readingScore < 70 ? "Strengthen vocabulary and inference-based comprehension." : "Quickly identifies main ideas and subtle textual nuances.",
        writing: writingPercentage < 70 ? "Revise sentence structures and work on logical transition markers." : "Highly coherent responses with diverse lexical choices."
      },
      insights,
      detailedData: responses // Store everything for the audit trail
    };

  };

  const completeTest = (finalWritingData) => {
    try {
      setState((prev) => {
        const updatedResponses = {
          ...prev.responses,
          writing: { ...prev.responses?.writing, ...finalWritingData }
        };
        
        let report;
        try {
          report = generateReport(updatedResponses);
        } catch (reportErr) {
          console.error("Report generation logic crashed:", reportErr);
          // Create a fallback report skeleton to avoid total app failure
          report = {
            studentInfo: { name: prev.userName || "Candidate", attemptId: prev.examAttemptId || "N/A", date: new Date().toISOString() },
            sectionScores: { listening: 0, speaking: 0, reading: 0, writing: 0, grammarPerformance: {} },
            overallScore: 0,
            feedback: { listening: "Error", speaking: "Error", reading: "Error", writing: "Error" },
            insights: ["An error occurred during report generation."],
            detailedData: updatedResponses
          };
        }

        if (prev.isPracticing) {
          return {
            ...prev,
            responses: updatedResponses,
            practiceCompleted: true,
            practiceResults: report
          };
        }

        const currentHistory = Array.isArray(prev.history) ? prev.history : [];
        const newHistory = [report, ...currentHistory].slice(0, 10);
        
        return {
          ...prev,
          responses: updatedResponses,
          completed: true,
          currentSectionIndex: SECTIONS.length,
          results: report,
          history: newHistory
        };
      });
    } catch (testErr) {
      console.error("completeTest critical failure:", testErr);
      alert("Test completion failed. Check console for details.");
    }
  };

  const startPractice = async (sectionId) => {
    setIsLoadingQuestions(true);
    try {
      let questions;
      const { 
        generateListeningQuestions, 
        generateSpeakingQuestions, 
        generateReadingPassages, 
        generateWritingData 
      } = await import("../utils/groq");

      if (sectionId === 'listening') questions = await generateListeningQuestions();
      else if (sectionId === 'speaking') questions = await generateSpeakingQuestions();
      else if (sectionId === 'reading') questions = await generateReadingPassages();
      else if (sectionId === 'writing') questions = await generateWritingData();

      setTestQuestions(prev => ({ ...prev, [sectionId]: questions }));
      
      setState(prev => ({
        ...prev,
        isPracticing: true,
        practiceSectionId: sectionId,
        practiceCompleted: false,
        practiceResults: null,
        currentSectionIndex: SECTIONS.findIndex(s => s.id === sectionId),
        currentQuestionIndex: 0,
        responses: { 
          listening: [],
          speaking: [],
          reading: [],
          writing: { essay: "", grammar: [] }
         }
      }));
    } catch (err) {
      console.error("Practice start failed:", err);
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const stopPractice = () => {
    setState(prev => ({
      ...prev,
      isPracticing: false,
      practiceSectionId: null,
      practiceCompleted: false,
      practiceResults: null,
      currentSectionIndex: -1,
      currentQuestionIndex: 0
    }));
  };

  const resetTest = () => {
    localStorage.removeItem("lsrw_test_state");
    setState(prev => ({
      ...initialState,
      hasEntered: prev.hasEntered,
      user: prev.user,
      userName: prev.userName,
      history: prev.history || [] // Preserve history even on reset
    }));
    setCurrentTab("dashboard");
  };

  const viewPastReport = (report) => {
    setState(prev => ({
      ...prev,
      completed: true,
      currentSectionIndex: SECTIONS.length,
      results: report
    }));
    setCurrentTab("assessments");
  };

  const setCurrentTab = (tab) => {
    setState(prev => ({ ...prev, currentTab: tab }));
  };

  const setSelectedPracticeSkill = (skill) => {
    setState(prev => ({ ...prev, selectedPracticeSkill: skill }));
  };

  const loginUser = (userData) => {
    setState(prev => ({
      ...prev,
      user: userData,
      userName: `${userData.firstName} ${userData.lastName}`
    }));
  };

  const logoutUser = () => {
    localStorage.removeItem("lsrw_test_state");
    setState(prev => ({
      ...prev,
      ...initialState,
      hasEntered: false,
      history: prev.history || []
    }));
    setCurrentTab("dashboard");
  };

  const setHasEntered = (val) => {
    setState(prev => ({ ...prev, hasEntered: val }));
  };

  // Only force tab changes when test starts or ends
  useEffect(() => {
    if (state.currentSectionIndex !== -1 && !state.completed) {
      setCurrentTab("assessments");
    } else if (state.completed && state.results) {
      setCurrentTab("assessments"); 
    }
  }, [state.currentSectionIndex, state.completed]);

  const value = {
    state,
    startTest,
    nextQuestion,
    updateWriting,
    completeTest,
    startPractice,
    stopPractice,
    isPracticing: state.isPracticing,
    practiceCompleted: state.practiceCompleted,
    practiceResults: state.practiceResults,
    resetTest,
    viewPastReport,
    loginUser,
    logoutUser,
    setHasEntered,
    currentTab: state.currentTab,
    setCurrentTab,
    setSelectedPracticeSkill,
    testQuestions,
    isLoadingQuestions,
    currentSection: SECTIONS[state.currentSectionIndex] || null,
    progress: Math.max(0, (state.currentSectionIndex / SECTIONS.length) * 100),
  };

  return <TestContext.Provider value={value}>{children}</TestContext.Provider>;
};

export const useTest = () => {
  const context = useContext(TestContext);
  if (!context) throw new Error("useTest must be used within a TestProvider");
  return context;
};
