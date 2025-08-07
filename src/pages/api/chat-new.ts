/**
 * Enhanced Groq-Powered Chatbot API
 * Completely phased out OpenAI - using only Groq for all AI responses
 * Features advanced RAG with sophisticated embeddings and fallback strategies
 */

// Ensure this endpoint is server-rendered
export const prerender = false;

import { EnhancedGroqRAGService } from '../../../scripts/enhancedGroqRAG';

export async function POST({ request }: { request: Request }) {
  try {
    // Initialize enhanced Groq RAG service
    const ragService = new EnhancedGroqRAGService();
    
    // Robust JSON parsing with content type checking
    const contentType = request.headers.get('content-type');
    console.log('🔍 Request content-type:', contentType);
    
    if (!contentType || !contentType.includes('application/json')) {
      console.error('❌ Invalid content type:', contentType);
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
      console.log('📝 Request received, length:', rawBody.length);
      
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
      console.error('❌ JSON parsing error:', parseError);
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

    console.log(`🤖 Processing message: "${message.substring(0, 50)}..." (mode: ${mode || 'direct'})`);

    // Primary Strategy: Enhanced RAG with Groq
    if (mode === 'rag' || !mode) { // Default to RAG mode
      try {
        console.log('🚀 Using Enhanced Groq RAG Service');
        const ragResponse = await ragService.generateResponse(message);
        
        if (ragResponse.confidence > 0.3) { // Accept medium confidence responses
          return new Response(JSON.stringify({
            success: true,
            response: ragResponse.response,
            source: 'enhanced_rag',
            provider: 'Groq + Advanced RAG',
            confidence: ragResponse.confidence,
            sources: ragResponse.sources?.slice(0, 3), // Limit sources for cleaner response
            mode: 'rag'
          }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        } else {
          console.log('⚠️ Low confidence RAG response, falling back to direct Groq');
        }
      } catch (error) {
        console.error('❌ Enhanced RAG error:', error);
        console.log('🔄 Falling back to direct Groq chat');
      }
    }

    // Fallback Strategy: Direct Groq Chat
    const groqKey = import.meta.env.GROQ_API_KEY;
    
    console.log('🔑 Groq API Key status:', groqKey ? 'Available' : 'Missing');

    if (!groqKey || !groqKey.trim()) {
      return new Response(JSON.stringify({ 
        error: 'Groq API key not configured. Please check your environment variables.' 
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Enhanced portfolio context for direct chat
    const ENHANCED_PORTFOLIO_CONTEXT = `
You are an AI assistant representing Rohit Deshpande's portfolio. Provide helpful, accurate information about Rohit's professional background.

KEY INFORMATION:
- Full-Stack Developer & AI Engineer
- Expertise: React, Node.js, Python, TypeScript, AI/ML, Cloud Technologies
- Location: India
- Focus: Modern web technologies, AI implementations, scalable systems
- Passionate about: Innovation, problem-solving, continuous learning

RESPONSE GUIDELINES:
1. Be professional, knowledgeable, and helpful
2. If asked about specific details not in your knowledge, suggest checking the portfolio or contacting Rohit
3. Highlight relevant skills and experience when appropriate
4. Keep responses concise but informative
5. Maintain a confident, professional tone

CONTACT INFO:
- Email: Available on portfolio
- LinkedIn: Available on portfolio  
- GitHub: Available on portfolio
`;

    try {
      console.log('🚀 Making direct Groq API call');
      
      const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [
            { 
              role: 'system', 
              content: ENHANCED_PORTFOLIO_CONTEXT
            },
            { 
              role: 'user', 
              content: message 
            }
          ],
          temperature: 0.4, // Balanced creativity and consistency
          max_tokens: 400,
          top_p: 0.9,
          frequency_penalty: 0.1,
          presence_penalty: 0.1,
          stop: null
        }),
      });

      if (!groqResponse.ok) {
        const errorText = await groqResponse.text();
        console.error('❌ Groq API error:', groqResponse.status, errorText);
        
        return new Response(JSON.stringify({ 
          error: `Groq API error: ${groqResponse.status}`,
          details: 'The AI service is temporarily unavailable. Please try again later.'
        }), { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const groqData = await groqResponse.json();
      console.log('✅ Groq response received successfully');
      
      if (!groqData.choices || groqData.choices.length === 0) {
        throw new Error('No response choices returned from Groq');
      }

      const aiResponse = groqData.choices[0].message.content;

      return new Response(JSON.stringify({
        success: true,
        response: aiResponse,
        source: 'direct_chat',
        provider: 'Groq (llama3-8b-8192)',
        usage: groqData.usage,
        mode: 'direct'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });

    } catch (groqError) {
      console.error('❌ Groq API call failed:', groqError);
      
      // Final fallback: Static helpful response
      const fallbackResponse = `I'm having trouble connecting to the AI service right now, but I'd be happy to help! 

Here's what I can tell you about Rohit Deshpande:
- Experienced Full-Stack Developer & AI Engineer
- Skilled in React, Node.js, Python, TypeScript, and AI/ML technologies
- Passionate about building innovative web solutions and AI applications
- Based in India with expertise in modern web development

For more detailed information about Rohit's projects, experience, and skills, please explore the portfolio sections above or feel free to reach out directly through the contact information provided.

Is there something specific you'd like to know about Rohit's background or projects?`;

      return new Response(JSON.stringify({
        success: true,
        response: fallbackResponse,
        source: 'fallback',
        provider: 'Static Response',
        mode: 'fallback'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

  } catch (error) {
    console.error('❌ Chat API error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: 'Something went wrong processing your request. Please try again.'
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
