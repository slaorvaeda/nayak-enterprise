#!/bin/bash

echo "🚀 Starting Nayak Enterprises Application..."

# Check if MongoDB is running
echo "📊 Checking MongoDB connection..."
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first."
    echo "   On macOS: brew services start mongodb-community"
    echo "   On Ubuntu: sudo systemctl start mongod"
    echo "   On Windows: Start MongoDB service from Services"
    exit 1
fi

# Start backend server
echo "🔧 Starting backend server..."
cd backend
if [ ! -f .env ]; then
    echo "📝 Creating .env file for backend..."
    cat > .env << EOF
# Server Configuration
PORT=5001
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/nayak-enterprises

# JWT Configuration
JWT_SECRET=nayak-enterprises-secret-key-2024
JWT_EXPIRE=7d

# CORS Configuration
FRONTEND_URL=http://localhost:3000
EOF
fi

# Install backend dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi

# Seed the database
echo "🌱 Seeding database with sample data..."
npm run seed

# Start backend in background
echo "🚀 Starting backend server on port 5001..."
npm start &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "🎨 Starting frontend..."
cd ../frontend

# Install frontend dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

# Start frontend
echo "🚀 Starting frontend server on port 3000..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Application started successfully!"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:5001"
echo ""
echo "👤 Test Credentials:"
echo "   Email: john@samplestore.com"
echo "   Password: customer123"
echo ""
echo "🔑 Admin Credentials:"
echo "   Email: admin@nayakenterprises.com"
echo "   Password: admin123"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user to stop
wait 