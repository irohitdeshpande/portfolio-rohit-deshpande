@echo off
REM 🔄 PROJECT SYNC SCRIPT (Windows)
REM =================================
REM Keeps your local project in sync with the GitHub repository

echo 🚀 PORTFOLIO PROJECT SYNC
echo ==========================

REM Check if we're in a git repository
git status >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Not in a git repository!
    echo Please run this script from your project root directory.
    pause
    exit /b 1
)

REM Check for uncommitted changes
git diff --quiet HEAD
if errorlevel 1 (
    echo ⚠️ You have uncommitted changes!
    echo.
    echo Options:
    echo 1. Commit changes
    echo 2. Stash changes  
    echo 3. Continue anyway
    echo 4. Exit
    echo.
    set /p choice="Choose option (1-4): "
    
    if "!choice!"=="1" (
        git add .
        set /p commit_msg="Enter commit message: "
        git commit -m "!commit_msg!"
        echo ✅ Changes committed
    ) else if "!choice!"=="2" (
        git stash push -m "Auto-stash before sync"
        echo ✅ Changes stashed
    ) else if "!choice!"=="4" (
        echo 🚪 Exiting...
        pause
        exit /b 0
    )
)

echo ✅ No uncommitted changes detected

echo 🔄 Fetching latest from GitHub...
git fetch origin

echo 📂 Switching to main branch...
git checkout main

echo 📌 Pulling latest changes...
git pull origin main

REM Check if node_modules exists and if package.json is newer
set NEED_INSTALL=0
if not exist "node_modules" set NEED_INSTALL=1

if %NEED_INSTALL%==1 (
    echo 📦 Installing dependencies...
    if exist "pnpm-lock.yaml" (
        pnpm install
    ) else (
        npm install
    )
    echo ✅ Dependencies installed
) else (
    echo ✅ Dependencies are up to date
)

echo.
echo 🚀 Starting development server...
echo ================================
echo Server will be available at: http://localhost:4321
echo Press Ctrl+C to stop the server
echo ================================
echo.

npm run dev
