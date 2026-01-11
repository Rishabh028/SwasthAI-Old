#!/bin/bash

# SwasthAI Backend Startup Script for Production

echo "🚀 Starting SwasthAI Backend..."

# Run database migrations
echo "📊 Syncing database schema..."
npx prisma db push --skip-generate || {
  echo "❌ Database sync failed"
  exit 1
}

echo "✅ Database ready"

# Start the application
echo "🎯 Starting Express server..."
node src/app.js
