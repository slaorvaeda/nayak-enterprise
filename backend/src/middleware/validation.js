const { validationResult, body } = require('express-validator');

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  
  next();
};

// Common validation rules
const commonValidations = {
  email: body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  password: body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  
  phone: body('phone')
    .matches(/^[0-9]{10,11}$/)
    .withMessage('Please provide a valid 10 or 11-digit phone number'),
  
  pincode: body('pincode')
    .matches(/^[0-9]{6}$/)
    .withMessage('Please provide a valid 6-digit PIN code'),
  
  businessName: body('businessName')
    .isLength({ min: 2, max: 100 })
    .withMessage('Business name must be between 2 and 100 characters')
    .trim(),
  
  ownerName: body('ownerName')
    .isLength({ min: 2, max: 100 })
    .withMessage('Owner name must be between 2 and 100 characters')
    .trim(),
  
  address: body('address')
    .isLength({ min: 10, max: 500 })
    .withMessage('Address must be between 10 and 500 characters')
    .trim(),
  
  city: body('city')
    .isLength({ min: 2, max: 50 })
    .withMessage('City name must be between 2 and 50 characters')
    .trim(),
  
  state: body('state')
    .isLength({ min: 2, max: 50 })
    .withMessage('State name must be between 2 and 50 characters')
    .trim(),
  
  gstNumber: body('gstNumber')
    .optional()
    .isLength({ max: 15 })
    .withMessage('GST number cannot exceed 15 characters')
    .trim(),
  
  businessType: body('businessType')
    .isIn(['retail-store', 'supermarket', 'grocery-store', 'convenience-store', 'other'])
    .withMessage('Please select a valid business type'),
  
  businessDescription: body('businessDescription')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Business description cannot exceed 500 characters')
    .trim(),
  
  productName: body('productName')
    .isLength({ min: 2, max: 200 })
    .withMessage('Product name must be between 2 and 200 characters')
    .trim(),
  
  productDescription: body('productDescription')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Product description must be between 10 and 1000 characters')
    .trim(),
  
  price: body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  quantity: body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer'),
  
  category: body('category')
    .isIn(['Food & Grains', 'Household', 'Beverages', 'Snacks', 'Personal Care', 'Electronics', 'Clothing', 'Other'])
    .withMessage('Please select a valid category'),
  
  sku: body('sku')
    .isLength({ min: 3, max: 50 })
    .withMessage('SKU must be between 3 and 50 characters')
    .trim(),
  
  orderStatus: body('orderStatus')
    .isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'])
    .withMessage('Please provide a valid order status'),
  
  paymentStatus: body('paymentStatus')
    .isIn(['pending', 'paid', 'failed', 'refunded'])
    .withMessage('Please provide a valid payment status'),
  
  paymentMethod: body('paymentMethod')
    .isIn(['cod', 'online', 'bank-transfer'])
    .withMessage('Please select a valid payment method')
};

// Validation for user registration
const registerValidation = [
  commonValidations.businessName,
  commonValidations.businessType,
  commonValidations.ownerName,
  commonValidations.email,
  commonValidations.phone,
  commonValidations.address,
  commonValidations.city,
  commonValidations.state,
  commonValidations.pincode,
  commonValidations.gstNumber,
  commonValidations.businessDescription,
  commonValidations.password,
  handleValidationErrors
];

// Validation for user login
const loginValidation = [
  commonValidations.email,
  commonValidations.password,
  handleValidationErrors
];

// Validation for product creation
const productValidation = [
  commonValidations.productName,
  commonValidations.productDescription,
  commonValidations.price,
  commonValidations.category,
  commonValidations.sku,
  handleValidationErrors
];

// Validation for order creation
const orderValidation = [
  commonValidations.paymentMethod,
  handleValidationErrors
];

// Validation for cart operations
const cartValidation = [
  body('items')
    .custom((value) => {
      if (!value || !Array.isArray(value)) {
        throw new Error('Items must be an array');
      }
      return true;
    }),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  commonValidations,
  registerValidation,
  loginValidation,
  productValidation,
  orderValidation,
  cartValidation
}; 