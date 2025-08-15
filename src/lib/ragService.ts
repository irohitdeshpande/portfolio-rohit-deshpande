import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAIEmbeddings } from '@langchain/openai';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Document } from '@langchain/core/documents';

// Types
interface VectorSearchResult {
  content: string;
  metadata: any;
  score: number;
}

interface RAGResponse {
  response: string;
  sources: string[];
  provider: string;
  confidence: number;
  isFactual: boolean;
  contextUsed: string[];
}

interface SecurityGuards {
  personalDataDetected: boolean;
  outOfScopeQuery: boolean;
  sensitiveTerms: string[];
}

export class RAGService {
  private pinecone: Pinecone | null = null;
  private embeddings: OpenAIEmbeddings | null = null;
  private indexName = 'rohit-portfolio-rag';
  private namespace = 'portfolio-docs';
  private cache = new Map<string, RAGResponse>();
  private readonly CACHE_TTL = 1000 * 60 * 15; // 15 minutes
  
  // Security configuration
  private readonly SENSITIVE_TERMS = [
    'password', 'secret', 'private', 'confidential', 'personal phone',
    'home address', 'ssn', 'social security', 'bank', 'credit card', 'politics', 'religion', 'health', 'medical', 'lok sabha', 'rajya sabha', 'election', 'vote', 'government', 'political party', 'candidate', 'campaign', 'polling', 'constituency', 'manifesto', 'policy', 'legislation', 'parliament', 'assembly', 'minister', 'chief minister', 'prime minister',
  ];
  
  private readonly SCOPE_KEYWORDS = [
    'rohit', 'skills', 'experience', 'projects', 'education', 'background',
    'portfolio', 'work', 'technology', 'programming', 'engineering'
  ];
  
  constructor() {
    this.initializeServices();
  }

  private async initializeServices() {
    try {
      // Initialize Pinecone with error handling
      if (import.meta.env.PINECONE_API_KEY) {
        this.pinecone = new Pinecone({
          apiKey: import.meta.env.PINECONE_API_KEY,
        });
        console.log('✅ Pinecone initialized');
      } else {
        console.warn('⚠️ Pinecone API key missing');
      }

      // Initialize OpenAI Embeddings with error handling
      if (import.meta.env.OPENAI_API_KEY) {
        this.embeddings = new OpenAIEmbeddings({
          apiKey: import.meta.env.OPENAI_API_KEY,
          model: 'text-embedding-3-small', // Cost-effective, fast
          dimensions: 1536, // Explicit dimension setting
        });
        console.log('✅ OpenAI embeddings initialized');
      } else {
        console.warn('⚠️ OpenAI API key missing');
      }
    } catch (error) {
      console.error('❌ Failed to initialize RAG services:', error);
    }
  }

  /**
   * Enhanced availability check with health monitoring
   */
  public isAvailable(): boolean {
    const available = this.pinecone !== null && this.embeddings !== null;
    console.log(`🔍 RAG availability: ${available ? 'Available' : 'Unavailable'}`);
    return available;
  }

  /**
   * Security guard: Analyze query for sensitive content and scope
   */
  private analyzeQuerySecurity(query: string): SecurityGuards {
    const lowerQuery = query.toLowerCase();
    
    const sensitiveTerms = this.SENSITIVE_TERMS.filter(term => 
      lowerQuery.includes(term)
    );
    
    const hasScopeKeywords = this.SCOPE_KEYWORDS.some(keyword =>
      lowerQuery.includes(keyword)
    );
    
    // Detect personal data requests
    const personalDataPatterns = [
      /phone\s*number/i,
      /address/i,
      /personal\s*email/i,
      /private\s*info/i
    ];
    
    const personalDataDetected = personalDataPatterns.some(pattern =>
      pattern.test(query)
    );
    
    return {
      personalDataDetected,
      outOfScopeQuery: !hasScopeKeywords && query.length > 10,
      sensitiveTerms
    };
  }

  /**
   * Process and ingest a PDF document
   */
  public async ingestPDF(pdfBuffer: Buffer, metadata: any = {}): Promise<boolean> {
    if (!this.isAvailable()) {
      throw new Error('RAG services not available');
    }

    try {
      // Check if the buffer contains text data (for portfolio scripts) or PDF data
      let text: string;
      
      // Simple check - if buffer starts with PDF signature, parse as PDF
      if (pdfBuffer.slice(0, 4).toString() === '%PDF') {
        // Parse PDF using dynamic import to avoid test file issues
        const pdfParse = (await import('pdf-parse')).default;
        const pdfData = await pdfParse(pdfBuffer);
        text = pdfData.text;
      } else {
        // Treat as text content (for portfolio data ingestion)
        text = pdfBuffer.toString('utf-8');
      }

      // Split text into chunks
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
        separators: ['\\n\\n', '\\n', '. ', ' '],
      });

      const docs = await textSplitter.splitText(text);
      
      // Create documents with metadata
      const documents = docs.map((content, index) => new Document({
        pageContent: content,
        metadata: {
          ...metadata,
          chunk: index,
          source: metadata.source || 'pdf',
          timestamp: new Date().toISOString(),
        },
      }));

      // Generate embeddings and store in Pinecone
      await this.storeDocuments(documents);
      
      return true;
    } catch (error) {
      console.error('Failed to ingest document:', error);
      return false;
    }
  }

  /**
   * Process and ingest text content directly
   */
  public async ingestText(text: string, metadata: any = {}): Promise<boolean> {
    const textBuffer = Buffer.from(text, 'utf-8');
    return this.ingestPDF(textBuffer, { ...metadata, source: 'text' });
  }

  /**
   * Store documents in vector database
   */
  private async storeDocuments(documents: Document[]): Promise<void> {
    if (!this.pinecone || !this.embeddings) {
      throw new Error('Services not initialized');
    }

    const index = this.pinecone.index(this.indexName);
    const batchSize = 10;

    for (let i = 0; i < documents.length; i += batchSize) {
      const batch = documents.slice(i, i + batchSize);
      
      // Generate embeddings for batch
      const embeddings = await this.embeddings.embedDocuments(
        batch.map(doc => doc.pageContent)
      );

      // Prepare vectors for Pinecone
      const vectors = batch.map((doc, idx) => ({
        id: `doc_${Date.now()}_${i + idx}`,
        values: embeddings[idx],
        metadata: {
          content: doc.pageContent,
          ...doc.metadata,
        },
      }));

      // Upsert to Pinecone
      await index.namespace(this.namespace).upsert(vectors);
    }
  }

  /**
   * Search for relevant documents
   */
  public async searchDocuments(query: string, topK: number = 5): Promise<VectorSearchResult[]> {
    if (!this.pinecone || !this.embeddings) {
      return [];
    }

    try {
      // Generate query embedding
      const queryEmbedding = await this.embeddings.embedQuery(query);
      
      // Search in Pinecone
      const index = this.pinecone.index(this.indexName);
      const searchResults = await index.namespace(this.namespace).query({
        vector: queryEmbedding,
        topK,
        includeMetadata: true,
        includeValues: false,
      });

      // Format results
      return searchResults.matches?.map(match => ({
        content: match.metadata?.content as string || '',
        metadata: match.metadata || {},
        score: match.score || 0,
      })) || [];
    } catch (error) {
      console.error('Vector search failed:', error);
      return [];
    }
  }

  /**
   * Cache management
   */
  private getCacheKey(query: string): string {
    return `rag_${query.toLowerCase().replace(/\s+/g, '_').substring(0, 50)}`;
  }

  private getFromCache(key: string): RAGResponse | null {
    const cached = this.cache.get(key) as any;
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  private setCache(key: string, data: RAGResponse): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    } as any);
  }

  /**
   * Response validation to prevent hallucinations
   */
  private validateResponse(response: string, context: string): string {
    // Check if response contains information not in context
    const responseWords = response.toLowerCase().split(/\s+/);
    const contextWords = context.toLowerCase().split(/\s+/);
    
    // If response is much longer than context, it might be hallucinating
    if (response.length > context.length * 1.5) {
      return "Based on the available information in my knowledge base, " + response.substring(0, Math.min(response.length, 300)) + "...";
    }

    return response;
  }

  /**
   * Generate RAG response using retrieved context
   */
  public async generateResponse(query: string): Promise<RAGResponse> {
    try {
      // Search for relevant documents
      const searchResults = await this.searchDocuments(query, 5);
      
      if (searchResults.length === 0) {
        return {
          response: "I don't have specific information about that in my knowledge base. Please ask me about Rohit's skills, experience, projects, or background that I have documented information about.",
          sources: [],
          provider: 'rag',
          confidence: 0,
          isFactual: false,
          contextUsed: [],
        };
      }

      // Filter results by relevance threshold
      const relevantResults = searchResults.filter(result => result.score > 0.7);
      
      if (relevantResults.length === 0) {
        return {
          response: "I found some related information, but it's not specifically relevant to your question. Please ask me about Rohit's documented skills, experience, projects, or professional background.",
          sources: [],
          provider: 'rag',
          confidence: 0.3,
          isFactual: false,
          contextUsed: searchResults.map(r => r.content.substring(0, 100) + '...'),
        };
      }

      // Prepare context from retrieved documents
      const context = relevantResults
        .map(result => result.content)
        .join('\\n\\n');

      const sources = relevantResults
        .map(result => result.metadata.source || 'document')
        .filter((source, index, arr) => arr.indexOf(source) === index);

      // Generate response using LLM with strict instructions
      const prompt = this.buildRAGPrompt(query, context);
      const response = await this.callLLM(prompt);

      const avgConfidence = relevantResults.reduce((sum, r) => sum + r.score, 0) / relevantResults.length;

      return {
        response,
        sources,
        provider: 'rag',
        confidence: avgConfidence,
        isFactual: true,
        contextUsed: relevantResults.map(r => r.content.substring(0, 100) + '...'),
      };
    } catch (error) {
      console.error('RAG generation failed:', error);
      return {
        response: "I'm having trouble accessing my knowledge base right now. Please try again or ask me about Rohit's general background.",
        sources: [],
        provider: 'rag',
        confidence: 0,
        isFactual: false,
        contextUsed: [],
      };
    }
  }

  /**
   * Build RAG prompt with strict instructions
   */
  private buildRAGPrompt(query: string, context: string): string {
    return `You are Rohit Deshpande's AI assistant. Your role is to help visitors learn about Rohit based ONLY on the provided context.

STRICT GUIDELINES:
1. ONLY use information from the provided context
2. If the context doesn't contain relevant information, say so clearly
3. DO NOT guess, assume, or hallucinate any information
4. DO NOT use your general knowledge about technology or other topics
5. Speak as Rohit's assistant, not as Rohit himself
6. Be helpful but stay strictly within the bounds of provided information
7. If asked about something not in the context, politely redirect to available information

CONTEXT ABOUT ROHIT:
${context}

USER QUESTION: ${query}

RESPONSE (stay strictly within the provided context):`;
  }

  /**
   * Extract relevant context from search results
   */
  private extractContext(results: any[]): string {
    if (!results.length) return '';
    
    return results
      .map((result) => result.metadata?.text || result.pageContent || '')
      .filter((text) => text.length > 0)
      .slice(0, 5) // Limit to top 5 results
      .join('\n\n');
  }

  /**
   * Clean up response text
   */
  private cleanResponse(text: string): string {
    return text
      .trim()
      .replace(/^\s*[Rr]esponse:\s*/i, '')
      .replace(/^\s*[Aa]nswer:\s*/i, '')
      .replace(/\n{3,}/g, '\n\n');
  }

  /**
   * Call LLM for response generation
   */
  private async callLLM(prompt: string): Promise<string> {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: prompt,
          mode: 'rag',
        }),
      });

      if (!response.ok) {
        throw new Error('LLM API call failed');
      }

      const data = await response.json();
      return data.response || "I couldn't generate a proper response based on the available information.";
    } catch (error) {
      console.error('LLM call failed:', error);
      return "I'm having trouble generating a response right now. Please try again.";
    }
  }
}

// Export singleton instance
export const ragService = new RAGService();
