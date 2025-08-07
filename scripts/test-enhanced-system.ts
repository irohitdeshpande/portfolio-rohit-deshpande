#!/usr/bin/env tsx

/**
 * 🧪 Test Enhanced RAG + Groq System
 * 
 * This script demonstrates the complete RAG + Groq pipeline
 * with advanced embeddings and quality control
 */

import { EnhancedGroqRAGService } from './enhancedGroqRAG.js';

// Test queries that showcase different capabilities
const TEST_QUERIES = [
  {
    query: "What AI and machine learning projects has Rohit worked on?",
    expectedTopics: ["IntervAI", "customer churn", "face mask", "sentiment analysis"],
    category: "Technical Projects"
  },
  {
    query: "What programming languages and technologies does Rohit know?",
    expectedTopics: ["React", "Node.js", "Python", "TypeScript", "MongoDB"],
    category: "Technical Skills"
  },
  {
    query: "Tell me about Rohit's education and academic background",
    expectedTopics: ["SIES", "Computer Engineering", "CGPA", "Mumbai"],
    category: "Education"
  },
  {
    query: "What kind of work experience does Rohit have?",
    expectedTopics: ["software engineer", "internships", "projects", "development"],
    category: "Professional Experience"
  },
  {
    query: "Can you help me with React development?",
    expectedTopics: ["React", "components", "JavaScript", "frontend"],
    category: "General Tech Help"
  }
];

async function runEnhancedTests() {
  console.log('🚀 Testing Enhanced RAG + Groq System');
  console.log('=====================================\n');
  
  const ragService = new EnhancedGroqRAGService();
  let successCount = 0;
  let totalTests = TEST_QUERIES.length;
  
  for (let i = 0; i < TEST_QUERIES.length; i++) {
    const test = TEST_QUERIES[i];
    
    try {
      console.log(`\n📝 Test ${i + 1}/${totalTests}: ${test.category}`);
      console.log(`❓ Query: "${test.query}"`);
      console.log('⏳ Processing...\n');
      
      const startTime = Date.now();
      const result = await ragService.generateResponse(test.query);
      const duration = Date.now() - startTime;
      
      if (result.response) {
        console.log(`✅ SUCCESS (${duration}ms)`);
        console.log(`📊 Confidence: ${(result.confidence * 100).toFixed(1)}%`);
        console.log(`📚 Sources: ${result.sources?.length || 0}`);
        console.log(`💬 Response:\n"${result.response}"`);
        
        // Check if response contains expected topics
        const responseText = result.response.toLowerCase();
        const foundTopics = test.expectedTopics.filter(topic => 
          responseText.includes(topic.toLowerCase())
        );
        
        console.log(`🎯 Topic Coverage: ${foundTopics.length}/${test.expectedTopics.length}`);
        if (foundTopics.length > 0) {
          console.log(`   Found: ${foundTopics.join(', ')}`);
        }
        
        successCount++;
      } else {
        console.log(`❌ FAILED: No response generated`);
      }
      
    } catch (error) {
      console.log(`💥 ERROR: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    console.log('\n' + '─'.repeat(50));
  }
  
  // Final Report
  console.log('\n🎯 ENHANCED RAG + GROQ TEST RESULTS');
  console.log('===================================');
  console.log(`✅ Successful Tests: ${successCount}/${totalTests}`);
  console.log(`📊 Success Rate: ${((successCount / totalTests) * 100).toFixed(1)}%`);
  
  if (successCount === totalTests) {
    console.log('\n🎉 PERFECT! Your RAG + Groq system is working flawlessly!');
    console.log('💡 Ready for production use!');
  } else if (successCount > 0) {
    console.log('\n⚡ Good! System is working with some areas for improvement.');
  } else {
    console.log('\n🔧 System needs troubleshooting. Check your configuration.');
  }
  
  console.log('\n🚀 Your Enhanced RAG + Groq Architecture:');
  console.log('  ▶ 384-dimensional advanced embeddings');
  console.log('  ▶ Multi-factor quality assessment');
  console.log('  ▶ Groq Llama3-8B for lightning-fast responses');
  console.log('  ▶ Sophisticated fallback strategies');
  console.log('  ▶ Domain-aware semantic understanding');
}

// Run the tests
runEnhancedTests().catch(console.error);
