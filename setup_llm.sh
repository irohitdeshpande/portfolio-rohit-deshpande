#!/bin/bash

echo "========================================"
echo " Portfolio Chatbot LLM Setup Script"
echo "========================================"
echo

echo "This script will help you set up a local LLM for your portfolio chatbot."
echo

# Check if Ollama is installed
if command -v ollama &> /dev/null; then
    echo "✓ Ollama is already installed!"
    echo
else
    echo "✗ Ollama not found. Installing Ollama..."
    echo
    
    # Install Ollama
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        echo "Installing Ollama for macOS..."
        curl -fsSL https://ollama.ai/install.sh | sh
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        echo "Installing Ollama for Linux..."
        curl -fsSL https://ollama.ai/install.sh | sh
    else
        echo "Unsupported operating system. Please install Ollama manually from https://ollama.ai"
        exit 1
    fi
    
    if [ $? -eq 0 ]; then
        echo "✓ Ollama installed successfully!"
        echo
    else
        echo "✗ Failed to install Ollama. Please check your internet connection."
        exit 1
    fi
fi

# Check if model is installed
echo "Checking if llama3.2:1b model is available..."
if ollama list | grep -q "llama3.2:1b"; then
    echo "✓ Model llama3.2:1b is already installed!"
    echo
else
    echo "✗ Model not found. Installing llama3.2:1b..."
    echo
    echo "Installing llama3.2:1b model (this may take a few minutes)..."
    
    ollama pull llama3.2:1b
    
    if [ $? -eq 0 ]; then
        echo "✓ Model installed successfully!"
        echo
    else
        echo "✗ Failed to install model. Please check your internet connection."
        exit 1
    fi
fi

# Start Ollama server
echo "Starting Ollama server..."
echo

# Check if Ollama is already running
if pgrep -x "ollama" > /dev/null; then
    echo "✓ Ollama server is already running!"
else
    echo "[INFO] Starting Ollama server in the background..."
    ollama serve &
    
    echo "[INFO] Waiting for server to start..."
    sleep 3
fi

echo
echo "========================================"
echo " Setup Complete! 🎉"
echo "========================================"
echo

echo "Your local LLM is now ready for use with the chatbot."
echo

echo "Next steps:"
echo "1. Open your portfolio website"
echo "2. Try the chatbot - you should see enhanced AI responses"
echo "3. Look for the 🧠 emoji after AI-generated responses"
echo

echo "Server Info:"
echo "- Endpoint: http://localhost:11434"
echo "- Model: llama3.2:1b"
echo "- Status: Running in background"
echo

echo "Testing server connection..."
sleep 2

if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo "✓ Server is responding correctly!"
else
    echo "⚠ Server may still be starting up. Give it a moment."
fi

echo

echo "To stop the server later, you can run:"
echo "pkill ollama"
echo

echo "Setup completed successfully! Your chatbot now has AI superpowers! 🚀"
