import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAIEmbeddings } from '@langchain/openai';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Document } from '@langchain/core/documents';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Node.js compatible RAG service for populate scripts
 */
export class NodeRAGService {
  private pinecone: Pinecone | null = null;
  private embeddings: OpenAIEmbeddings | null = null;
  private indexName = 'rohit-portfolio-rag';
  private namespace = 'portfolio-docs';
  
  constructor() {
    this.initializeServices();
  }

  private async initializeServices() {
    try {
      // Initialize Pinecone with error handling
      if (process.env.PINECONE_API_KEY) {
        this.pinecone = new Pinecone({
          apiKey: process.env.PINECONE_API_KEY,
        });
        console.log('✅ Pinecone initialized');
      } else {
        console.warn('⚠️ Pinecone API key missing');
      }

      // Initialize OpenAI Embeddings with error handling
      if (process.env.OPENAI_API_KEY) {
        this.embeddings = new OpenAIEmbeddings({
          apiKey: process.env.OPENAI_API_KEY,
          model: 'text-embedding-3-small',
          dimensions: 1536,
        });
        console.log('✅ OpenAI embeddings initialized');
      } else {
        console.warn('⚠️ OpenAI API key missing');
      }
    } catch (error) {
      console.error('❌ Failed to initialize RAG services:', error);
    }
  }

  public isAvailable(): boolean {
    const available = this.pinecone !== null && this.embeddings !== null;
    console.log(`🔍 RAG availability: ${available ? 'Available' : 'Unavailable'}`);
    return available;
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

  public async searchDocuments(query: string, topK: number = 5): Promise<any[]> {
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

  public async generateResponse(query: string): Promise<any> {
    try {
      const searchResults = await this.searchDocuments(query, 3);
      
      if (searchResults.length === 0) {
        return {
          response: "No relevant information found.",
          confidence: 0,
        };
      }

      const relevantResults = searchResults.filter(result => result.score > 0.7);
      
      if (relevantResults.length === 0) {
        return {
          response: "Found some information but not specifically relevant.",
          confidence: 0.3,
        };
      }

      const context = relevantResults
        .map(result => result.content)
        .join('\\n\\n');

      const avgConfidence = relevantResults.reduce((sum, r) => sum + r.score, 0) / relevantResults.length;

      return {
        response: `Based on the context: ${context.substring(0, 200)}...`,
        confidence: avgConfidence,
        sources: relevantResults.length,
      };
    } catch (error) {
      console.error('RAG generation failed:', error);
      return {
        response: "Error generating response.",
        confidence: 0,
      };
    }
  }
}
