import { Pinecone } from '@pinecone-database/pinecone';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Clear RAG Database Script
 * Run this script to clear all data from your RAG vector database
 * Usage: npm run clear-rag
 */

async function clearRAGDatabase() {
  console.log('🧹 Starting RAG database cleanup...');

  const apiKey = process.env.PINECONE_API_KEY;
  
  if (!apiKey) {
    console.error('❌ PINECONE_API_KEY not found in environment variables');
    process.exit(1);
  }

  try {
    const pinecone = new Pinecone({
      apiKey: apiKey,
    });

    const indexName = 'rohit-portfolio-rag';
    const namespace = 'portfolio-docs';

    console.log(`🎯 Targeting index: ${indexName}, namespace: ${namespace}`);

    // Get the index
    const index = pinecone.index(indexName);

    // Delete all vectors in the namespace
    await index.namespace(namespace).deleteAll();

    console.log('✅ Successfully cleared all vectors from RAG database');
    console.log('💡 You can now run "npm run populate-rag" to repopulate with fresh data');

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes('Index not found')) {
      console.log('ℹ️  Index does not exist yet - nothing to clear');
      console.log('💡 Run "npm run populate-rag" to create and populate the database');
    } else {
      console.error('❌ Error clearing RAG database:', error);
      process.exit(1);
    }
  }
}

clearRAGDatabase();
