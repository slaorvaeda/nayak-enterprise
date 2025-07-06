# Nayak Enterprises B2B Platform Setup Guide

This guide will help you set up the complete Nayak Enterprises B2B wholesale platform with both frontend and backend.

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (v5 or higher)
- Git

## Quick Start

### 1. Clone and Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp env.example .env

# Edit .env file with your MongoDB connection string
# MONGODB_URI=mongodb://localhost:27017/nayak-enterprises

# Seed the database with sample data
npm run seed

# Start the development server
npm run dev
```

The backend will be running on `http://localhost:5000`

### 2. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp env.example .env.local

# Edit .env.local file
# NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Start the development server
npm run dev
```

The frontend will be running on `http://localhost:3000`

## Environment Configuration

### Backend (.env)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/nayak-enterprises

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=uploads

# Email Configuration (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Business Configuration
COMPANY_NAME=Nayak Enterprises
COMPANY_EMAIL=info@nayakenterprises.com
COMPANY_PHONE=+91-9876543210
```

### Frontend (.env.local)

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# App Configuration
NEXT_PUBLIC_APP_NAME=Nayak Enterprises
NEXT_PUBLIC_APP_DESCRIPTION=B2B Wholesale Platform

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
```

## Database Setup

### MongoDB Installation

1. **Install MongoDB Community Edition:**
   - [Download MongoDB](https://www.mongodb.com/try/download/community)
   - Follow installation instructions for your OS

2. **Start MongoDB:**
   ```bash
   # On macOS/Linux
   sudo systemctl start mongod
   
   # On Windows
   net start MongoDB
   ```

3. **Verify MongoDB is running:**
   ```bash
   mongosh
   ```

### Database Seeding

The backend includes a seeding script that creates:

- **Admin User:**
  - Email: `admin@nayakenterprises.com`
  - Password: `admin123`

- **Sample Customer:**
  - Email: `customer@example.com`
  - Password: `customer123`

- **Sample Products:**
  - Various categories (Food & Grains, Household, Beverages, etc.)
  - Realistic pricing and descriptions

Run the seed script:
```bash
cd backend
npm run seed
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new business
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/logout` - Logout

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/featured` - Get featured products
- `GET /api/products/bestsellers` - Get best sellers
- `GET /api/products/categories` - Get categories
- `GET /api/products/search` - Search products

### Cart
- `GET /api/cart` - Get cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:productId` - Update quantity
- `DELETE /api/cart/remove/:productId` - Remove item
- `DELETE /api/cart/clear` - Clear cart
- `POST /api/cart/promo` - Apply promo code

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/cancel` - Cancel order
- `GET /api/orders/:id/tracking` - Get tracking info

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/dashboard` - Get dashboard data
- `POST /api/users/verification` - Upload verification docs

### Admin
- `GET /api/admin/dashboard` - Admin dashboard
- `GET /api/admin/analytics` - Analytics data
- `GET /api/admin/orders` - Manage orders
- `PUT /api/admin/orders/:id/status` - Update order status
- `GET /api/admin/stats` - System statistics

## Features

### Frontend Features
- ✅ Responsive design with Tailwind CSS
- ✅ User authentication and authorization
- ✅ Product catalog with search and filtering
- ✅ Shopping cart functionality
- ✅ Order management
- ✅ User profile and dashboard
- ✅ Admin panel with analytics
- ✅ Business registration
- ✅ Real-time notifications

### Backend Features
- ✅ RESTful API with Express.js
- ✅ MongoDB database with Mongoose ODM
- ✅ JWT-based authentication
- ✅ Role-based access control
- ✅ File upload support
- ✅ Input validation and sanitization
- ✅ Error handling and logging
- ✅ Rate limiting and security headers
- ✅ Business verification system
- ✅ Order tracking and status management
- ✅ Promo code system
- ✅ Analytics and reporting

## Development

### Backend Development

```bash
cd backend

# Start development server with nodemon
npm run dev

# Run tests
npm test

# Lint code
npm run lint
```

### Frontend Development

```bash
cd frontend

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Production Deployment

### Backend Deployment

1. **Environment Variables:**
   - Set `NODE_ENV=production`
   - Use strong JWT secret
   - Configure MongoDB Atlas or production database
   - Set up proper CORS origins

2. **Security:**
   - Enable HTTPS
   - Set up rate limiting
   - Configure helmet security headers
   - Use environment variables for secrets

3. **Monitoring:**
   - Set up logging (Winston/Morgan)
   - Monitor API performance
   - Set up error tracking

### Frontend Deployment

1. **Build:**
   ```bash
   npm run build
   ```

2. **Deploy:**
   - Vercel (recommended for Next.js)
   - Netlify
   - AWS S3 + CloudFront
   - Any static hosting service

3. **Environment:**
   - Set `NEXT_PUBLIC_API_URL` to production API URL
   - Configure domain and SSL

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error:**
   - Ensure MongoDB is running
   - Check connection string in .env
   - Verify network access

2. **CORS Errors:**
   - Check CORS configuration in backend
   - Verify frontend URL in allowed origins

3. **JWT Token Issues:**
   - Check JWT_SECRET in environment
   - Verify token expiration settings

4. **File Upload Errors:**
   - Ensure uploads directory exists
   - Check file size limits
   - Verify file type restrictions

### Support

For issues and questions:
- Check the console for error messages
- Review the API documentation
- Ensure all environment variables are set correctly

## License

This project is licensed under the MIT License. 