const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    sku: String,
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1']
    },
    unitPrice: {
      type: Number,
      required: true,
      min: [0, 'Unit price cannot be negative']
    },
    originalPrice: Number,
    image: String,
    minOrderQuantity: {
      type: Number,
      default: 1
    },
    maxOrderQuantity: {
      type: Number,
      default: 100
    },
    inStock: {
      type: Boolean,
      default: true
    }
  }],
  
  // Cart totals
  subtotal: {
    type: Number,
    default: 0,
    min: [0, 'Subtotal cannot be negative']
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative']
  },
  shippingCost: {
    type: Number,
    default: 0,
    min: [0, 'Shipping cost cannot be negative']
  },
  total: {
    type: Number,
    default: 0,
    min: [0, 'Total cannot be negative']
  },
  
  // Cart metadata
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: function() {
      return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
cartSchema.index({ customer: 1 });
cartSchema.index({ expiresAt: 1 });

// Calculate cart totals
cartSchema.methods.calculateTotals = function() {
  this.subtotal = this.items.reduce((sum, item) => {
    return sum + (item.unitPrice * item.quantity);
  }, 0);
  
  this.total = this.subtotal - this.discount + this.shippingCost;
  this.lastUpdated = new Date();
  
  return this.save();
};

// Add item to cart
cartSchema.methods.addItem = function(productData) {
  const existingItemIndex = this.items.findIndex(
    item => item.product.toString() === productData.product.toString()
  );
  
  if (existingItemIndex > -1) {
    // Update existing item quantity
    const newQuantity = this.items[existingItemIndex].quantity + productData.quantity;
    if (newQuantity <= this.items[existingItemIndex].maxOrderQuantity) {
      this.items[existingItemIndex].quantity = newQuantity;
    } else {
      throw new Error('Quantity exceeds maximum order limit');
    }
  } else {
    // Add new item
    this.items.push(productData);
  }
  
  return this.calculateTotals();
};

// Remove item from cart
cartSchema.methods.removeItem = function(productId) {
  this.items = this.items.filter(
    item => item.product.toString() !== productId.toString()
  );
  
  return this.calculateTotals();
};

// Update item quantity
cartSchema.methods.updateItemQuantity = function(productId, quantity) {
  const item = this.items.find(
    item => item.product.toString() === productId.toString()
  );
  
  if (!item) {
    throw new Error('Item not found in cart');
  }
  
  if (quantity < item.minOrderQuantity) {
    throw new Error(`Minimum order quantity is ${item.minOrderQuantity}`);
  }
  
  if (quantity > item.maxOrderQuantity) {
    throw new Error(`Maximum order quantity is ${item.maxOrderQuantity}`);
  }
  
  item.quantity = quantity;
  return this.calculateTotals();
};

// Clear cart
cartSchema.methods.clearCart = function() {
  this.items = [];
  this.subtotal = 0;
  this.discount = 0;
  this.shippingCost = 0;
  this.total = 0;
  this.lastUpdated = new Date();
  
  return this.save();
};

// Check if cart is empty
cartSchema.methods.isEmpty = function() {
  return this.items.length === 0;
};

// Get cart summary
cartSchema.methods.getSummary = function() {
  return {
    itemCount: this.items.length,
    totalItems: this.items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: this.subtotal,
    discount: this.discount,
    shippingCost: this.shippingCost,
    total: this.total,
    savings: this.items.reduce((sum, item) => {
      if (item.originalPrice && item.originalPrice > item.unitPrice) {
        return sum + ((item.originalPrice - item.unitPrice) * item.quantity);
      }
      return sum;
    }, 0)
  };
};

// Virtual for cart status
cartSchema.virtual('status').get(function() {
  if (this.isEmpty()) return 'empty';
  if (this.items.some(item => !item.inStock)) return 'has-out-of-stock';
  return 'ready';
});

// JSON serialization
cartSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Cart', cartSchema); 