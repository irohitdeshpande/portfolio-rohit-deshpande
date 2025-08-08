# Local LLM Setup Guide for Portfolio Chatbot

This guide will help you set up a local LLM to enhance your portfolio chatbot with intelligent responses.

## Prerequisites

- Your portfolio should be running (usually on http://localhost:4321)
- Basic familiarity with command line operations

## Option 1: Ollama (Recommended - Easiest Setup)

### Step 1: Install Ollama

**Windows:**
1. Go to [https://ollama.ai](https://ollama.ai)
2. Download the Windows installer
3. Run the installer and follow the setup instructions

**macOS:**
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

**Linux:**
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

### Step 2: Install a Lightweight Model

```bash
# Install Llama 3.2 1B model (recommended for fast responses)
ollama pull llama3.2:1b

# Alternative models (choose one):
# ollama pull llama3.2:3b    # Better quality, slower
# ollama pull phi3:mini      # Microsoft's compact model
# ollama pull gemma2:2b      # Google's efficient model
```

### Step 3: Start Ollama Server

```bash
# Start Ollama (it should start automatically after installation)
ollama serve
```

The server will run on `http://localhost:11434` by default.

### Step 4: Test the Setup

Open your portfolio and try the chatbot. You should see "AI-Enhanced Chat Ready! ✨" in the header when LLM is available.

## Option 2: LM Studio (Alternative GUI-based Option)

### Step 1: Install LM Studio

1. Go to [https://lmstudio.ai](https://lmstudio.ai)
2. Download and install LM Studio
3. Launch the application

### Step 2: Download a Model

1. In LM Studio, go to the "Discover" tab
2. Search for and download one of these models:
   - `microsoft/Phi-3-mini-4k-instruct-gguf`
   - `google/gemma-2-2b-it-gguf`
   - `meta-llama/Llama-3.2-1B-Instruct-gguf`

### Step 3: Start Local Server

1. Go to the "Local Server" tab in LM Studio
2. Load your downloaded model
3. Start the server (default port: 1234)

### Step 4: Update Configuration

If using LM Studio, update the chatbot configuration:

```javascript
const LLM_CONFIG = {
  apiEndpoint: 'http://localhost:1234/v1/chat/completions',
  // ... other config options
};
```

## Chatbot Features

### With Local LLM Available:
- ✨ Intelligent contextual responses
- 🧠 Natural language understanding  
- 🚀 Personality-aware conversations
- ⚡ Fast pattern matching fallback
- 🎯 Context-aware about your portfolio

### Without Local LLM:
- ⚡ Fast pattern-based responses
- 📝 Pre-written contextual answers
- 🤖 Fuzzy matching for similar questions
- 💬 Comprehensive coverage of common queries

## Troubleshooting

### LLM Not Detected
1. Ensure Ollama/LM Studio is running
2. Check the correct port (11434 for Ollama, 1234 for LM Studio)
3. Verify the model is loaded
4. Check browser console for error messages

### Slow Responses
1. Use a smaller model (llama3.2:1b recommended)
2. Reduce `maxTokens` in the configuration
3. Increase `timeout` value if needed
4. Consider using pattern-only mode for development

### Installation Issues
1. Check system requirements for your chosen LLM solution
2. Ensure sufficient RAM (4GB+ recommended)
3. Restart the LLM service after installation
4. Check firewall settings for local ports

## Configuration Options

You can customize the LLM behavior by modifying these values in `Chatbot.astro`:

```javascript
const LLM_CONFIG = {
  apiEndpoint: 'http://localhost:11434/api/generate',
  model: 'llama3.2:1b',           // Model name
  maxTokens: 150,                 // Response length limit
  temperature: 0.7,               // Creativity level (0.0-1.0)
  timeout: 8000,                  // Response timeout (ms)
};
```

## Performance Tips

1. **For Development:** Use pattern-only mode for faster iteration
2. **For Production:** Consider cloud-hosted LLM APIs for better reliability
3. **For Demos:** Local LLM provides the best offline experience
4. **Model Selection:** Balance between model size and response quality

## Security Considerations

- Local LLM runs entirely on your machine (privacy-friendly)
- No data sent to external services
- Portfolio context is embedded in the system prompt
- Consider rate limiting for production deployments

## Next Steps

1. Test different models to find the best balance for your needs
2. Customize the `PORTFOLIO_CONTEXT` to reflect your latest achievements
3. Add more sophisticated pattern matching for common queries
4. Consider implementing conversation memory for multi-turn dialogs

---

For questions or issues, check the browser console for debugging information or refer to the respective documentation for Ollama or LM Studio.
