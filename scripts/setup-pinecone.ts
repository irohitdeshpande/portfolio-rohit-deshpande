import { Pinecone } from '@pinecone-database/pinecone';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function setupPineconeIndex() {
  console.log('🔧 Setting up Pinecone index...');
  
  if (!process.env.PINECONE_API_KEY) {
    console.error('❌ PINECONE_API_KEY not found');
    return;
  }
  
  try {
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });

    const indexName = 'rohit-portfolio-rag';
    
    // Check if index exists
    const indexes = await pinecone.listIndexes();
    const existingIndex = indexes.indexes?.find(index => index.name === indexName);
    
    if (existingIndex) {
      console.log(`✅ Index "${indexName}" already exists`);
      
      // Check index stats
      const index = pinecone.index(indexName);
      const stats = await index.describeIndexStats();
      console.log(`📊 Index stats:`, {
        totalRecordCount: stats.totalRecordCount,
        dimension: stats.dimension,
        namespaces: Object.keys(stats.namespaces || {})
      });
    } else {
      console.log(`📝 Creating index "${indexName}"...`);
      
      await pinecone.createIndex({
        name: indexName,
        dimension: 384, // Smaller dimension for simple embeddings
        metric: 'cosine',
        spec: {
          serverless: {
            cloud: 'aws',
            region: 'us-east-1'
          }
        }
      });
      
      console.log(`✅ Index "${indexName}" created successfully`);
      console.log('⏳ Waiting for index to be ready...');
      
      // Wait for index to be ready
      let isReady = false;
      let attempts = 0;
      const maxAttempts = 30;
      
      while (!isReady && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        try {
          const index = pinecone.index(indexName);
          await index.describeIndexStats();
          isReady = true;
          console.log('✅ Index is ready!');
        } catch (error) {
          attempts++;
          console.log(`⏳ Still waiting... (${attempts}/${maxAttempts})`);
        }
      }
      
      if (!isReady) {
        console.log('⚠️ Index creation timed out, but it might still be initializing');
      }
    }
    
  } catch (error) {
    console.error('❌ Error setting up Pinecone index:', error);
  }
}

setupPineconeIndex();
