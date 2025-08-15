# RAG Portfolio Management

This directory contains scripts to manage your portfolio's RAG (Retrieval-Augmented Generation) knowledge base.

## 🚀 Quick Start

### 1. Prerequisites
Make sure you have your API keys configured in `.env`:
```bash
OPENAI_API_KEY=your_openai_api_key
PINECONE_API_KEY=your_pinecone_api_key
```

### 2. Populate RAG Database
```bash
npm run populate-rag
```
This script will:
- Create structured documents from your portfolio data
- Process and chunk the content appropriately
- Upload to Pinecone vector database
- Test the system with sample queries

### 3. Clear RAG Database (if needed)
```bash
npm run clear-rag
```
Use this to start fresh or when updating your portfolio information.

## 📝 Customizing Your Portfolio Data

Edit `scripts/populate-rag.ts` to update your portfolio information:

### Personal Information
```typescript
personal: {
  name: "Your Name",
  title: "Your Title",
  location: "Your Location",
  email: "your@email.com",
  summary: "Your professional summary..."
}
```

### Skills
Add or modify your skills by category:
```typescript
skills: {
  frontend: ["React", "TypeScript", ...],
  backend: ["Node.js", "Python", ...],
  // ... more categories
}
```

### Experience & Projects
Update your work experience and project details in the respective arrays.

## 🔧 How It Works

1. **Document Preparation**: Portfolio data is converted into text documents with appropriate metadata
2. **Chunking**: Large content is split into smaller, searchable chunks
3. **Embedding**: OpenAI generates vector embeddings for each chunk
4. **Storage**: Vectors are stored in Pinecone for fast similarity search
5. **Retrieval**: When users ask questions, relevant chunks are found and used to generate accurate responses

## 🛡️ Security Features

- Information is curated and controlled by you
- No user-generated content
- Context validation prevents hallucinations
- Scope checking ensures responses stay on-topic

## 📊 Testing

After populating the database, the script automatically tests with sample queries:
- "What are your main skills?"
- "Tell me about your work experience"
- "What projects have you worked on?"

## 🔄 Updating Your Portfolio

When you want to update your portfolio information:

1. Edit the `PORTFOLIO_DATA` object in `populate-rag.ts`
2. Run `npm run clear-rag` to clear old data
3. Run `npm run populate-rag` to upload new data
4. Your chatbot will now have the updated information

## 📈 Best Practices

- Keep information current and accurate
- Use descriptive metadata for better categorization
- Test your changes with various question types
- Monitor response quality and adjust content as needed

## 🚨 Troubleshooting

### "RAG services not available"
- Check your `.env` file has valid API keys
- Verify Pinecone and OpenAI API keys are correct
- Ensure you have sufficient API credits

### Build errors
- Run `pnpm install` to ensure all dependencies are installed
- Check TypeScript errors with `pnpm build`

### Slow responses
- Consider reducing chunk size for faster processing
- Monitor API rate limits
- Check Pinecone index performance
