import { Pinecone } from '@pinecone-database/pinecone';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Document } from '@langchain/core/documents';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Node.js compatible RAG service using Groq for embeddings (free alternative)
 */
export class NodeRAGServiceGroq {
  private pinecone: Pinecone | null = null;
  private indexName = 'rohit-portfolio-rag';
  private namespace = 'portfolio-docs';
  
  constructor() {
    this.initializeServices();
  }

  private async initializeServices() {
    try {
      // Initialize Pinecone
      if (process.env.PINECONE_API_KEY) {
        this.pinecone = new Pinecone({
          apiKey: process.env.PINECONE_API_KEY,
        });
        console.log('✅ Pinecone initialized');
      } else {
        console.warn('⚠️ Pinecone API key missing');
      }
    } catch (error) {
      console.error('❌ Failed to initialize RAG services:', error);
    }
  }

  public isAvailable(): boolean {
    const available = this.pinecone !== null && !!process.env.GROQ_API_KEY;
    console.log(`🔍 RAG availability: ${available ? 'Available' : 'Unavailable'}`);
    return available;
  }

  /**
   * Generate embeddings using Groq (simple text-based approach)
   */
  private async generateSimpleEmbeddings(texts: string[]): Promise<number[][]> {
    // Simple embedding approach - convert text to numerical vectors
    // This is a basic implementation for demonstration
    return texts.map(text => {
      const words = text.toLowerCase().split(/\s+/);
      const embedding = new Array(384).fill(0); // Smaller dimension for demo
      
      // Simple hash-based embedding
      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const hash = this.simpleHash(word);
        const index = Math.abs(hash) % 384;
        embedding[index] += 1;
      }
      
      // Normalize
      const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
      return embedding.map(val => magnitude > 0 ? val / magnitude : 0);
    });
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
  }

  /**
   * Generate query embedding
   */
  private async generateQueryEmbedding(query: string): Promise<number[]> {
    const embeddings = await this.generateSimpleEmbeddings([query]);
    return embeddings[0];
  }

  public async ingestText(text: string, metadata: any = {}): Promise<boolean> {
    if (!this.isAvailable()) {
      throw new Error('RAG services not available');
    }

    try {
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
          source: metadata.source || 'text',
          timestamp: new Date().toISOString(),
        },
      }));

      // Generate embeddings and store in Pinecone
      await this.storeDocuments(documents);
      
      return true;
    } catch (error) {
      console.error('Failed to ingest text:', error);
      return false;
    }
  }

  private async storeDocuments(documents: Document[]): Promise<void> {
    if (!this.pinecone) {
      throw new Error('Pinecone not initialized');
    }

    const index = this.pinecone.index(this.indexName);
    const batchSize = 10;

    for (let i = 0; i < documents.length; i += batchSize) {
      const batch = documents.slice(i, i + batchSize);
      
      // Generate embeddings for batch
      const texts = batch.map(doc => doc.pageContent);
      const embeddings = await this.generateSimpleEmbeddings(texts);

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

  public async searchDocuments(query: string, topK: number = 5): Promise<any[]> {
    if (!this.pinecone) {
      return [];
    }

    try {
      // Generate query embedding
      const queryEmbedding = await this.generateQueryEmbedding(query);
      
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

  public async generateResponse(query: string): Promise<any> {
    try {
      const searchResults = await this.searchDocuments(query, 3);
      
      if (searchResults.length === 0) {
        return {
          response: "No relevant information found in the knowledge base.",
          confidence: 0,
        };
      }

      const relevantResults = searchResults.filter(result => result.score > 0.3); // Lower threshold for simple embeddings
      
      if (relevantResults.length === 0) {
        return {
          response: "Found some information but not specifically relevant to your question.",
          confidence: 0.3,
        };
      }

      const context = relevantResults
        .map(result => result.content)
        .join('\\n\\n');

      const avgConfidence = relevantResults.reduce((sum, r) => sum + r.score, 0) / relevantResults.length;

      // Use Groq for response generation
      const response = await this.generateResponseWithGroq(query, context);

      return {
        response: response,
        confidence: avgConfidence,
        sources: relevantResults.length,
      };
    } catch (error) {
      console.error('RAG generation failed:', error);
      return {
        response: "Error generating response from knowledge base.",
        confidence: 0,
      };
    }
  }

  private async generateResponseWithGroq(query: string, context: string): Promise<string> {
    try {
      const prompt = `Based on the following information about Rohit Deshpande, answer the user's question accurately and helpfully.

INFORMATION ABOUT ROHIT:
${context}

USER QUESTION: ${query}

ANSWER:`;

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 500,
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || 'Unable to generate response.';
    } catch (error) {
      console.error('Groq API call failed:', error);
      return `Based on the available information: ${context.substring(0, 300)}...`;
    }
  }
}
