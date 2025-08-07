import { NodeRAGService } from './nodeRAGService.js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testRAG() {
  console.log('🧪 Testing RAG system...');
  
  const ragService = new NodeRAGService();
  
  // Wait a moment for initialization
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  if (!ragService.isAvailable()) {
    console.log('❌ RAG services not available');
    return;
  }
  
  const testQueries = [
    "What are Rohit's main skills?",
    "Tell me about Rohit's work experience",
    "What projects has Rohit worked on?"
  ];
  
  for (const query of testQueries) {
    console.log(`\n❓ Testing: "${query}"`);
    try {
      const response = await ragService.generateResponse(query);
      console.log(`🤖 Response: ${response.response.substring(0, 100)}...`);
      console.log(`📊 Confidence: ${(response.confidence * 100).toFixed(1)}%`);
      console.log(`📚 Sources: ${response.sources || 0}`);
    } catch (error) {
      console.error(`❌ Error:`, error);
    }
  }
}

testRAG();
