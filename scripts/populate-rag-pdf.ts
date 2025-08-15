import { NodeRAGService } from './nodeRAGService.js';
import { NodeRAGServiceGroq } from './nodeRAGServiceGroq.js';
import { readFileSync, existsSync, readdirSync } from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';
import pdfParse from 'pdf-parse';

// Load environment variables
dotenv.config();

/**
 * PDF RAG Population Script
 * Run this script to populate your RAG database with PDF documents
 * Usage: npx tsx scripts/populate-rag-pdf.ts
 */

class PDFRAGPopulator {
  private documents: Array<{content: string, metadata: any}> = [];
  private ragService: NodeRAGService | NodeRAGServiceGroq;
  private pdfDirectory: string;

  constructor(pdfDir: string = './documents') {
    console.log('🚀 Starting PDF RAG Population...');
    
    // Use Groq service if OpenAI is not available or preferred
    const useGroq = !process.env.OPENAI_API_KEY || process.env.USE_GROQ === 'true';
    
    if (useGroq) {
      console.log('📡 Using Groq API for RAG processing...');
      this.ragService = new NodeRAGServiceGroq();
    } else {
      console.log('📡 Using OpenAI API for RAG processing...');
      this.ragService = new NodeRAGService();
    }
    
    this.pdfDirectory = path.resolve(pdfDir);
    console.log(`📁 PDF Directory: ${this.pdfDirectory}`);
  }

  /**
   * Find all PDF files in the directory
   */
  private findPDFFiles(): string[] {
    if (!existsSync(this.pdfDirectory)) {
      console.log(`❌ Directory ${this.pdfDirectory} does not exist. Creating it...`);
      // You can create the directory or throw an error
      throw new Error(`Please create the directory: ${this.pdfDirectory} and add your PDF files`);
    }

    const files = readdirSync(this.pdfDirectory);
    const pdfFiles = files.filter(file => file.toLowerCase().endsWith('.pdf'));
    
    console.log(`📄 Found ${pdfFiles.length} PDF files: ${pdfFiles.join(', ')}`);
    return pdfFiles.map(file => path.join(this.pdfDirectory, file));
  }

  /**
   * Extract text from a PDF file
   */
  private async extractTextFromPDF(filePath: string): Promise<string> {
    try {
      console.log(`📖 Extracting text from: ${path.basename(filePath)}`);
      
      const dataBuffer = readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      
      console.log(`✅ Extracted ${pdfData.text.length} characters from ${path.basename(filePath)}`);
      return pdfData.text;
    } catch (error) {
      console.error(`❌ Error extracting text from ${filePath}:`, error);
      return '';
    }
  }

  /**
   * Split text into manageable chunks
   */
  private splitTextIntoChunks(text: string, chunkSize: number = 1000, overlap: number = 200): string[] {
    const chunks: string[] = [];
    let startIndex = 0;

    while (startIndex < text.length) {
      let endIndex = startIndex + chunkSize;
      
      // Try to break at a sentence or paragraph boundary
      if (endIndex < text.length) {
        const lastPeriod = text.lastIndexOf('.', endIndex);
        const lastNewline = text.lastIndexOf('\n', endIndex);
        const lastSpace = text.lastIndexOf(' ', endIndex);
        
        const breakPoint = Math.max(lastPeriod, lastNewline, lastSpace);
        if (breakPoint > startIndex + chunkSize * 0.5) {
          endIndex = breakPoint + 1;
        }
      }

      const chunk = text.slice(startIndex, endIndex).trim();
      if (chunk.length > 0) {
        chunks.push(chunk);
      }

      startIndex = endIndex - overlap;
    }

    return chunks;
  }

  /**
   * Process PDF files and prepare documents
   */
  private async processPDFFiles() {
    console.log('📝 Processing PDF files...');

    const pdfFiles = this.findPDFFiles();
    
    if (pdfFiles.length === 0) {
      console.log('⚠️ No PDF files found. Please add PDF files to the documents directory.');
      return;
    }

    for (const filePath of pdfFiles) {
      const fileName = path.basename(filePath, '.pdf');
      console.log(`🔄 Processing: ${fileName}`);

      // Extract text from PDF
      const text = await this.extractTextFromPDF(filePath);
      
      if (text.length === 0) {
        console.log(`⚠️ No text extracted from ${fileName}, skipping...`);
        continue;
      }

      // Split into chunks
      const chunks = this.splitTextIntoChunks(text);
      console.log(`📝 Split ${fileName} into ${chunks.length} chunks`);

      // Create documents for each chunk
      chunks.forEach((chunk, index) => {
        this.documents.push({
          content: chunk,
          metadata: {
            source: 'pdf',
            filename: fileName,
            chunk_index: index,
            total_chunks: chunks.length,
            file_path: filePath
          }
        });
      });
    }

    console.log(`✅ Prepared ${this.documents.length} document chunks from ${pdfFiles.length} PDF files`);
  }

  /**
   * Ingest documents into RAG system
   */
  private async ingestDocuments() {
    console.log('🔄 Starting RAG ingestion...');

    if (!this.ragService.isAvailable()) {
      throw new Error('❌ RAG services not available. Check your API keys in .env file.');
    }

    for (let i = 0; i < this.documents.length; i++) {
      const doc = this.documents[i];
      console.log(`📤 Ingesting document ${i + 1}/${this.documents.length}: ${doc.metadata.filename} (chunk ${doc.metadata.chunk_index + 1})`);

      try {
        // Use the text ingestion method
        const success = await this.ragService.ingestText(doc.content, doc.metadata);
        
        if (success) {
          console.log(`✅ Successfully ingested chunk ${doc.metadata.chunk_index + 1} of ${doc.metadata.filename}`);
        } else {
          console.log(`❌ Failed to ingest chunk ${doc.metadata.chunk_index + 1} of ${doc.metadata.filename}`);
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`❌ Error ingesting ${doc.metadata.filename}:`, error);
      }
    }
  }

  /**
   * Test the RAG system with sample queries
   */
  private async testRAGSystem() {
    console.log('\n🧪 Testing RAG system with sample queries...');

    const testQueries = [
      "What documents were uploaded?",
      "Summarize the main content from the PDFs",
      "What are the key topics covered?",
      "Tell me about the uploaded information"
    ];

    for (const query of testQueries) {
      console.log(`\n❓ Query: "${query}"`);
      try {
        const response = await this.ragService.generateResponse(query);
        console.log(`🤖 Response: ${response.response.substring(0, 200)}...`);
        console.log(`📊 Confidence: ${(response.confidence * 100).toFixed(1)}%`);
      } catch (error) {
        console.error(`❌ Error testing query:`, error);
      }
    }
  }

  /**
   * Main execution function
   */
  async run() {
    try {
      console.log('🎯 PDF RAG Population Starting...\n');

      // Step 1: Process PDF files
      await this.processPDFFiles();

      if (this.documents.length === 0) {
        console.log('⚠️ No documents to ingest. Please add PDF files and try again.');
        return;
      }

      // Step 2: Ingest documents
      await this.ingestDocuments();

      // Step 3: Test the system
      await this.testRAGSystem();

      console.log('\n🎉 PDF RAG population completed successfully!');
      console.log('💡 Your chatbot is now ready to answer questions about your PDF documents.');
      console.log(`📊 Total documents ingested: ${this.documents.length}`);
      
    } catch (error) {
      console.error('❌ RAG population failed:', error);
      process.exit(1);
    }
  }
}

// Command line argument parsing
const args = process.argv.slice(2);
const pdfDirectory = args[0] || './documents';

console.log(`
📚 PDF RAG Population Tool
==========================

This script will:
1. Find all PDF files in the specified directory
2. Extract text from each PDF
3. Split text into manageable chunks
4. Ingest everything into your RAG system

Usage:
  npx tsx scripts/populate-rag-pdf.ts [pdf_directory]

Default directory: ./documents
Current directory: ${pdfDirectory}

Make sure you have PDF files in the directory before running!
`);

// Run the populator
const populator = new PDFRAGPopulator(pdfDirectory);
populator.run();
