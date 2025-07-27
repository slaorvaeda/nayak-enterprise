const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [1000, 'Product description cannot exceed 1000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [200, 'Short description cannot exceed 200 characters']
  },
  
  // Category and Brand
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: ['Food & Grains', 'Household', 'Beverages', 'Snacks', 'Personal Care', 'Electronics', 'Clothing', 'Other']
  },
  brand: {
    type: String,
    trim: true,
    maxlength: [100, 'Brand name cannot exceed 100 characters']
  },
  
  // Pricing
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  wholesalePrice: {
    type: Number,
    min: [0, 'Wholesale price cannot be negative']
  },
  
  // Inventory
  stockQuantity: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock quantity cannot be negative'],
    default: 0
  },
  minOrderQuantity: {
    type: Number,
    required: [true, 'Minimum order quantity is required'],
    min: [1, 'Minimum order quantity must be at least 1'],
    default: 1
  },
  maxOrderQuantity: {
    type: Number,
    required: [true, 'Maximum order quantity is required'],
    min: [1, 'Maximum order quantity must be at least 1']
  },
  
  // Product Details
  sku: {
    type: String,
    unique: true,
    required: [true, 'SKU is required'],
    trim: true
  },
  barcode: {
    type: String,
    trim: true
  },
  weight: {
    value: {
      type: Number,
      min: [0, 'Weight cannot be negative']
    },
    unit: {
      type: String,
      enum: ['kg', 'g', 'l', 'ml', 'pcs'],
      default: 'kg'
    }
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: {
      type: String,
      enum: ['cm', 'inch'],
      default: 'cm'
    }
  },
  
  // Images
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  
  // Product Status
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isBestSeller: {
    type: Boolean,
    default: false
  },
  
  // Ratings and Reviews
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  
  // Product Specifications
  specifications: [{
    name: String,
    value: String
  }],
  
  // Tags for search
  tags: [{
    type: String,
    trim: true
  }],
  
  // Shipping and Delivery
  shippingWeight: {
    type: Number,
    min: [0, 'Shipping weight cannot be negative']
  },
  isFreeShipping: {
    type: Boolean,
    default: false
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ price: 1 });
productSchema.index({ sku: 1 });

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

// Virtual for stock status
productSchema.virtual('stockStatus').get(function() {
  if (this.stockQuantity === 0) return 'out-of-stock';
  if (this.stockQuantity <= 10) return 'low-stock';
  return 'in-stock';
});

// Virtual for primary image
productSchema.virtual('primaryImage').get(function() {
  const images = Array.isArray(this.images) ? this.images : [];
  const primary = images.find(img => img.isPrimary);
  return primary ? primary.url : (images.length > 0 ? images[0].url : null);
});

// Method to update stock
productSchema.methods.updateStock = function(quantity, operation = 'decrease') {
  if (operation === 'decrease') {
    this.stockQuantity = Math.max(0, this.stockQuantity - quantity);
  } else {
    this.stockQuantity += quantity;
  }
  return this.save();
};

// Method to check if product is available for order
productSchema.methods.isAvailableForOrder = function(requestedQuantity) {
  return this.isActive && 
         this.stockQuantity >= requestedQuantity && 
         requestedQuantity >= this.minOrderQuantity && 
         requestedQuantity <= this.maxOrderQuantity;
};

// Static method to get featured products
productSchema.statics.getFeaturedProducts = function(limit = 10) {
  return this.find({ isActive: true, isFeatured: true })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to get best sellers
productSchema.statics.getBestSellers = function(limit = 10) {
  return this.find({ isActive: true, isBestSeller: true })
    .sort({ 'rating.average': -1 })
    .limit(limit);
};

// JSON serialization
productSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Product', productSchema); 