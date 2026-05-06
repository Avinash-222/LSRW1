export const LISTENING_QUESTIONS = [
  "The quick brown fox jumps over the lazy dog.",
  "Technological advancements have revolutionized the way we communicate.",
  "Environmental conservation is essential for the future of our planet.",
  "The university offers a wide range of extracurricular activities.",
  "Scientific research plays a crucial role in medical breakthroughs.",
  "Effective leadership requires both empathy and decisiveness.",
  "Global trade has led to increased economic interdependence.",
  "Sustainable development aims to balance growth with social equity.",
  "Artificial intelligence is transforming various industries worldwide.",
  "Educational systems must adapt to the needs of the digital age."
];

export const SPEAKING_QUESTIONS = [
  "Confidence is the key to mastering any new skill in life.",
  "The architecture of the city blends modern style with historical charm.",
  "Innovation often stems from a combination of curiosity and persistence.",
  "Cultural diversity enriches our perspectives and fosters understanding.",
  "The transition to renewable energy is a global priority today.",
  "Digital literacy has become a fundamental requirement for the workforce.",
  "Mindfulness and meditation can significantly reduce daily stress levels.",
  "The exploration of space continues to inspire scientific wonder.",
  "Public health initiatives are vital for preventing widespread diseases.",
  "Collaborative efforts are necessary to address climate change effectively."
];

export const READING_PASSAGES = [
  {
    id: 1,
    title: "The Future of Urban Living",
    text: "As the world's population continues to migrate toward urban areas, cities are facing unprecedented challenges. By 2050, it is estimated that nearly 70% of the global population will live in cities. This growth necessitates a radical shift in how we design, build, and manage urban environments. Smart cities, which utilize data and technology to improve services and efficiency, are being hailed as the solution. These cities implement smart grids for energy, automated traffic management systems, and integrated public transportation. However, the transition is not without its hurdles. Privacy concerns regarding data collection and the digital divide – the gap between those with access to technology and those without – remain significant obstacles. Furthermore, urban planners must ensure that development is sustainable and inclusive, providing affordable housing and green spaces for all residents. The success of future cities depends on finding a balance between technological innovation and human-centric design.",
    questions: [
      { id: 1, type: 'mcq', question: "What percentage of the global population is estimated to live in cities by 2050?", options: ["50%", "60%", "70%", "80%"], answer: "70%" },
      { id: 2, type: 'mcq', question: "What is a primary feature of 'smart cities'?", options: ["Manual labor", "Data and technology usage", "Complete isolation", "Agricultural dominance"], answer: "Data and technology usage" },
      { id: 3, type: 'mcq', question: "Which of these is NOT mentioned as a hurdle for smart cities?", options: ["Privacy concerns", "Digital divide", "Space exploration", "Sustainability"], answer: "Space exploration" },
      { id: 4, type: 'mcq', question: "Urban planners must ensure development is:", options: ["Exclusive", "Sustainable and inclusive", "Purely technological", "Expensive"], answer: "Sustainable and inclusive" },
      { id: 5, type: 'mcq', question: "What does the success of future cities depend on?", options: ["Technology alone", "Balance of tech and human design", "Only green spaces", "Automated traffic only"], answer: "Balance of tech and human design" },
      { id: 6, type: 'descriptive', question: "What is the synonym for 'unprecedented' as used in the passage? (Grammar)", answer: "new / groundbreaking / singular" },
      { id: 7, type: 'descriptive', question: "State the main idea of the passage.", answer: "The challenges and potential solutions for future urban growth through smart city technology and sustainable planning." },
      { id: 8, type: 'descriptive', question: "Summarize the passage in one sentence.", answer: "The passage discusses the shift toward urban living and the importance of smart, sustainable, and inclusive city planning to meet future population demands." },
      { id: 9, type: 'descriptive', question: "Rewrite this sentence in your own words: 'Privacy concerns regarding data collection and the digital divide remain significant obstacles.'", answer: "" },
      { id: 10, type: 'descriptive', question: "Explain how smart grids contribute to urban efficiency.", answer: "" }
    ]
  },
  {
    id: 2,
    title: "The Importance of Biodiversity",
    text: "Biodiversity, the variety of life on Earth, is essential for the healthy functioning of ecosystems. It provides us with critical ecosystem services, such as pollination of crops, purification of water, and regulation of climate. Every species, no matter how small, plays a role in the intricate web of life. However, human activities are leading to a rapid loss of biodiversity. Habitat destruction, pollution, overexploitation of resources, and climate change are the primary drivers of this crisis. The extinction of a single species can have far-reaching consequences, disrupting entire food chains and reducing the resilience of ecosystems. Protecting biodiversity is not just an ethical obligation; it is a necessity for human survival. Conservation efforts, such as establishing protected areas, restoring degraded habitats, and implementing sustainable resource management, are crucial. We must recognize the intrinsic value of nature and take immediate action to preserve the biological heritage of our planet for future generations.",
    questions: [
      { id: 1, type: 'mcq', question: "What does biodiversity refer to?", options: ["Only animals", "Variety of life on Earth", "Water purification only", "Climate regulation"], answer: "Variety of life on Earth" },
      { id: 2, type: 'mcq', question: "Which of these is a listed 'ecosystem service'?", options: ["Industrialization", "Pollination of crops", "Deforestation", "Urban sprawl"], answer: "Pollination of crops" },
      { id: 3, type: 'mcq', question: "What are the primary drivers of the biodiversity crisis?", options: ["Human activities", "Volcanic eruptions", "Solar flares", "Natural selection"], answer: "Human activities" },
      { id: 4, type: 'mcq', question: "The loss of a single species can:", options: ["Have no effect", "Improve the ecosystem", "Disrupt entire food chains", "Increase resilience"], answer: "Disrupt entire food chains" },
      { id: 5, type: 'mcq', question: "Protecting biodiversity is a necessity for:", options: ["Only animals", "Human survival", "Technological growth", "Profit"], answer: "Human survival" },
      { id: 6, type: 'descriptive', question: "What is the antonym of 'degraded' as used in the passage? (Grammar)", answer: "restored / improved / pristine" },
      { id: 7, type: 'descriptive', question: "State the main idea of the passage.", answer: "The critical role of biodiversity in ecosystems and the urgent need for conservation due to human-driven loss." },
      { id: 8, type: 'descriptive', question: "Summarize the passage in one sentence.", answer: "The passage emphasizes that biodiversity is vital for ecosystem health and human survival, urging immediate conservation action to stop its rapid loss." },
      { id: 9, type: 'descriptive', question: "Rewrite this sentence in your own words: 'Every species, no matter how small, plays a role in the intricate web of life.'", answer: "" },
      { id: 10, type: 'descriptive', question: "List three conservation efforts mentioned in the text.", answer: "" }
    ]
  }
];

export const WRITING_TOPICS = [
  "Discuss the impact of social media on modern communication and interpersonal relationships.",
  "Evaluate the benefits and drawbacks of remote work in the current global economy.",
  "Is technology making us more socially isolated or more globally connected?",
  "The importance of environmental education in primary and secondary schools.",
  "Should artificial intelligence be regulated to prevent job displacement?",
  "The role of public transportation in reducing urban carbon footprints.",
  "Is higher education still a necessity in the 21st-century job market?",
  "The influence of advertising on teenage consumer behavior.",
  "Should government prioritize space exploration over local poverty alleviation?",
  "The impact of fast fashion on environmental sustainability.",
  "Is the traditional 40-hour work week still relevant in the digital age?",
  "The ethics of genetic engineering in food production.",
  "How does globalization affect local cultural identities?",
  "The importance of mental health awareness in the workplace.",
  "Transitioning to a cashless society: Benefits and security risks."
];

export const GRAMMAR_QUESTIONS = [
  { 
    id: 1, 
    type: 'conversion', 
    category: 'Speech',
    prompt: "Direct → Indirect: She said, 'I am tired.'", 
    answer: "She said that she was tired." 
  },
  { 
    id: 2, 
    type: 'conversion', 
    category: 'Voice',
    prompt: "Active → Passive: The chef prepared a delicious meal.", 
    answer: "A delicious meal was prepared by the chef." 
  },
  { 
    id: 3, 
    type: 'conversion', 
    category: 'Voice',
    prompt: "Passive → Active: The project was completed by the team.", 
    answer: "The team completed the project." 
  },
  { 
    id: 4, 
    type: 'mcq', 
    category: 'Tense',
    prompt: "Fill in the blank (Present Tense): If I ____ you, I accept the offer.", 
    options: ["am", "were", "was", "is"],
    answer: "were" 
  },
  { 
    id: 5, 
    type: 'mcq', 
    category: 'Tense',
    prompt: "Fill in the blank (Past Tense): If I ____ you, I would have accepted the offer.", 
    options: ["am", "were", "was", "is"],
    answer: "were" 
  },
  { 
    id: 6, 
    type: 'mcq', 
    category: 'Tense',
    prompt: "Fill in the blank (Future Tense): If I ____ you, I will accept the offer.", 
    options: ["am", "is", "were", "are"],
    answer: "am" 
  },
  { 
    id: 7, 
    type: 'mcq', 
    category: 'Agreement',
    prompt: "Subject-Verb Agreement: Each of the students ____ present.", 
    options: ["is", "are", "were", "be"],
    answer: "is" 
  },
  { 
    id: 8, 
    type: 'mcq', 
    category: 'Agreement',
    prompt: "Sentence Improvement: Choose the correct sentence.", 
    options: ["She don't know the answer", "She doesn't know the answer", "She not know the answer", "She hadn't know the answer"],
    answer: "She doesn't know the answer" 
  },
  { 
    id: 9, 
    type: 'text', 
    category: 'Articles',
    prompt: "Articles: _____ apple _____ day keeps the doctor away.", 
    answer: "An, a" 
  },
  { 
    id: 10, 
    type: 'text', 
    category: 'Error Detection',
    prompt: "Error Detection: Provide the correct version: 'He go to the market yesterday.'", 
    answer: "He went to the market yesterday." 
  }
];

