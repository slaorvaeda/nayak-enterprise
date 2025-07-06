const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // Order Information
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Order Items
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
    totalPrice: {
      type: Number,
      required: true,
      min: [0, 'Total price cannot be negative']
    },
    originalPrice: Number,
    discount: {
      type: Number,
      default: 0
    }
  }],
  
  // Pricing
  subtotal: {
    type: Number,
    required: true,
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
  tax: {
    type: Number,
    default: 0,
    min: [0, 'Tax cannot be negative']
  },
  total: {
    type: Number,
    required: true,
    min: [0, 'Total cannot be negative']
  },
  
  // Shipping Information
  shippingAddress: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    },
    phone: String,
    instructions: String
  },
  
  // Order Status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'pending'
  },
  
  // Payment Information
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cod', 'online', 'bank-transfer'],
    required: true
  },
  paymentId: String,
  paymentDate: Date,
  
  // Shipping and Delivery
  trackingNumber: String,
  carrier: String,
  estimatedDelivery: Date,
  actualDelivery: Date,
  shippingNotes: String,
  
  // Order Notes
  customerNotes: String,
  adminNotes: String,
  
  // Timestamps
  orderDate: {
    type: Date,
    default: Date.now
  },
  statusUpdatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ customer: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ orderDate: -1 });
orderSchema.index({ 'items.product': 1 });

// Generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderNumber) {
    const year = new Date().getFullYear();
    const count = await this.constructor.countDocuments({
      orderDate: {
        $gte: new Date(year, 0, 1),
        $lt: new Date(year + 1, 0, 1)
      }
    });
    this.orderNumber = `ORD-${year}-${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

// Virtual for order summary
orderSchema.virtual('orderSummary').get(function() {
  return {
    totalItems: this.items.reduce((sum, item) => sum + item.quantity, 0),
    totalProducts: this.items.length,
    savings: this.items.reduce((sum, item) => sum + (item.discount || 0), 0)
  };
});

// Virtual for formatted order date
orderSchema.virtual('formattedOrderDate').get(function() {
  return this.orderDate.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Virtual for order status color
orderSchema.virtual('statusColor').get(function() {
  const colors = {
    pending: 'yellow',
    confirmed: 'blue',
    processing: 'orange',
    shipped: 'purple',
    delivered: 'green',
    cancelled: 'red',
    returned: 'gray'
  };
  return colors[this.status] || 'gray';
});

// Method to update order status
orderSchema.methods.updateStatus = function(newStatus, notes = '') {
  this.status = newStatus;
  this.statusUpdatedAt = new Date();
  if (notes) {
    this.adminNotes = this.adminNotes ? `${this.adminNotes}\n${notes}` : notes;
  }
  return this.save();
};

// Method to calculate totals
orderSchema.methods.calculateTotals = function() {
  this.subtotal = this.items.reduce((sum, item) => sum + item.totalPrice, 0);
  this.total = this.subtotal - this.discount + this.shippingCost + this.tax;
  return this.save();
};

// Static method to get orders by status
orderSchema.statics.getOrdersByStatus = function(status, limit = 10) {
  return this.find({ status })
    .populate('customer', 'businessName ownerName email')
    .populate('items.product', 'name sku images')
    .sort({ orderDate: -1 })
    .limit(limit);
};

// Static method to get customer orders
orderSchema.statics.getCustomerOrders = function(customerId, limit = 20) {
  return this.find({ customer: customerId })
    .populate('items.product', 'name sku images')
    .sort({ orderDate: -1 })
    .limit(limit);
};

// JSON serialization
orderSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Order', orderSchema); 