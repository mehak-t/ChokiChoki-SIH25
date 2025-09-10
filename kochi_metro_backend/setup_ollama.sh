#!/bin/bash

echo "🤖 Setting up Ollama Gemma 2B for KMRL AI Enhancement"

# Check if Ollama is installed
if ! command -v ollama &> /dev/null; then
    echo "Installing Ollama..."
    curl -fsSL https://ollama.ai/install.sh | sh
else
    echo "✅ Ollama already installed"
fi

# Start Ollama service
echo "Starting Ollama service..."
ollama serve &

# Wait for service to start
sleep 5

# Pull Gemma 2B model
echo "Downloading Gemma 2B model (this may take a few minutes)..."
ollama pull gemma2:2b

echo "✅ Ollama Gemma 2B setup complete!"
echo "🚀 You can now use AI-enhanced predictions in your KMRL system"

# Test the setup
echo "Testing Ollama connection..."
curl -s http://localhost:11434/api/tags > /dev/null && echo "✅ Ollama service is running" || echo "❌ Ollama service failed to start"
