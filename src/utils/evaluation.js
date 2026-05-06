/**
 * STRICT ASSESSMENT EVALUATION ENGINE
 * Deterministic scoring based on actual user responses.
 */

/**
 * Validates if a response is meaningful.
 * Rejects empty, whitespace, null, or common filler text.
 */
const isValidResponse = (text) => {
  if (!text || typeof text !== 'string') return false;
  const trimmed = text.trim();
  
  // Rule: Minimum length threshold
  if (trimmed.length < 5) return false;
  
  const lower = trimmed.toLowerCase();
  
  // Rule: Repeated character patterns (e.g., "aaaaaaaa")
  if (/(.)\1{4,}/.test(lower)) return false;

  // Rule: Known dummy/filler text
  const fillers = [
    'i dont know', 'placeholder', 'asdf', 'test', 'unknown', 'na', 'n/a', 'nothing',
    'idk', '...', '---', 'abc', '123'
  ];
  if (fillers.includes(lower)) return false;
  
  // Rule: Irrelevant/Short gibberish
  if (trimmed.split(/\s+/).length < 1 && trimmed.length > 0) return false;

  return true;
};

/**
 * Calculates string similarity for linguistic analysis (Listening/Speaking/Descriptive).
 * Strictly penalizes empty/invalid responses.
 */
export const calculateSimilarity = (expected, actual) => {
  if (!isValidResponse(actual)) return 0;

  const s1 = expected.toLowerCase().replace(/[^\w\s]/g, '');
  const s2 = actual.toLowerCase().replace(/[^\w\s]/g, '');
  
  if (s1 === s2) return 100;

  const words1 = s1.split(/\s+/).filter(w => w.length > 0);
  const words2 = s2.split(/\s+/).filter(w => w.length > 0);
  
  if (words2.length === 0) return 0;

  // Jaccard-like intersection calculation
  const set1 = new Set(words1);
  const set2 = new Set(words2);
  let matches = 0;
  set2.forEach(word => {
    if (set1.has(word)) matches++;
  });

  const perfection = matches / words1.length;
  const accuracy = (matches / words2.length); // Penalize extra words/hallucinations
  
  const score = Math.round(((perfection * 0.7) + (accuracy * 0.3)) * 100);
  return Math.min(100, Math.max(0, score));
};

/**
 * Evaluates oral fluency and pace.
 */
export const evaluatePauses = (text, audioDuration) => {
  if (!text || audioDuration <= 0) return { score: 0, feedback: "No valid input detected." };

  const words = text.split(/\s+/).length;
  const expectedSecs = words * 0.65; // ~150 WPM benchmark for corporate clarity
  
  const ratio = audioDuration / expectedSecs;
  
  if (ratio > 2.0) return { score: 40, feedback: "Significant hesitation/pausing detected." };
  if (ratio > 1.4) return { score: 70, feedback: "Moderate fluency gaps; rhythm is inconsistent." };
  if (ratio < 0.4) return { score: 50, feedback: "Speech rate is too rapid for professional clarity." };
  
  return { score: 100, feedback: "Exemplary oral fluency and professional pacing." };
};

/**
 * Strict MCQ Evaluation
 */
export const evaluateMCQ = (expected, actual) => {
  if (!actual) return 0;
  return expected.toLowerCase().trim() === actual.toLowerCase().trim() ? 100 : 0;
};

/**
 * Strict Essay Evaluation (Corporate Grade)
 */
export const evaluateEssay = (topic, text) => {
  if (!isValidResponse(text)) return { score: 0, feedback: "No meaningful content submitted." };

  const wordCount = text.trim().split(/\s+/).length;
  if (wordCount < 50) return { score: 20, feedback: "Insufficient detail; response falls below threshold." };

  // Check for filler/repetition (very basic heuristic)
  const words = text.toLowerCase().match(/\b\w+\b/g);
  const wordFreq = {};
  words.forEach(w => wordFreq[w] = (wordFreq[w] || 0) + 1);
  const maxFreq = Math.max(...Object.values(wordFreq));
  
  if (maxFreq > wordCount * 0.2 && wordCount > 20) {
    return { score: 0, feedback: "Response rejected due to high repetition/filler detection." };
  }

  // Topic relevance (check if topic keywords are present)
  const topicKeywords = topic.toLowerCase().match(/\b\w{4,}\b/g) || [];
  const foundKeywords = topicKeywords.filter(k => text.toLowerCase().includes(k));
  const relevance = foundKeywords.length / topicKeywords.length;

  if (relevance < 0.2) return { score: 10, feedback: "Response lacks relevance to the assigned topic." };

  // Simple scoring based on length and relevance
  let score = 50; // Base for valid response
  if (wordCount >= 100) score += 20;
  if (wordCount >= 140) score += 10;
  score += (relevance * 20);

  return { 
    score: Math.min(100, Math.round(score)), 
    feedback: wordCount < 100 ? "Valid content but lacks required depth." : "Structurally sound and topic-aligned."
  };
};

/**
 * Section Aggregator
 * Formula: (Earned / Possible) * 100
 */
export const calculateSectionScore = (results) => {
  if (!results || results.length === 0) return 0;
  const total = results.reduce((acc, curr) => acc + (curr.score || 0), 0);
  return Math.round(total / results.length);
};
