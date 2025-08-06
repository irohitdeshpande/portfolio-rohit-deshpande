/**
 * Local LLM Integration for Portfolio Chatbot
 * This module handles local LLM communication and fallback to pattern matching
 */

export interface LLMResponse {
  success: boolean;
  response: string;
  source: 'external-ai' | 'local-llm' | 'pattern' | 'fallback';
  confidence?: number;
}

export interface LLMConfig {
  apiEndpoint: string;
  model: string;
  maxTokens: number;
  temperature: number;
  timeout: number;
}

// Default configuration for local LLM (Ollama)
const DEFAULT_CONFIG: LLMConfig = {
  apiEndpoint: 'http://localhost:11434/api/generate',
  model: 'llama3.2:1b', // Lightweight model for fast responses
  maxTokens: 600, // Increased for longer answers
  temperature: 0.7,
  timeout: 10000, // 10 second timeout
};

// External AI Configuration
const EXTERNAL_AI_CONFIG = {
  openai: {
    apiEndpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4.0-flash',
    maxTokens: 600, // Increased for longer answers
    temperature: 0.7,
    timeout: 20000,
  },
  groq: {
    apiEndpoint: 'https://api.groq.com/openai/v1/chat/completions',
    model: 'llama3-8b-8192',
    maxTokens: 600, // Increased for longer answers
    temperature: 0.7,
    timeout: 20000,
  }
};



/**
 * Check if external AI is available
 */
export async function isExternalAIAvailable(): Promise<boolean> {
  // Always return true since we'll check server-side
  return true;
}

/**
 * Generate response using external AI via API endpoint
 */
export async function generateExternalAIResponse(userMessage: string): Promise<LLMResponse> {
  try {
    console.log('Sending request to /api/chat with message:', userMessage);
    
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: userMessage
      })
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`HTTP ${response.status}: ${errorText}`);
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log('Response data:', data);
    
    if (data.success) {
      return {
        success: true,
        response: data.response,
        source: 'external-ai',
        confidence: 0.9
      };
    } else {
      return {
        success: false,
        response: data.response || "I'm here to help! Feel free to ask about Rohit's projects, experience, or contact information.",
        source: 'fallback',
        confidence: 0.5
      };
    }
  } catch (error) {
    console.error('External AI API error:', error);
    return {
      success: false,
      response: "I'm experiencing some technical difficulties. Please try asking about Rohit's projects or contact information!",
      source: 'external-ai',
      confidence: 0,
    };
  }
}

/**
 * Portfolio context for LLM to understand Rohit's background
 */
const PORTFOLIO_CONTEXT = `
You are Rohit Deshpande, a Computer Engineering student at K.J. Somaiya College of Engineering with a passion for software development and data science. Here is your background:

EDUCATION:
- B.Tech Computer Engineering at K.J. Somaiya College (2022-2026) - GPA 8.40
- Class 12 CISCE Board: 95.40% (2020-2022)
- Class 10 CISCE Board: 95.80% (2010-2020)

EXPERIENCE:
- Software Engineer Intern at Arcon TechSolutions (Jun-Jul 2025): Backend systems, CRUD APIs, SQL, .NET 8 migration
- Operations Team Member at CSI-KJSCE (Jul 2023-May 2024): Event management, Tech Olympics, hackathons

TECHNICAL SKILLS:
- Languages: Python, TypeScript, JavaScript, C++, SQL
- Web Development: Astro, React, Node.js, TailwindCSS, HTML/CSS
- Data Science & AI: Scikit-learn, TensorFlow, OpenCV, Pandas, NumPy
- Tools: Git, MongoDB, Firebase, Postman, Jupyter

KEY PROJECTS:
- Portfolio Website (Astro, TypeScript, TailwindCSS)
- IntervAI: Mock Interview Platform (Vite, Firebase, Gemini API)
- Customer Churn Prediction (ML with Python, Scikit-learn)
- Face Mask Detector & AI Health Assistant (OpenCV, TensorFlow)
- Tweet Sentiment Analysis (NLTK, Streamlit)
- Quizify: AI-Driven Quiz Platform (MERN stack, Gemini API)

PERSONALITY:
- Enthusiastic about AI/ML and problem-solving
- Always eager to learn new technologies
- Driven by creating impactful solutions
- Based in Mumbai, India
- Approachable and loves discussing technology

INSTRUCTIONS:
- Respond as Rohit in first person ("I am", "My experience", etc.)
- Write in a natural, conversational, and friendly tone, like a real person
- Avoid repetitive greetings (e.g., do not start every answer with "Namaskar" or "Hello")
- Do not repeat the same phrases in every answer
- Give detailed, thoughtful, and well-structured answers (150-250 words if needed)
- If the user asks for details, provide in-depth explanations and examples
- Use relevant emojis naturally, but not in every sentence
- Occasionally add Marathi touches ("Namaskar", "Dhanyawad") only if it fits the context
- Focus on the specific aspect the user is asking about
- Never cut off answers midway; always complete your thought
- If the user asks for a summary, keep it concise; otherwise, be as helpful as possible
- Do not use generic chatbot phrases; answer as if you are Rohit
`;

/**
 * Check if local LLM is available
 */
export async function isLLMAvailable(config: LLMConfig = DEFAULT_CONFIG): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    
    const response = await fetch(`${config.apiEndpoint.replace('/api/generate', '/api/tags')}`, {
      method: 'GET',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.log('Local LLM not available:', error);
    return false;
  }
}

/**
 * Generate response using local LLM
 */
export async function generateLLMResponse(
  userMessage: string,
  config: LLMConfig = DEFAULT_CONFIG
): Promise<LLMResponse> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);

    const prompt = `${PORTFOLIO_CONTEXT}\n\nUser Question: ${userMessage}\n\nRohit's Response:`;

    const response = await fetch(config.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config.model,
        prompt: prompt,
        stream: false,
        options: {
          num_predict: config.maxTokens,
          temperature: config.temperature,
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.response && data.response.trim()) {
      return {
        success: true,
        response: data.response.trim(),
        source: 'local-llm',
        confidence: 0.9,
      };
    } else {
      throw new Error('Empty response from LLM');
    }
  } catch (error) {
    console.warn('LLM generation failed:', error);
    return {
      success: false,
      response: '',
      source: 'local-llm',
      confidence: 0,
    };
  }
}

/**
 * Enhanced pattern matching with fuzzy search
 */
function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
  
  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
  
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      );
    }
  }
  
  return matrix[str2.length][str1.length];
}

/**
 * Pattern matching fallback system
 */
const PATTERN_RESPONSES = {
  greetings: {
    keywords: ['hello', 'hi', 'hey', 'good morning', 'good evening', 'howdy', 'greetings', 'kasa kay', 'namaste', 'sup', 'namaskar'],
    responses: [
      "Namaskar! � I'm Rohit Deshpande! Kasa kay? Feel free to ask me about my projects and skills!",
      "Hello! � Welcome to my portfolio! I'd love to share about my tech journey with you!",
      "Hi there! � Great to meet you! What would you like to know about my work?",
    ]
  },
  aboutMe: {
    keywords: ['tell me about', 'who are you', 'about yourself', 'introduce', 'background'],
    responses: [
      "I'm a passionate Computer Engineering student at K.J. Somaiya College! 🎓 Love working on AI/ML and web development projects.",
      "I'm Rohit Deshpande from Mumbai! 💻 A tech enthusiast who combines coding skills with creative problem-solving!",
    ]
  },
  skills: {
    keywords: ['skills', 'technologies', 'programming', 'tech stack', 'languages', 'expertise'],
    responses: [
      "My expertise includes Python, TypeScript, React, and AI/ML tools! 💻 Also work with TensorFlow and Scikit-learn.",
      "I work with web development (React, Astro), data science (Python, Pandas), and AI technologies! 🚀",
    ]
  },
  projects: {
    keywords: ['projects', 'work', 'built', 'developed', 'portfolio'],
    responses: [
      "I've built IntervAI (mock interview platform), ML prediction models, and AI applications! 🚀 Each project teaches me something new!",
      "My portfolio has everything from web apps to ML models! 💡 Love working on innovative solutions!",
    ]
  },
  education: {
    keywords: ['education', 'college', 'university', 'degree', 'studies', 'academic'],
    responses: [
      "Studying Computer Engineering at K.J. Somaiya College! 🎓 Maintaining 8.40 GPA and loving every moment!",
      "I'm at K.J. Somaiya College doing Computer Engineering! 📚 Academic performance has been great with 8.40 GPA!",
    ]
  },
  contact: {
    keywords: ['contact', 'reach', 'email', 'connect', 'hire', 'work together'],
    responses: [
      "Connect with me at rohitsdeshpande4work@gmail.com or LinkedIn! 📧 Always excited to discuss new opportunities!",
      "Would love to connect! 🤝 Check out my contact section - I'm very responsive to messages!",
    ]
  },
  thanks: {
    keywords: ['thank you', 'thanks', 'appreciate', 'grateful', 'dhanyawad'],
    responses: [
      "Dhanyawad! � Happy to help! Kai pan vichar aahe tya?",
      "You're welcome! 😊 Feel free to ask anything else!",
    ]
  },
  goodbye: {
    keywords: ['bye', 'goodbye', 'see you', 'farewell', 'take care'],
    responses: [
      "Bye bye! 👋 Bhetu punha soon! Thanks for visiting my portfolio!",
      "Take care! 🚀 Don't hesitate to reach out anytime!",
    ]
  }
};

/**
 * Find best pattern match for user input
 */
function findBestPatternMatch(userInput: string): LLMResponse | null {
  const input = userInput.toLowerCase();
  let bestMatch = { category: '', score: 0 };

  for (const [category, pattern] of Object.entries(PATTERN_RESPONSES)) {
    for (const keyword of pattern.keywords) {
      const similarity = calculateSimilarity(input, keyword);
      if (similarity > 0.6 && similarity > bestMatch.score) {
        bestMatch = { category, score: similarity };
      }
      
      // Also check if keyword is contained in input
      if (input.includes(keyword) && bestMatch.score < 0.8) {
        bestMatch = { category, score: 0.8 };
      }
    }
  }

  if (bestMatch.score > 0.6) {
    const responses = PATTERN_RESPONSES[bestMatch.category as keyof typeof PATTERN_RESPONSES].responses;
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    return {
      success: true,
      response: randomResponse,
      source: 'pattern',
      confidence: bestMatch.score,
    };
  }

  return null;
}

/**
 * Main function to get chatbot response
 * Priority: External AI → Local LLM → Pattern Matching → Fallback
 */
export async function getChatbotResponse(userMessage: string): Promise<LLMResponse> {
  if (!userMessage.trim()) {
    return {
      success: true,
      response: "I'm here to help! Feel free to ask me about my skills, projects, or experience! 😊",
      source: 'fallback',
    };
  }

  // Try External AI first (most capable) - Priority #1
  try {
    const externalResponse = await generateExternalAIResponse(userMessage);
    if (externalResponse.success) {
      return externalResponse;
    }
  } catch (error) {
    console.log('External AI failed, trying alternatives...');
  }

  // Try local LLM for complex queries - Priority #2
  if (await isLLMAvailable()) {
    const llmResponse = await generateLLMResponse(userMessage);
    if (llmResponse.success) {
      return llmResponse;
    }
  }

  // Pattern matching for common queries - Priority #3
  const patternMatch = findBestPatternMatch(userMessage);
  if (patternMatch && patternMatch.confidence && patternMatch.confidence > 0.7) {
    return patternMatch;
  }

  // Final fallback
  return {
    success: true,
    response: "That's an interesting question! 🤔 I'd love to help you learn more about my background. Try asking about my skills, projects, or experience!",
    source: 'fallback',
  };
}
