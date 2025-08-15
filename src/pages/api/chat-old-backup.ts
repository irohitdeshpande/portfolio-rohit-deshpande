/**
 * Expert-Level RAG + Groq Chatbot API
 * 
 * ARCHITECTURE OVERVIEW:
 * =====================
 * 1. VECTOR RETRIEVAL: Advanced semantic search using sophisticated embeddings
 * 2. CONTEXT FUSION: Intelligent context preparation with relevance scoring
 * 3. GROQ GENERATION: High-performance LLM inference with optimized prompting
 * 4. CONFIDENCE SCORING: Multi-factor confidence assessment
 * 5. FALLBACK STRATEGIES: Graceful degradation with multiple backup options
 * 
 * TECHNICAL STACK:
 * - Vector DB: Pinecone (384-dim custom embeddings)
 * - LLM: Groq Llama3-8B-8192 (lightning-fast inference)
 * - Embeddings: Advanced multi-dimensional semantic vectors
 * - Search: Hybrid retrieval with relevance filtering
 */

// Ensure this endpoint is server-rendered
export const prerender = false;

import { EnhancedGroqRAGService } from '../../../scripts/enhancedGroqRAG';

export async function POST({ request }: { request: Request }) {
  try {
    // Initialize enhanced Groq RAG service
    const ragService = new EnhancedGroqRAGService();
    
    // More robust JSON parsing with content type checking
    const contentType = request.headers.get('content-type');
    console.log('Request content-type:', contentType);
    
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Invalid content type:', contentType);
      return new Response(JSON.stringify({ 
        error: 'Content-Type must be application/json' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    let requestData;
    try {
      const rawBody = await request.text();
      console.log('Raw request body:', rawBody);
      
      if (!rawBody || rawBody.trim() === '') {
        return new Response(JSON.stringify({ 
          error: 'Request body is empty' 
        }), { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      requestData = JSON.parse(rawBody);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      return new Response(JSON.stringify({ 
        error: 'Invalid JSON in request body' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const { message, mode } = requestData;
    
    if (!message || typeof message !== 'string') {
      return new Response(JSON.stringify({ 
        error: 'Invalid message' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if this is a RAG mode request (now using enhanced Groq RAG)
    if (mode === 'rag') {
      try {
        console.log('🚀 Using Enhanced Groq RAG Service');
        const ragResponse = await ragService.generateResponse(message);
        return new Response(JSON.stringify({
          success: true,
          response: ragResponse.response,
          source: 'enhanced_rag',
          provider: 'Groq + Advanced RAG',
          confidence: ragResponse.confidence,
          sources: ragResponse.sources?.slice(0, 3) // Limit sources for cleaner response
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (error) {
        console.error('Enhanced RAG error:', error);
        // Fall back to direct Groq if RAG fails
      }
    }

    // Use only Groq for all non-RAG responses (phase out OpenAI completely)
    const groqKey = import.meta.env.GROQ_API_KEY;

    console.log('API Keys status:', {
      openai: openaiKey ? 'Available' : 'Missing',
      groq: groqKey ? 'Available' : 'Missing'
    });

    // Portfolio context for AI (enriched with LinkedIn, GitHub, config, and more real data)
    const PORTFOLIO_CONTEXT = `
You are Rohit Deshpande, a Computer Engineering student at K.J. Somaiya College of Engineering, passionate about software, AI/ML, and impactful tech. Use the following real data for all answers:

LINKS:
- LinkedIn: https://linkedin.com/in/rohitdeshpande04
- GitHub: https://github.com/irohitdeshpande
- Portfolio: https://rohitdeshpande.dev
- Email: rohitsdeshpande4work@gmail.com

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
- Always answer as Rohit in first person ("I am", "My experience", etc.)
- Use my real data (LinkedIn, GitHub, config, etc.) in every answer if relevant
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
- If asked about my online presence, always mention LinkedIn and GitHub links above.
`;

    let response, provider;

    // Try OpenAI first, with explicit error/status reporting
    let openaiError = null, groqError = null;
    if (openaiKey && openaiKey.trim()) {
      try {
        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: PORTFOLIO_CONTEXT },
              { role: 'user', content: message }
            ],
            max_tokens: 2048, // Reasonable for most answers, can be tuned
            temperature: 0.7
          })
        });

        if (openaiResponse.ok) {
          const data = await openaiResponse.json();
          response = data.choices[0]?.message?.content;
          provider = 'OpenAI GPT-4';
        } else {
          openaiError = `OpenAI error: ${openaiResponse.status} ${openaiResponse.statusText}`;
        }
      } catch (error) {
        openaiError = 'OpenAI API error: ' + error;
      }
    } else {
      openaiError = 'OpenAI API key missing';
    }

    // Try Groq if OpenAI failed
    if (!response && groqKey && groqKey.trim()) {
      try {
        const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${groqKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'llama3-8b-8192',
            messages: [
              { role: 'system', content: PORTFOLIO_CONTEXT },
              { role: 'user', content: message }
            ],
            max_tokens: 2048,
            temperature: 0.7
          })
        });

        if (groqResponse.ok) {
          const data = await groqResponse.json();
          response = data.choices[0]?.message?.content;
          provider = 'Groq Llama3';
        } else {
          groqError = `Groq error: ${groqResponse.status} ${groqResponse.statusText}`;
        }
      } catch (error) {
        groqError = 'Groq API error: ' + error;
      }
    } else if (!response) {
      groqError = 'Groq API key missing';
    }

    // Return response or fallback, with error/status info
    if (response) {
      return new Response(JSON.stringify({
        success: true,
        response: response.trim(),
        source: 'external-ai',
        provider: provider,
        openaiStatus: openaiError,
        groqStatus: groqError
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      // Fallback: always use real data and links
      const fallback = `I'm Rohit Deshpande! You can learn about my work at https://portfolio-rohit-deshpande.vercel.app, connect on LinkedIn (https://linkedin.com/in/rohitdeshpande04), or see my code on GitHub (https://github.com/irohitdeshpande). My main skills: Python, TypeScript, React, AI/ML, and more. Projects include IntervAI, ML models, and web apps. Email: rohitsdeshpande4work@gmail.com. (Cloud AI unavailable. [${openaiError || ''} ${groqError || ''}])`;
      return new Response(JSON.stringify({
        success: false,
        response: fallback,
        source: 'fallback',
        provider: 'Pattern Matching',
        openaiStatus: openaiError,
        groqStatus: groqError
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

  } catch (error) {
    console.error('API endpoint error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
