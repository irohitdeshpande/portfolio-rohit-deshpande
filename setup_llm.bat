@echo off
echo ========================================
echo  Portfolio Chatbot LLM Setup Script
echo ========================================
echo.

echo This script will help you set up a local LLM for your portfolio chatbot.
echo.

echo Checking if Ollama is installed...
where ollama >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [✓] Ollama is already installed!
    echo.
    goto :check_model
) else (
    echo [✗] Ollama not found.
    echo.
    goto :install_ollama
)

:install_ollama
echo Please install Ollama first:
echo 1. Go to https://ollama.ai
echo 2. Download the Windows installer
echo 3. Run the installer
echo 4. Restart this script after installation
echo.
pause
exit /b 1

:check_model
echo Checking if llama3.2:1b model is available...
ollama list | findstr "llama3.2:1b" >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [✓] Model llama3.2:1b is already installed!
    echo.
    goto :start_server
) else (
    echo [✗] Model not found. Installing llama3.2:1b...
    echo.
    goto :install_model
)

:install_model
echo Installing llama3.2:1b model (this may take a few minutes)...
ollama pull llama3.2:1b
if %ERRORLEVEL% EQU 0 (
    echo [✓] Model installed successfully!
    echo.
) else (
    echo [✗] Failed to install model. Please check your internet connection.
    echo.
    pause
    exit /b 1
)

:start_server
echo Starting Ollama server...
echo.
echo [INFO] Ollama server will start in the background.
echo [INFO] The chatbot will automatically detect when it's ready.
echo [INFO] You should see "AI-Enhanced Chat Ready! ✨" in your chatbot.
echo.

start /B ollama serve

echo Waiting for server to start...
timeout /t 3 >nul

echo.
echo ========================================
echo  Setup Complete! 🎉
echo ========================================
echo.
echo Your local LLM is now ready for use with the chatbot.
echo.
echo Next steps:
echo 1. Open your portfolio website
echo 2. Try the chatbot - you should see enhanced AI responses
echo 3. Look for the 🧠 emoji after AI-generated responses
echo.
echo Server Info:
echo - Endpoint: http://localhost:11434
echo - Model: llama3.2:1b
echo - Status: Running in background
echo.
echo To stop the server later, you can:
echo - Close this window, or
echo - Run: taskkill /f /im ollama.exe
echo.

echo Testing server connection...
timeout /t 2 >nul
curl -s http://localhost:11434/api/tags >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [✓] Server is responding correctly!
) else (
    echo [⚠] Server may still be starting up. Give it a moment.
)

echo.
echo Press any key to exit...
pause >nul
