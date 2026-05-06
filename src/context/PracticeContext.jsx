import React, { createContext, useContext, useState } from "react";
import { 
  generateListeningQuestions, 
  generateSpeakingQuestions, 
  generateReadingPassages, 
  generateWritingData 
} from "../utils/groq";
import { SECTIONS } from "./TestContext";

const PracticeContext = createContext();

export const PracticeProvider = ({ children }) => {
  const [practiceState, setPracticeState] = useState({
    isPracticing: false,
    practiceSectionId: null,
    practiceDifficulty: null,
    practiceCompleted: false,
    practiceResults: null,
    currentQuestionIndex: 0,
    responses: { 
      listening: [],
      speaking: [],
      reading: [],
      writing: { essay: "", grammar: [] }
    }
  });

  const [practiceQuestions, setPracticeQuestions] = useState(null);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);

  const startPractice = async (sectionId, difficulty = "Medium") => {
    setIsLoadingQuestions(true);
    try {
      let questions;
      if (sectionId === 'listening') questions = await generateListeningQuestions(difficulty, true);
      else if (sectionId === 'speaking') questions = await generateSpeakingQuestions(difficulty, true);
      else if (sectionId === 'reading') questions = await generateReadingPassages(difficulty, true);
      else if (sectionId === 'writing') questions = await generateWritingData(difficulty, true);

      setPracticeQuestions({ [sectionId]: questions });
      
      setPracticeState({
        isPracticing: true,
        practiceSectionId: sectionId,
        practiceDifficulty: difficulty,
        practiceCompleted: false,
        practiceResults: null,
        currentQuestionIndex: 0,
        responses: { 
          listening: [],
          speaking: [],
          reading: [],
          writing: { essay: "", grammar: [] }
        }
      });
    } catch (err) {
      console.error("Practice start failed:", err);
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const stopPractice = () => {
    setPracticeState({
      isPracticing: false,
      practiceSectionId: null,
      practiceDifficulty: null,
      practiceCompleted: false,
      practiceResults: null,
      currentQuestionIndex: 0,
      responses: { 
        listening: [],
        speaking: [],
        reading: [],
        writing: { essay: "", grammar: [] }
      }
    });
    setPracticeQuestions(null);
  };

  const generateReport = (responses, sectionId) => {
    let score = 0;
    const insights = [];
    const sectionConfig = SECTIONS.find(s => s.id === sectionId);
    const totalQuestions = sectionConfig?.questions || 10;

    if (sectionId === "listening") {
      const scores = (responses.listening || []).map(r => r.score || 0);
      score = Math.round(scores.reduce((a, b) => a + b, 0) / totalQuestions);
      if (score < 60) insights.push("Practice listening to diverse accents.");
      else insights.push("Great accuracy in auditory processing.");
    } else if (sectionId === "speaking") {
      const scores = (responses.speaking || []).map(r => ((r.accuracy || 0) + (r.fluency || 0)) / 2);
      score = Math.round(scores.reduce((a, b) => a + b, 0) / totalQuestions);
      if (score < 60) insights.push("Focus on clearer articulation.");
      else insights.push("Strong speaking fluency.");
    } else if (sectionId === "reading") {
      const readingTotal = SECTIONS.find(s => s.id === "reading")?.questions || 20;
      const scores = (responses.reading || []).map(r => r.score || 0);
      score = Math.round(scores.reduce((a, b) => a + b, 0) / readingTotal);
      if (score < 60) insights.push("Work on vocabulary and comprehension.");
      else insights.push("High proficiency in reading.");
    } else if (sectionId === "writing") {
      const essayMark = ((responses.writing?.essayScore?.score || 0) / 100) * 10;
      const grammarMarks = (responses.writing?.grammarScores || []).reduce((acc, q) => acc + ((q.score || 0) >= 80 ? 1 : 0), 0);
      score = Math.round(((essayMark + grammarMarks) / 20) * 100);
      if (score < 60) insights.push("Review grammar and sentence structures.");
      else insights.push("Excellent writing coherence.");
    }

    return {
      studentInfo: { name: "Practice User", attemptId: `PRAC-${Math.random().toString(36).substr(2, 6).toUpperCase()}`, date: new Date().toISOString() },
      sectionScores: { [sectionId]: score },
      overallScore: score,
      insights,
      detailedData: responses
    };
  };

  const nextPracticeQuestion = (sectionId, response) => {
    setPracticeState((prev) => {
      const newResponses = { ...prev.responses };
      
      const responseWithContext = {
        ...response,
        timestamp: new Date().toISOString(),
        isPractice: true
      };

      if (Array.isArray(newResponses[sectionId])) {
        newResponses[sectionId][prev.currentQuestionIndex] = responseWithContext;
      } else {
        newResponses[sectionId] = { ...newResponses[sectionId], ...responseWithContext };
      }

      const section = SECTIONS.find(s => s.id === sectionId);
      const isLastQuestion = prev.currentQuestionIndex === (section.questions - 1);

      if (isLastQuestion) {
        setTimeout(() => {
          const report = generateReport(newResponses, sectionId);
          setPracticeState(s => ({
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
        currentQuestionIndex: prev.currentQuestionIndex + 1,
      };
    });
  };

  const updatePracticeWriting = (data) => {
    setPracticeState((prev) => ({
      ...prev,
      responses: {
        ...prev.responses,
        writing: { ...prev.responses.writing, ...data },
      },
    }));
  };

  const completePracticeWriting = (finalWritingData) => {
    setPracticeState((prev) => {
      const updatedResponses = {
        ...prev.responses,
        writing: { ...prev.responses?.writing, ...finalWritingData }
      };
      const report = generateReport(updatedResponses, 'writing');
      return {
        ...prev,
        responses: updatedResponses,
        practiceCompleted: true,
        practiceResults: report
      };
    });
  };

  const value = {
    practiceState,
    practiceQuestions,
    isLoadingQuestions,
    startPractice,
    stopPractice,
    nextPracticeQuestion,
    updatePracticeWriting,
    completePracticeWriting
  };

  return <PracticeContext.Provider value={value}>{children}</PracticeContext.Provider>;
};

export const usePractice = () => {
  const context = useContext(PracticeContext);
  if (!context) throw new Error("usePractice must be used within a PracticeProvider");
  return context;
};
