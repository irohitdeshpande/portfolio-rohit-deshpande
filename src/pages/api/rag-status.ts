import type { APIRoute } from 'astro';
import { ragService } from '../../lib/ragService';

export const GET: APIRoute = async () => {
  try {
    const isAvailable = ragService.isAvailable();
    
    return new Response(JSON.stringify({
      available: isAvailable,
      services: {
        pinecone: !!import.meta.env.PINECONE_API_KEY,
        openai: !!import.meta.env.OPENAI_API_KEY,
      },
      message: isAvailable ? 
        'RAG services are operational' : 
        'RAG services require PINECONE_API_KEY and OPENAI_API_KEY'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      available: false,
      error: 'Failed to check RAG status'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
