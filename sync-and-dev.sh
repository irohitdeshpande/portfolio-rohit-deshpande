#!/bin/bash

# 🔄 PROJECT SYNC SCRIPT
# ======================
# Keeps your local project in sync with the GitHub repository
# Handles uncommitted changes, branch switching, and server startup

set -e  # Exit if any command fails

BRANCH="feature-chat"
STASH_NAME="auto-stash-$(date +%s)"

echo "🚀 PORTFOLIO PROJECT SYNC"
echo "=========================="

# Function to check if we're in a git repository
check_git_repo() {
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        echo "❌ Error: Not in a git repository!"
        echo "Please run this script from your project root directory."
        exit 1
    fi
}

# Function to handle uncommitted changes
handle_uncommitted_changes() {
    if [[ -n $(git status --porcelain) ]]; then
        echo "⚠️ Uncommitted changes detected!"
        echo "Available options:"
        echo "1. Stash changes and continue"
        echo "2. Commit changes and continue"
        echo "3. Exit and handle manually"
        
        read -p "Choose option (1/2/3): " choice
        
        case $choice in
            1)
                echo "📦 Stashing changes as: $STASH_NAME"
                git stash push -m "$STASH_NAME"
                echo "✅ Changes stashed. You can restore them later with:"
                echo "   git stash pop"
                ;;
            2)
                echo "📝 Committing changes..."
                git add .
                read -p "Enter commit message (or press Enter for default): " commit_msg
                if [[ -z "$commit_msg" ]]; then
                    commit_msg="WIP: Auto-commit before sync"
                fi
                git commit -m "$commit_msg"
                echo "✅ Changes committed"
                ;;
            3)
                echo "🚪 Exiting. Please handle changes manually and re-run."
                echo "Helpful commands:"
                echo "  git add . && git commit -m 'Your message'"
                echo "  git stash"
                exit 0
                ;;
            *)
                echo "❌ Invalid option. Exiting."
                exit 1
                ;;
        esac
    else
        echo "✅ No uncommitted changes detected"
    fi
}

# Function to sync with remote
sync_with_remote() {
    echo "🔍 Checking remote connection..."
    if ! git remote get-url origin > /dev/null 2>&1; then
        echo "❌ Error: No remote origin configured!"
        exit 1
    fi
    
    echo "🔄 Fetching latest from GitHub..."
    git fetch origin --prune
    
    echo "📂 Checking out branch: $BRANCH"
    if git show-ref --verify --quiet refs/heads/$BRANCH; then
        git checkout $BRANCH
    else
        echo "🆕 Branch $BRANCH doesn't exist locally. Creating from origin..."
        git checkout -b $BRANCH origin/$BRANCH
    fi
    
    echo "📌 Syncing with remote branch..."
    if git show-ref --verify --quiet refs/remotes/origin/$BRANCH; then
        # Check if there are differences
        LOCAL=$(git rev-parse HEAD)
        REMOTE=$(git rev-parse origin/$BRANCH)
        
        if [[ $LOCAL != $REMOTE ]]; then
            echo "🔄 Differences found. Syncing with remote..."
            git reset --hard origin/$BRANCH
            echo "✅ Local branch synced with remote"
        else
            echo "✅ Already up to date with remote"
        fi
    else
        echo "⚠️ Remote branch $BRANCH not found. Using local version."
    fi
}

# Function to install dependencies if needed
check_dependencies() {
    if [[ ! -d "node_modules" ]] || [[ package.json -nt node_modules ]]; then
        echo "📦 Installing/updating dependencies..."
        if command -v pnpm > /dev/null 2>&1; then
            pnpm install
        elif command -v npm > /dev/null 2>&1; then
            npm install
        else
            echo "❌ Error: No package manager found (npm or pnpm required)"
            exit 1
        fi
        echo "✅ Dependencies updated"
    else
        echo "✅ Dependencies are up to date"
    fi
}

# Function to start development server
start_dev_server() {
    echo "🚀 Starting Astro development server..."
    echo "Press Ctrl+C to stop the server"
    echo "Server will be available at: http://localhost:4321"
    echo "=================================="
    
    if [[ -f "./node_modules/.bin/astro" ]]; then
        ./node_modules/.bin/astro dev
    else
        echo "❌ Astro not found in node_modules"
        echo "Try running: npm install"
        exit 1
    fi
}

# Main execution
main() {
    check_git_repo
    handle_uncommitted_changes
    sync_with_remote
    check_dependencies
    start_dev_server
}

# Run main function
main "$@"
