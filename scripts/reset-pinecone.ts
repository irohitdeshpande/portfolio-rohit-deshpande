import { Pinecone } from '@pinecone-database/pinecone';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Reset Pinecone Index Script
 * This script will delete the existing index and create a new one with correct dimensions
 */

async function resetPineconeIndex() {
  try {
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!
    });

    const indexName = process.env.PINECONE_INDEX_NAME || 'portfolio-rag';
    
    console.log('🔧 Resetting Pinecone index...');
    console.log(`📋 Index name: ${indexName}`);

    // Check if index exists
    const indexList = await pinecone.listIndexes();
    const existingIndex = indexList.indexes?.find(index => index.name === indexName);

    if (existingIndex) {
      console.log('🗑️ Deleting existing index...');
      await pinecone.deleteIndex(indexName);
      
      // Wait for deletion to complete
      console.log('⏳ Waiting for index deletion to complete...');
      let deleted = false;
      let attempts = 0;
      while (!deleted && attempts < 30) {
        try {
          const updatedList = await pinecone.listIndexes();
          const stillExists = updatedList.indexes?.find(index => index.name === indexName);
          if (!stillExists) {
            deleted = true;
            console.log('✅ Index successfully deleted');
          } else {
            console.log(`⏳ Still deleting... (attempt ${attempts + 1}/30)`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            attempts++;
          }
        } catch (error) {
          console.log('⏳ Index deletion in progress...');
          await new Promise(resolve => setTimeout(resolve, 2000));
          attempts++;
        }
      }
    } else {
      console.log('ℹ️ No existing index found');
    }

    // Create new index with correct dimensions
    console.log('🆕 Creating new index with 384 dimensions...');
    await pinecone.createIndex({
      name: indexName,
      dimension: 384, // Correct dimensions for our simple embeddings
      metric: 'cosine',
      spec: {
        serverless: {
          cloud: 'aws',
          region: 'us-east-1'
        }
      }
    });

    // Wait for index to be ready
    console.log('⏳ Waiting for index to be ready...');
    let ready = false;
    let attempts = 0;
    while (!ready && attempts < 30) {
      try {
        const index = pinecone.index(indexName);
        const stats = await index.describeIndexStats();
        ready = true;
        console.log('✅ Index is ready!');
        console.log(`📊 Index stats:`, stats);
      } catch (error) {
        console.log(`⏳ Index initializing... (attempt ${attempts + 1}/30)`);
        await new Promise(resolve => setTimeout(resolve, 3000));
        attempts++;
      }
    }

    if (!ready) {
      throw new Error('❌ Index failed to initialize within timeout period');
    }

    console.log('\n🎉 Pinecone index reset completed successfully!');
    console.log('💡 You can now run: npm run populate-rag-groq');

  } catch (error) {
    console.error('❌ Error resetting Pinecone index:', error);
    process.exit(1);
  }
}

resetPineconeIndex();
