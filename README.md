# Nayak Enterprises B2B Platform

A comprehensive B2B wholesale platform built with Next.js frontend and Node.js backend.

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nayak-enterprises
   ```

2. **Start MongoDB**
   ```bash
   # macOS
   brew services start mongodb-community
   
   # Ubuntu/Debian
   sudo systemctl start mongod
   
   # Windows
   # Start MongoDB service from Services
   ```

3. **Run the startup script**
   ```bash
   chmod +x start.sh
   ./start.sh
   ```

This script will:
- Check if MongoDB is running
- Create necessary environment files
- Install dependencies for both frontend and backend
- Seed the database with sample data
- Start both frontend and backend servers

## 📱 Application URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001

## 👤 Test Credentials

### Customer Account
- **Email**: john@samplestore.com
- **Password**: customer123

### Admin Account
- **Email**: admin@nayakenterprises.com
- **Password**: admin123

## 🔧 Manual Setup

If you prefer to set up manually:

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   cat > .env << EOF
   PORT=5001
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/nayak-enterprises
   JWT_SECRET=nayak-enterprises-secret-key-2024
   JWT_EXPIRE=7d
   FRONTEND_URL=http://localhost:3000
   EOF
   ```

4. **Seed the database**
   ```bash
   npm run seed
   ```

5. **Start the server**
   ```bash
   npm start
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

## 🐛 Troubleshooting

### Profile Loading Error

If you see "No authentication token found" error:

1. **Make sure you're logged in**
   - Go to http://localhost:3000/login
   - Use the test credentials above

2. **Check if backend is running**
   - Backend should be running on port 5001
   - Check http://localhost:5001/api/auth/me (should return 401 if not authenticated)

3. **Check MongoDB connection**
   - Ensure MongoDB is running
   - Check if database is seeded with sample users

### Backend Connection Issues

1. **Check if backend is running**
   ```bash
   curl http://localhost:5001/api/auth/me
   ```

2. **Check MongoDB connection**
   ```bash
   mongo nayak-enterprises --eval "db.users.find()"
   ```

3. **Restart backend with logs**
   ```bash
   cd backend
   npm start
   ```

### Frontend Issues

1. **Clear browser cache and localStorage**
   - Open browser dev tools
   - Go to Application > Storage
   - Clear localStorage and sessionStorage

2. **Check network requests**
   - Open browser dev tools
   - Go to Network tab
   - Check if API requests are failing

## 📁 Project Structure

```
nayak-enterprises/
├── backend/
│   ├── src/
│   │   ├── controllers/     # API controllers
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth and validation middleware
│   │   └── config/         # Database configuration
│   ├── scripts/            # Database seeding
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/           # Next.js app router pages
│   │   ├── components/    # React components
│   │   ├── lib/          # Utilities and auth
│   │   ├── services/     # API services
│   │   └── utils/        # Helper functions
│   └── package.json
└── start.sh              # Startup script
```

## 🔐 Authentication

The application uses JWT tokens for authentication. Tokens are stored in:
- Zustand persistent store (primary)
- localStorage (fallback)

### Token Flow

1. User logs in via `/api/auth/login`
2. Backend returns JWT token
3. Frontend stores token in Zustand store
4. Axios interceptor automatically attaches token to requests
5. Protected routes check for valid token

## 🛠️ Development

### Adding New Features

1. **Backend API**
   - Add routes in `backend/src/routes/`
   - Add controllers in `backend/src/controllers/`
   - Add models in `backend/src/models/`

2. **Frontend Pages**
   - Add pages in `frontend/src/app/`
   - Add components in `frontend/src/components/`
   - Add services in `frontend/src/services/`

### Database Changes

1. **Update models** in `backend/src/models/`
2. **Update seed data** in `backend/scripts/seed.js`
3. **Run seed script** to update database

## 📝 Environment Variables

### Backend (.env)
```
PORT=5001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/nayak-enterprises
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. 