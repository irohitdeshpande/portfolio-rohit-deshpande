# 🚀 AI Chatbot Setup Guide

## 🔧 Environment Setup Options

Your chatbot supports **multiple ways** to configure API keys for enhanced AI responses:

### **Option 1: Environment Variables (.env file) - Recommended**

1. **Copy the example file:**
   ```bash
   copy .env.example .env
   # or on Mac/Linux:
   cp .env.example .env
   ```

2. **Add your API keys to `.env`:**
   ```env
   # OpenAI API Key (Most capable)
   OPENAI_API_KEY=sk-your-actual-openai-key-here
   
   # Groq API Key (Free alternative)
   GROQ_API_KEY=gsk_your-actual-groq-key-here
   ```

3. **Restart your development server:**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

### **Option 2: Browser Storage (User-Friendly)**
- Click ⚙️ settings in chatbot header
- Enter API keys directly in the UI
- Keys stored locally in browser
- Perfect for user customization

### **Option 3: Production Environment Variables**
For deployment platforms like Vercel, Netlify, etc.

## 🔑 Getting API Keys

### **OpenAI (Premium, Most Capable)**
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in/up to your account
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)
5. Add to your `.env` file

### **Groq (Free, Fast Alternative)** ⭐
1. Go to [Groq Console](https://console.groq.com/keys)
2. Sign up (it's free!)
3. Create API key
4. Copy the key (starts with `gsk_`)
5. Add to your `.env` file

## 🌐 Deployment Configuration

### **Vercel Deployment**
1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add your keys:
   - `OPENAI_API_KEY` = `sk-your-key`
   - `GROQ_API_KEY` = `gsk-your-key`
4. Redeploy your site

### **Netlify Deployment**
1. Go to Site Settings → Environment Variables
2. Add the same keys as above
3. Trigger a new build

## 📋 Priority System

The chatbot checks for API keys in this order:
1. **Environment Variables** (.env file or platform env vars)
2. **Browser localStorage** (user-added keys)
3. **Fallback to Pattern Matching** (always works!)

## 🔒 Security Notes

- ✅ `.env` files are automatically ignored by Git
- ✅ Environment variables are secure for production
- ✅ localStorage keys stay in user's browser only
- ✅ Chatbot works great without any keys (pattern matching)

## 🧪 Testing Your Setup

1. **Start your dev server:**
   ```bash
   pnpm dev
   ```

2. **Open your portfolio**
3. **Click the chatbot button**
4. **Look for status indicators:**
   - 🌟🧠 = Both Cloud + Local AI available
   - 🌟 = Cloud AI only
   - 🧠 = Local AI only  
   - ⚡ = Pattern matching (always works)

5. **Test with questions like:**
   - "Tell me about your experience"
   - "What projects have you built?"
   - "What are your technical skills?"

## 💡 Tips

- **For Development**: Use `.env` file for consistent setup
- **For Users**: Let them add keys via ⚙️ settings UI  
- **For Production**: Use platform environment variables
- **No Setup Needed**: Pattern matching provides great responses without AI

Your chatbot is now ready with flexible AI configuration! 🎉
