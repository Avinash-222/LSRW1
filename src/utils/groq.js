import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true // Since this is a client-side app for now
});

const DEFAULT_MODEL = "llama-3.3-70b-versatile";

export const generateListeningQuestions = async (difficulty = "Medium", isPractice = false) => {
  const depthPrompt = isPractice 
    ? `Create questions for a practice test. Difficulty: ${difficulty}. ${difficulty === 'Easy' ? 'Basic, guided sentences.' : difficulty === 'Medium' ? 'Moderate reasoning sentences.' : 'Exam-level complex sentences.'}`
    : `Create questions for a formal assessment.`;

  const prompt = `Generate exactly 10 diverse English sentences for a 'repeat after me' listening exercise.
  Focus on common professional and academic topics. 
  ${depthPrompt}
  Sentences should be 8-15 words long.
  Return ONLY a JSON object with a "questions" key containing an array of strings.`;

  const chatCompletion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: DEFAULT_MODEL,
    response_format: { type: "json_object" },
  });

  const data = JSON.parse(chatCompletion.choices[0].message.content);
  return data.questions;
};

export const generateSpeakingQuestions = async (difficulty = "Medium", isPractice = false) => {
  const depthPrompt = isPractice 
    ? `Practice test. Difficulty: ${difficulty}. ${difficulty === 'Easy' ? 'Basic vocabulary.' : difficulty === 'Medium' ? 'Moderate vocabulary.' : 'Advanced vocabulary.'}`
    : `Formal assessment.`;

  const prompt = `Generate exactly 10 diverse English sentences for a speaking articulation exercise.
  Topics: Technology, Nature, History, Leadership, Innovation, Wellbeing.
  ${depthPrompt}
  Sentences should be 10-20 words long.
  Return ONLY a JSON object with a "questions" key containing an array of strings.`;

  const chatCompletion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: DEFAULT_MODEL,
    response_format: { type: "json_object" },
  });

  const data = JSON.parse(chatCompletion.choices[0].message.content);
  return data.questions;
};

export const generateReadingPassages = async (difficulty = "Medium", isPractice = false) => {
  const depthPrompt = isPractice 
    ? `Practice test. Difficulty: ${difficulty}. ${difficulty === 'Easy' ? 'Simple passages.' : difficulty === 'Medium' ? 'Moderate passages.' : 'Complex passages.'}`
    : `Formal assessment.`;

  const prompt = `Generate 2 distinct reading passages for an English proficiency test.
  Each passage should be roughly 250 words.
  ${depthPrompt}
  Each passage MUST include exactly 10 questions in this specific order:
  - First 5 questions MUST be Multiple Choice (type: "mcq") with 4 options and the correct answer.
  - Next 5 questions MUST be Descriptive (type: "descriptive") with a sample correct answer.
  
  Format the output as ONLY a JSON object with a "passages" key containing an array of objects matching this structure:
  {
    "id": number,
    "title": string,
    "text": string,
    "questions": [
      { "id": number, "type": "mcq", "question": string, "options": [string], "answer": string },
      { "id": number, "type": "descriptive", "question": string, "answer": string }
    ]
  }`;

  const chatCompletion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: DEFAULT_MODEL,
    response_format: { type: "json_object" },
  });

  const data = JSON.parse(chatCompletion.choices[0].message.content);
  return data.passages;
};

export const generateWritingData = async (difficulty = "Medium", isPractice = false) => {
  const depthPrompt = isPractice 
    ? `Practice test. Difficulty: ${difficulty}. ${difficulty === 'Easy' ? 'Basic essay topics.' : difficulty === 'Medium' ? 'Moderate essay topics.' : 'Complex essay topics.'}`
    : `Formal assessment.`;

  const prompt = `Generate content for a Writing assessment:
  - 3 DISTINCT and DIVERSE essay topics/prompts (detailed and professional). Ensure they cover different fields like Technology, Society, Environment, or Ethics.
  ${depthPrompt}
  - 6 grammar/linguistic audit questions.
  
  Grammar questions MUST have:
  - "id": number
  - "type": string (MUST be one of: "active_passive", "reported_speech", "verb_forms", "error_detection", "sentence_joining")
  - "instruction": string (e.g., "Convert the given sentence into passive voice")
  - "prompt": string (the actual sentence to be transformed)
  - "answer": string (the correct transformed version)

  Return ONLY a JSON object with "topics" (array of 3 strings) and "grammar" (array of 6 objects) keys.`;

  const chatCompletion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: DEFAULT_MODEL,
    response_format: { type: "json_object" },
  });

  const data = JSON.parse(chatCompletion.choices[0].message.content);
  return {
    topics: data.topics, // Now expecting 3 topics for better randomization
    grammar: data.grammar
  };
};

export const generateAllQuestions = async () => {
  try {
    const [listening, speaking, reading, writing] = await Promise.all([
      generateListeningQuestions(),
      generateSpeakingQuestions(),
      generateReadingPassages(),
      generateWritingData()
    ]);

    return {
      listening,
      speaking,
      reading,
      writing
    };
  } catch (error) {
    console.error("Error generating questions from Groq:", error);
    throw error;
  }
};

export const evaluateWritingWithAI = async (topic, essay) => {
  const prompt = `You are an expert English examiner similar to Cambridge PET/BEC evaluators.

Your task is to carefully evaluate the student's writing response for the LSRW assessment.

Follow the same strict evaluation style used in high-level English proficiency exams such as PET, BEC, and Cambridge English writing tests.

Evaluate the answer using the following criteria:

1. Content (0–5)
Check if the student answered the question completely and stayed on the topic. Identify if any important points are missing.

2. Communicative Achievement (0–5)
Evaluate whether the writing successfully communicates the intended message. Check if the tone, style, and purpose are appropriate for the task (formal, semi-formal, or informal).

3. Organization (0–5)
Check whether the writing follows a clear structure:
* Introduction
* Body paragraphs
* Conclusion
Evaluate logical flow, paragraphing, and use of linking words such as however, therefore, firstly, finally, etc.

4. Language (0–5)
Evaluate grammar, vocabulary, sentence variety, spelling, and punctuation.
Identify grammatical errors, awkward phrasing, and incorrect word usage.

Important Evaluation Rules:
* Do NOT give random scores.
* Carefully read the entire answer before scoring.
* Penalize missing structure (no introduction/body/conclusion).
* Penalize poor grammar or unclear sentences.
* Reward good vocabulary and complex sentence structures.

Output Format: MUST BE ONLY A VALID JSON OBJECT exactly like this schema:
{
  "overallScore": number, // X out of 20
  "contentFeedback": string, // Content: X/5. Explain what was good and what was missing.
  "communicativeFeedback": string, // Communicative Achievement: X/5. Explain if the message is clear and appropriate.
  "organizationFeedback": string, // Organization: X/5. Comment on paragraph structure, logical flow, and connectors.
  "languageFeedback": string, // Language: X/5. Mention grammar mistakes, vocabulary quality, and sentence structure.
  "grammarCorrections": [
    {"incorrect": string, "corrected": string}
  ],
  "improvedSampleAnswer": string
}

Question Topic: ${topic}
Student Answer: ${essay}`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: DEFAULT_MODEL,
      response_format: { type: "json_object" },
    });

    const data = JSON.parse(chatCompletion.choices[0].message.content);
    return data;
  } catch (error) {
    console.error("Error evaluating writing with Groq:", error);
    return {
      overallScore: 0,
      contentFeedback: "Evaluation failed.",
      communicativeFeedback: "",
      organizationFeedback: "",
      languageFeedback: "",
      grammarCorrections: [],
      improvedSampleAnswer: ""
    };
  }
};
