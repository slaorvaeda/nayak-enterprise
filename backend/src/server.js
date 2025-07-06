const express = require('express');
const dotenv = require('dotenv');
const connectDb = require('./config/db.config');
const cors = require('cors');
const router = require('./routes/auth');
dotenv.config();

const app = express();


// Middleware for CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.com'] 
    : ['http://localhost:3000', 'http://localhost:3003'],
  credentials: true
}));
// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use('/api/auth',router);

connectDb();



app.listen(process.env.PORT || 5001, () => {
  console.log(`Server running on port ${process.env.PORT || 5001}`);
});