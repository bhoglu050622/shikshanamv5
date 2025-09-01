#!/bin/bash

echo "🚀 Setting up Shikshanam Payload CMS..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if MongoDB is running
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB is not installed. Please install MongoDB or use MongoDB Atlas."
    echo "   For local installation: https://docs.mongodb.com/manual/installation/"
    echo "   For MongoDB Atlas: https://www.mongodb.com/atlas"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cp env.cms.example .env.local
    echo "✅ .env.local created. Please update the configuration values."
    echo "   - PAYLOAD_SECRET: Generate a secure random string"
    echo "   - MONGODB_URI: Your MongoDB connection string"
    echo "   - PAYLOAD_PUBLIC_SERVER_URL: Your server URL"
else
    echo "✅ .env.local already exists"
fi

# Initialize admin user
echo "👤 Initializing admin user..."
npm run cms:init

# Generate TypeScript types
echo "🔧 Generating TypeScript types..."
npm run cms:generate:types

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your configuration"
echo "2. Start the development server: npm run dev"
echo "3. Access the CMS at: http://localhost:3000/cms"
echo "4. Login with: admin@shikshanam.com / adminadmin"
echo ""
echo "📚 For more information, see CMS_README.md"
