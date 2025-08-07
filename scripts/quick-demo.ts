#!/usr/bin/env tsx

/**
 * 🧪 QUICK RAG DEMO
 * =================
 * 
 * Quick demonstration of the RAG + Groq system
 */

import { EnhancedGroqRAGService } from './enhancedGroqRAG.js';

async function quickDemo() {
  console.log('🚀 Quick RAG + Groq Demo');
  console.log('========================\n');
  
  const ragService = new EnhancedGroqRAGService();
  
  const demoQueries = [
    "What programming languages does Rohit know?",
    "Tell me about the IntervAI project",
    "What AI projects has Rohit built?"
  ];
  
  for (const query of demoQueries) {
    console.log(`❓ ${query}`);
    console.log('⏳ Processing...\n');
    
    try {
      const result = await ragService.generateResponse(query);
      console.log(`💬 Response (Confidence: ${(result.confidence * 100).toFixed(1)}%):`);
      console.log(result.response);
      console.log('\n' + '─'.repeat(60) + '\n');
    } catch (error) {
      console.log(`❌ Error: ${error}`);
    }
  }
}

quickDemo().catch(console.error);
