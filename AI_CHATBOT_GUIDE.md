# 🤖 AI-Enhanced Portfolio Chatbot

## 🌟 Multi-AI Integration

Your portfolio chatbot now supports **3 different AI modes** with automatic fallback:

### 1. **External Cloud AI** (🌟)
- **OpenAI GPT-3.5-turbo**: Most capable responses
- **Groq Llama3**: Fast and free alternative
- **Setup**: Configure in `.env` file

### 2. **Local AI** (🧠)
- **Ollama + Llama3.2:1b**: Privacy-first, runs locally
- **Setup**: Run `setup_llm.bat` (Windows) or `setup_llm.sh` (Mac/Linux)

### 3. **Smart Pattern Matching** (⚡)
- **Advanced fuzzy matching**: Intelligent responses without AI
- **No setup required**: Works out of the box

## 🚀 AI Response Priority System

1. **External AI** → Most capable, cloud-powered
2. **Local AI** → Privacy-focused, offline-capable  
3. **Pattern Matching** → Fast, reliable fallback
4. **Default Responses** → Always available

## 🔧 Simple Setup Guide

### **Environment Variables (.env file)**

Your API keys are configured in the `.env` file:

```env
# OpenAI API Key (Already configured!)
OPENAI_API_KEY=sk-your-key-here

# Groq API Key (Free alternative)
GROQ_API_KEY=gsk-your-key-here
```

**To add more keys:**
1. Get API key from [Groq](https://console.groq.com/keys) (free!)
2. Add to `.env` file: `GROQ_API_KEY=gsk-your-key`
3. Restart dev server: `pnpm dev`

### **Local AI (Privacy-First)**
```bash
# Windows
setup_llm.bat

# Mac/Linux
./setup_llm.sh
```

## 🔑 API Key Sources

### **OpenAI (Premium)** ✅ *Already Configured*
- Most advanced AI responses
- Costs per request
- Already set up in your `.env` file

### **Groq (Free & Recommended)** 
1. Visit [Groq Console](https://console.groq.com/keys)
2. Sign up (completely free!)
3. Create API key (starts with `gsk_`)
4. Add to `.env`: `GROQ_API_KEY=gsk-your-key`

## 🌐 Deployment Ready

### **Vercel Deployment**
1. **Deploy your code** - Works immediately with pattern matching
2. **Add environment variables** in Vercel Dashboard:
   - `OPENAI_API_KEY` = your OpenAI key
   - `GROQ_API_KEY` = your Groq key (if added)
3. **Redeploy** - AI enhancement active!

### **Other Platforms**
- Same process: Deploy first, add environment variables
- Variables: `OPENAI_API_KEY`, `GROQ_API_KEY`

## 🔒 Current Configuration

✅ **OpenAI Integration**: Ready to use
✅ **Pattern Matching**: Always active as fallback  
✅ **Environment Variables**: Secure configuration
✅ **Zero-Config Deployment**: Works without setup

## 💡 Features

- ✅ **Multi-modal responses** with intelligent routing
- ✅ **Environment variable configuration**
- ✅ **Real-time AI status** indicators
- ✅ **Automatic fallbacks** ensure reliability
- ✅ **Mobile-responsive** design
- ✅ **Professional context** awareness

## 🎯 Response Sources & Indicators

| Indicator | Source | Status |
|-----------|--------|--------|
| 🌟 | OpenAI API | ✅ Configured |
| 🌟 | Groq API | ⚪ Optional |
| 🧠 | Local AI | ⚪ Optional |
| ⚡ | Pattern Match | ✅ Always Active |

## 🧪 Testing Your Setup

1. **Start dev server:** `pnpm dev`
2. **Open chatbot** - Look for status:
   - 🌟 = OpenAI Active
   - ⚡ = Pattern Matching (fallback)
3. **Test with questions:**
   - "Tell me about your experience"
   - "What are your technical skills?"
   - "Show me your projects"

Your chatbot is production-ready with OpenAI enhancement! 🎉
