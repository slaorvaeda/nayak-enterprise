# Nayak Enterprises Backend API

A comprehensive Node.js/Express backend for the Nayak Enterprises B2B wholesale platform.

## Features

- **User Authentication & Authorization**: JWT-based authentication with role-based access control
- **Business Registration**: Complete business profile management with verification system
- **Product Management**: Full CRUD operations for products with inventory tracking
- **Shopping Cart**: Persistent cart functionality with real-time stock validation
- **Order Management**: Complete order lifecycle with status tracking
- **Admin Dashboard**: Comprehensive analytics and management tools
- **API Security**: Rate limiting, input validation, and security headers

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs, helmet, cors
- **Validation**: express-validator
- **File Upload**: multer

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nayak-enterprises/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/nayak-enterprises
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d
   ```

4. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new business
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout user

### Products
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/featured` - Get featured products
- `GET /api/products/bestsellers` - Get best sellers
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/categories` - Get product categories
- `GET /api/products/search` - Search products
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:productId` - Update cart item quantity
- `DELETE /api/cart/remove/:productId` - Remove item from cart
- `DELETE /api/cart/clear` - Clear cart
- `GET /api/cart/summary` - Get cart summary
- `POST /api/cart/promo` - Apply promo code

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/cancel` - Cancel order
- `GET /api/orders/:id/tracking` - Get order tracking
- `GET /api/orders/stats` - Get order statistics

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/dashboard` - Get user dashboard data
- `POST /api/users/verification` - Upload verification documents
- `GET /api/users/verification` - Get verification status

### Admin
- `GET /api/admin/dashboard` - Get admin dashboard
- `GET /api/admin/analytics` - Get analytics data
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id/status` - Update order status
- `GET /api/admin/stats` - Get system statistics

## Database Models

### User
- Business information (name, type, GST number)
- Owner details (name, email, phone)
- Address information
- Verification status and documents
- Account statistics

### Product
- Product details (name, description, SKU)
- Pricing (price, original price, wholesale price)
- Inventory (stock quantity, min/max order quantities)
- Categories and tags
- Images and specifications

### Order
- Order information and customer details
- Order items with pricing
- Shipping and payment information
- Status tracking and timestamps

### Cart
- Customer cart with items
- Real-time stock validation
- Pricing calculations
- Promo code support

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password security
- **Input Validation**: express-validator for request validation
- **Rate Limiting**: API rate limiting to prevent abuse
- **CORS**: Cross-origin resource sharing configuration
- **Helmet**: Security headers for Express
- **Environment Variables**: Secure configuration management

## Error Handling

The API includes comprehensive error handling:
- Validation errors with detailed messages
- Database operation errors
- Authentication and authorization errors
- Custom business logic errors

## Development

### Running in Development
```bash
npm run dev
```

### Running Tests
```bash
npm test
```

### Code Structure
```
backend/
├── models/          # Database models
├── routes/          # API route handlers
├── middleware/      # Custom middleware
├── server.js        # Main server file
├── package.json     # Dependencies
└── README.md        # This file
```

## Production Deployment

1. **Environment Variables**: Set all production environment variables
2. **Database**: Use production MongoDB instance
3. **Security**: Update JWT secret and other security settings
4. **Process Manager**: Use PM2 or similar for process management
5. **Reverse Proxy**: Use Nginx for load balancing and SSL termination

## API Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "fieldName",
      "message": "Validation error message"
    }
  ]
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details 