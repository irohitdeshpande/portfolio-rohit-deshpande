import type { APIRoute } from 'astro';
import { ragService } from '../../lib/ragService';

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return new Response(JSON.stringify({ 
        error: 'No file provided' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return new Response(JSON.stringify({ 
        error: 'Only PDF files are supported' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract metadata from form
    const metadata = {
      filename: file.name,
      size: file.size,
      uploadedAt: new Date().toISOString(),
      description: formData.get('description') || '',
      category: formData.get('category') || 'general',
    };

    // Ingest PDF using RAG service
    const success = await ragService.ingestPDF(buffer, metadata);

    if (success) {
      return new Response(JSON.stringify({ 
        message: 'PDF successfully ingested',
        filename: file.name,
        chunks: 'Processing completed'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({ 
        error: 'Failed to process PDF' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

  } catch (error) {
    console.error('PDF ingestion error:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Internal server error during PDF processing' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
