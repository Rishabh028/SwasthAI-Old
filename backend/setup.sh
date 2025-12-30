#!/bin/bash

# SwasthAI Backend Setup Script
# This script sets up the complete backend with Prisma ORM and PostgreSQL

echo "📦 Installing backend dependencies..."
cd backend
npm install --legacy-peer-deps

echo "🔧 Generating Prisma client..."
npx prisma generate

echo "📊 Running database migrations..."
npx prisma migrate dev --name init

echo "🌱 Seeding database with sample data..."
node src/scripts/seed.js

echo "✅ Backend setup complete!"
echo ""
echo "Next steps:"
echo "1. Start the backend: npm run dev"
echo "2. View database: npx prisma studio"
echo ""
