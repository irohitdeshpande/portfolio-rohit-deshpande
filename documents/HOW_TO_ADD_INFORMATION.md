# How to Add Information to Your RAG System

Your RAG chatbot can learn from information in multiple ways. Here are your options:

## 📝 Method 1: Edit Portfolio Data (Easiest)

**File to edit:** `scripts/populate-rag.ts` or `scripts/populate-rag-groq.ts`

1. Open the populate script
2. Find the `PORTFOLIO_DATA` object (around line 16)
3. Replace the sample data with your actual information:
   - Personal details
   - Skills and technologies
   - Work experience
   - Education
   - Projects
   - Expertise areas

4. Run the script:
   ```bash
   npm run populate-rag-groq
   ```

## 📄 Method 2: Upload PDF Documents

**Directory:** `documents/` (already created for you)

1. Place your PDF files in the `documents/` folder:
   - Resume/CV
   - Portfolio documents
   - Project descriptions
   - Certificates
   - Any other relevant PDFs

2. Run the PDF ingestion script:
   ```bash
   npm run populate-rag-pdf
   ```

## 🔧 Method 3: Custom Text Files

You can also modify the scripts to read from:
- Text files (.txt)
- Markdown files (.md)
- JSON data files
- Any other format you prefer

## 🚀 Quick Start

**For immediate testing with sample data:**
```bash
npm run populate-rag-groq
```

**To add your own PDFs:**
1. Copy your PDF files to the `documents/` folder
2. Run: `npm run populate-rag-pdf`

**To customize with your data:**
1. Edit `scripts/populate-rag-groq.ts`
2. Update the `PORTFOLIO_DATA` object
3. Run: `npm run populate-rag-groq`

## 💡 Tips

- The Groq version (`populate-rag-groq`) is recommended as it doesn't require OpenAI credits
- You can run the populate scripts multiple times to add more information
- The RAG system will automatically handle chunking and embedding of your content
- Test your chatbot after each population to see how it responds

## 🔍 Testing

After populating, test your chatbot by asking questions like:
- "What are my skills?"
- "Tell me about my experience"
- "What projects have I worked on?"
- "What's in my resume?"
