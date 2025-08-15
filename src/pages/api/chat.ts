/**
 * 🚀 EXPERT-LEVEL RAG + GROQ CHATBOT API
 * =======================================
 * 
 * SYSTEM ARCHITECTURE:
 * ===================
 * 
 * ┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
 * │   USER QUERY    │───▶│   RAG PIPELINE   │───▶│  GROQ LLM API   │
 * └─────────────────┘    └──────────────────┘    └─────────────────┘
 *                                │
 *                        ┌───────▼────────┐
 *                        │  PINECONE DB   │
 *                        │ (Vector Store) │
 *                        └────────────────┘
 * 
 * PROCESSING FLOW:
 * ===============
 * 1. 🔍 QUERY ANALYSIS: Extract intent and generate query embeddings
 * 2. 🎯 VECTOR SEARCH: Semantic similarity search in knowledge base
 * 3. 📊 CONTEXT FUSION: Intelligent context preparation with relevance scoring
 * 4. 🧠 LLM GENERATION: Groq-powered response generation with context
 * 5. ✅ QUALITY CONTROL: Confidence scoring and response validation
 * 6. 🔄 FALLBACK HANDLING: Graceful degradation strategies
 * 
 * TECHNICAL SPECIFICATIONS:
 * ========================
 * - Vector Dimensions: 384 (optimized for semantic understanding)
 * - Embedding Algorithm: Multi-dimensional semantic vectors with domain knowledge
 * - LLM Model: Llama3-8B-8192 (fast inference, high quality)
 * - Search Strategy: Hybrid retrieval with relevance filtering
 * - Context Window: Optimized for Llama3's 8K context limit
 * - Response Quality: Multi-factor confidence assessment
 */

// Ensure this endpoint is server-rendered for dynamic responses
export const prerender = false;

import { EnhancedGroqRAGService } from '../../../scripts/enhancedGroqRAG';

/**
 * Main chat endpoint handler
 * Implements enterprise-grade RAG + Groq pipeline
 */
export async function POST({ request }: { request: Request }) {
  const startTime = Date.now();
  
  try {
    console.log('🚀 RAG + Groq Pipeline Initiated');
    
    // ===== STEP 1: REQUEST VALIDATION & PARSING =====
    const { isValid, data, error } = await validateAndParseRequest(request);
    if (!isValid) {
      return createErrorResponse(error || 'Invalid request', 400);
    }
    
    const { message, mode } = data;
    console.log(`📝 Processing: "${message.substring(0, 60)}..." | Mode: ${mode || 'auto'}`);
    
    // ===== STEP 2: INITIALIZE RAG SERVICE =====
    const ragService = new EnhancedGroqRAGService();
    
    if (!ragService.isAvailable()) {
      console.error('❌ RAG services unavailable - missing API keys');
      return createFallbackResponse(message, 'RAG services unavailable');
    }
    
    // ===== STEP 3: RAG PROCESSING PIPELINE =====
    console.log('🔍 Executing RAG Pipeline...');
    
    try {
      const ragResponse = await ragService.generateResponse(message);
      const processingTime = Date.now() - startTime;
      
      console.log(`✅ RAG Response Generated | Time: ${processingTime}ms | Confidence: ${(ragResponse.confidence * 100).toFixed(1)}%`);
      
      // ===== STEP 4: RESPONSE QUALITY ASSESSMENT =====
      const qualityScore = assessResponseQuality(ragResponse, message);
      
      if (ragResponse.confidence >= 0.3 && qualityScore >= 0.4) {
        return createSuccessResponse({
          response: ragResponse.response,
          confidence: ragResponse.confidence,
          sources: ragResponse.sources?.slice(0, 3), // Limit for cleaner UI
          processingTime,
          qualityScore,
          pipeline: 'RAG + Groq',
          model: 'llama3-8b-8192'
        });
      } else {
        console.log(`⚠️ Low quality response (confidence: ${ragResponse.confidence}, quality: ${qualityScore})`);
        // Continue to fallback
      }
      
    } catch (ragError) {
      console.error('❌ RAG Pipeline Error:', ragError);
      // Continue to fallback
    }
    
    // ===== STEP 5: DIRECT GROQ FALLBACK =====
    console.log('🔄 Executing Direct Groq Fallback...');
    const directResponse = await executeDirectGroq(message);
    
    if (directResponse.success) {
      const processingTime = Date.now() - startTime;
      return createSuccessResponse({
        ...directResponse,
        processingTime,
        pipeline: 'Direct Groq',
        model: 'llama3-8b-8192'
      });
    }
    
    // ===== STEP 6: FINAL FALLBACK =====
    console.log('🆘 Executing Final Fallback Strategy...');
    return createFallbackResponse(message, 'All AI services temporarily unavailable');
    
  } catch (error) {
    console.error('💥 Critical Pipeline Error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

/**
 * Validates and parses incoming request with robust error handling
 */
async function validateAndParseRequest(request: Request): Promise<{
  isValid: boolean;
  data?: any;
  error?: string;
}> {
  try {
    // Content type validation
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return { isValid: false, error: 'Content-Type must be application/json' };
    }
    
    // Body parsing with size limits
    const rawBody = await request.text();
    if (!rawBody?.trim()) {
      return { isValid: false, error: 'Request body cannot be empty' };
    }
    
    if (rawBody.length > 10000) { // 10KB limit
      return { isValid: false, error: 'Request body too large' };
    }
    
    const data = JSON.parse(rawBody);
    
    // Message validation
    if (!data.message || typeof data.message !== 'string') {
      return { isValid: false, error: 'Valid message field required' };
    }
    
    if (data.message.length > 1000) { // Message length limit
      return { isValid: false, error: 'Message too long (max 1000 characters)' };
    }
    
    return { isValid: true, data };
    
  } catch (parseError) {
    return { isValid: false, error: 'Invalid JSON format' };
  }
}

/**
 * Executes direct Groq API call as fallback strategy
 */
async function executeDirectGroq(message: string): Promise<{
  success: boolean;
  response?: string;
  confidence?: number;
  error?: string;
}> {
  const groqKey = import.meta.env.GROQ_API_KEY;
  
  if (!groqKey?.trim()) {
    return { success: false, error: 'Groq API key not configured' };
  }
  
  try {
    const systemPrompt = `You are an AI assistant representing Rohit Deshpande's professional portfolio.

CORE INFORMATION:
- Full-Stack Developer & AI Engineer based in India
- Expert in: React, Node.js, Python, TypeScript, AI/ML, Cloud Technologies  
- Student at K.J. Somaiya College of Engineering (Computer Engineering)
- Passionate about innovation, problem-solving, and cutting-edge technology

RESPONSE GUIDELINES:
1. Provide accurate, helpful information about Rohit's background
2. Maintain a professional, knowledgeable tone
3. Be specific when discussing technical skills and projects
4. If lacking specific details, guide users to contact Rohit directly
5. Keep responses concise but comprehensive (150-300 words)
6. Use natural, conversational language

CONTACT INFORMATION:
- Portfolio: Available in the website
- LinkedIn: Professional networking profile available
- GitHub: Code repositories and projects showcased
- Email: Contact information provided on portfolio

Answer the user's question professionally and helpfully.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.4, // Balanced creativity/consistency
        max_tokens: 400,
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Groq API Error: ${response.status} - ${errorText}`);
      return { success: false, error: `Groq API error: ${response.status}` };
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;

    if (!aiResponse) {
      return { success: false, error: 'No response generated' };
    }

    return {
      success: true,
      response: aiResponse,
      confidence: 0.8 // Good confidence for direct responses
    };

  } catch (error) {
    console.error('Direct Groq call failed:', error);
    return { success: false, error: 'Groq service temporarily unavailable' };
  }
}

/**
 * Assesses response quality using multiple metrics
 */
function assessResponseQuality(ragResponse: any, originalQuery: string): number {
  let score = 0;
  
  // Factor 1: Response length appropriateness (25%)
  const responseLength = ragResponse.response?.length || 0;
  if (responseLength >= 50 && responseLength <= 800) {
    score += 0.25;
  } else if (responseLength >= 20) {
    score += 0.15;
  }
  
  // Factor 2: Source relevance (25%)
  const relevantSources = ragResponse.sources?.filter((s: any) => s.score > 0.6)?.length || 0;
  if (relevantSources >= 2) {
    score += 0.25;
  } else if (relevantSources >= 1) {
    score += 0.15;
  }
  
  // Factor 3: Query specificity match (25%)
  const queryWords = originalQuery.toLowerCase().split(/\s+/);
  const responseWords = ragResponse.response?.toLowerCase().split(/\s+/) || [];
  const wordOverlap = queryWords.filter(word => 
    word.length > 3 && responseWords.some((rWord: string) => rWord.includes(word))
  ).length;
  
  if (wordOverlap >= queryWords.length * 0.3) {
    score += 0.25;
  } else if (wordOverlap >= queryWords.length * 0.15) {
    score += 0.15;
  }
  
  // Factor 4: Confidence boost (25%)
  score += ragResponse.confidence * 0.25;
  
  return Math.min(score, 1.0);
}

/**
 * Creates successful response with comprehensive metadata
 */
function createSuccessResponse(data: any) {
  return new Response(JSON.stringify({
    success: true,
    response: data.response,
    metadata: {
      confidence: data.confidence,
      sources: data.sources,
      processingTime: data.processingTime,
      qualityScore: data.qualityScore,
      pipeline: data.pipeline,
      model: data.model,
      timestamp: new Date().toISOString()
    }
  }), {
    status: 200,
    headers: { 
      'Content-Type': 'application/json',
      'X-Processing-Time': `${data.processingTime}ms`
    }
  });
}

/**
 * Creates intelligent fallback response with helpful information
 */
function createFallbackResponse(message: string, reason: string) {
  const fallbackResponse = `Hi! I'm experiencing some technical difficulties right now, but I'd love to help you learn about Rohit Deshpande.

**About Rohit:**
🎓 Computer Engineering student at K.J. Somaiya College of Engineering
💻 Full-Stack Developer with expertise in React, Node.js, Python, and AI/ML
🚀 Passionate about building innovative web applications and AI solutions
📍 Based in Mumbai, India

**Key Projects:**
• IntervAI - AI-powered mock interview platform
• Customer Churn Prediction using Machine Learning
• AI Health Assistant with face mask detection
• Portfolio website with RAG-powered chatbot

**Connect with Rohit:**
📧 Email: Available on the portfolio website
💼 LinkedIn: Professional profile with detailed experience
🐙 GitHub: Code repositories and project showcases

Feel free to explore the portfolio sections above or reach out directly for more information!

*Technical note: ${reason}*`;

  return new Response(JSON.stringify({
    success: true,
    response: fallbackResponse,
    metadata: {
      pipeline: 'Fallback Strategy',
      reason,
      confidence: 0.9, // High confidence in fallback content
      timestamp: new Date().toISOString()
    }
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

/**
 * Creates error response with appropriate status codes
 */
function createErrorResponse(message: string, status: number) {
  return new Response(JSON.stringify({
    success: false,
    error: message,
    timestamp: new Date().toISOString()
  }), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}
