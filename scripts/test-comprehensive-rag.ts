#!/usr/bin/env tsx

/**
 * 🚀 COMPREHENSIVE RAG + GROQ SYSTEM TESTER
 * ==========================================
 * 
 * Tests the complete RAG pipeline with detailed analysis
 */

import { EnhancedGroqRAGService } from './enhancedGroqRAG.js';

// Comprehensive test scenarios
const COMPREHENSIVE_TESTS = [
  {
    query: "What are Rohit's main technical skills and programming languages?",
    expectedKeywords: ["React", "Python", "TypeScript", "Node.js", "AI", "ML"],
    category: "Technical Skills"
  },
  {
    query: "Tell me about the IntervAI project - what does it do and how was it built?",
    expectedKeywords: ["IntervAI", "AI", "interview", "React", "Node.js"],
    category: "AI Projects"
  },
  {
    query: "What AI and machine learning projects has Rohit worked on?",
    expectedKeywords: ["IntervAI", "face mask", "sentiment analysis", "customer churn"],
    category: "AI/ML Portfolio"
  },
  {
    query: "Describe Rohit's web development expertise and frameworks",
    expectedKeywords: ["React", "Astro", "TypeScript", "full-stack", "frontend"],
    category: "Web Development"
  },
  {
    query: "What is Rohit's educational background and current studies?",
    expectedKeywords: ["engineering", "computer", "college", "student"],
    category: "Education"
  }
];

async function runComprehensiveTests() {
  console.log('🚀 COMPREHENSIVE RAG + GROQ SYSTEM TESTING');
  console.log('==========================================\n');
  
  const ragService = new EnhancedGroqRAGService();
  
  if (!ragService.isAvailable()) {
    console.log('❌ RAG service not available! Check your API keys.');
    return;
  }
  
  console.log('✅ RAG service initialized successfully\n');
  
  for (let i = 0; i < COMPREHENSIVE_TESTS.length; i++) {
    const test = COMPREHENSIVE_TESTS[i];
    
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📋 TEST ${i + 1}/${COMPREHENSIVE_TESTS.length}: ${test.category}`);
    console.log(`${'='.repeat(60)}`);
    console.log(`❓ QUERY: "${test.query}"`);
    console.log(`⏳ Processing with advanced RAG pipeline...\n`);
    
    try {
      const startTime = Date.now();
      const result = await ragService.generateResponse(test.query);
      const duration = Date.now() - startTime;
      
      // Display comprehensive results
      console.log(`⚡ PROCESSING TIME: ${duration}ms`);
      console.log(`📊 CONFIDENCE SCORE: ${(result.confidence * 100).toFixed(1)}%`);
      console.log(`📚 SOURCES FOUND: ${result.sources?.length || 0}`);
      
      // Source analysis
      if (result.sources && result.sources.length > 0) {
        console.log(`\n🔍 SOURCE QUALITY ANALYSIS:`);
        result.sources.slice(0, 3).forEach((source, idx) => {
          console.log(`   ${idx + 1}. Score: ${(source.score * 100).toFixed(1)}% | Type: ${source.metadata?.type || 'Unknown'}`);
        });
      }
      
      // Keyword coverage analysis
      const responseText = result.response.toLowerCase();
      const foundKeywords = test.expectedKeywords.filter(keyword => 
        responseText.includes(keyword.toLowerCase())
      );
      
      console.log(`\n🎯 KEYWORD COVERAGE: ${foundKeywords.length}/${test.expectedKeywords.length}`);
      if (foundKeywords.length > 0) {
        console.log(`   ✅ Found: ${foundKeywords.join(', ')}`);
      }
      if (foundKeywords.length < test.expectedKeywords.length) {
        const missing = test.expectedKeywords.filter(k => !foundKeywords.includes(k));
        console.log(`   ❌ Missing: ${missing.join(', ')}`);
      }
      
      console.log(`\n💬 COMPLETE RESPONSE:`);
      console.log(`${'─'.repeat(50)}`);
      console.log(result.response);
      console.log(`${'─'.repeat(50)}`);
      
      // Quality assessment
      const qualityScore = assessDetailedQuality(result, test);
      console.log(`\n⭐ OVERALL QUALITY: ${(qualityScore * 100).toFixed(1)}%`);
      
      if (qualityScore >= 0.8) {
        console.log(`🎉 EXCELLENT - Response meets all quality criteria`);
      } else if (qualityScore >= 0.6) {
        console.log(`✅ GOOD - Response is satisfactory with minor areas for improvement`);
      } else if (qualityScore >= 0.4) {
        console.log(`⚠️ FAIR - Response needs improvement in several areas`);
      } else {
        console.log(`❌ POOR - Response requires significant improvement`);
      }
      
    } catch (error) {
      console.log(`💥 ERROR: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    console.log(`\n⏸️ Waiting 2 seconds before next test...\n`);
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('\n🎯 TESTING COMPLETE!');
  console.log('=====================');
  console.log('Your RAG + Groq system has been thoroughly tested.');
  console.log('Check the detailed results above for performance insights.');
}

/**
 * Detailed quality assessment with multiple factors
 */
function assessDetailedQuality(result: any, test: any): number {
  let score = 0;
  
  // Factor 1: Response completeness (25%)
  const wordCount = result.response.split(/\s+/).length;
  if (wordCount >= 50 && wordCount <= 300) {
    score += 0.25;
  } else if (wordCount >= 20) {
    score += 0.15;
  }
  
  // Factor 2: Keyword coverage (30%)
  const responseText = result.response.toLowerCase();
  const keywordCoverage = test.expectedKeywords.filter((keyword: string) => 
    responseText.includes(keyword.toLowerCase())
  ).length / test.expectedKeywords.length;
  score += keywordCoverage * 0.3;
  
  // Factor 3: Source quality (25%)
  if (result.sources && result.sources.length > 0) {
    const avgSourceScore = result.sources.reduce((sum: number, source: any) => 
      sum + source.score, 0) / result.sources.length;
    score += avgSourceScore * 0.25;
  }
  
  // Factor 4: Confidence bonus (20%)
  score += result.confidence * 0.2;
  
  return Math.min(score, 1.0);
}

// Run the comprehensive tests
console.log('Starting comprehensive RAG + Groq system testing...\n');
runComprehensiveTests().catch(console.error);
