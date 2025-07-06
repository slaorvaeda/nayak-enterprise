const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Business Information
  businessName: {
    type: String,
    required: [true, 'Business name is required'],
    trim: true,
    maxlength: [100, 'Business name cannot exceed 100 characters']
  },
  businessType: {
    type: String,
    required: [true, 'Business type is required'],
    enum: ['retail-store', 'supermarket', 'grocery-store', 'convenience-store', 'other']
  },
  gstNumber: {
    type: String,
    trim: true,
    maxlength: [15, 'GST number cannot exceed 15 characters']
  },
  businessDescription: {
    type: String,
    maxlength: [500, 'Business description cannot exceed 500 characters']
  },

  // Owner Information
  ownerName: {
    type: String,
    required: [true, 'Owner name is required'],
    trim: true,
    maxlength: [100, 'Owner name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    trim: true,
    match: [/^[0-9]{10,11}$/, 'Please enter a valid 10 or 11-digit phone number']
  },
  image: {
    type: String,
    default: 'https://example.com/default-profile.png', // Placeholder URL
  },

  // Address Information
  address: {
    street: {
      type: String,
      required: [true, 'Street address is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    },
    pincode: {
      type: String,
      required: [true, 'PIN code is required'],
      trim: true,
      match: [/^[0-9]{6}$/, 'Please enter a valid 6-digit PIN code']
    }
  },

  // Authentication
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false
  },

  // Account Status
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer'
  },

  // Business Verification
  verificationDocuments: [{
    type: {
      type: String,
      enum: ['gst-certificate', 'business-license', 'pan-card', 'aadhar-card', 'other']
    },
    documentUrl: {
      type: String,
      required: true,
      match: [/^https?:\/\/.+/, 'Please provide a valid document URL']
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    isVerified: {
      type: Boolean,
      default: false
    }
  }],

  // Account Statistics
  totalOrders: {
    type: Number,
    default: 0
  },
  totalSpent: {
    type: Number,
    default: 0
  },
  lastOrderDate: Date

}, {
  timestamps: true
});

// // Indexes for performance
// userSchema.index({ email: 1 });
// userSchema.index({ businessName: 1 });
// userSchema.index({ 'address.city': 1, 'address.state': 1});

// // Plugins
// userSchema.plugin(uniqueValidator, { message: '{PATH} must be unique.' });

// Pre-save hook to hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Password comparison method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Virtuals
userSchema.virtual('formattedPhone').get(function () {
  return this.phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
});

userSchema.virtual('businessStatus').get(function () {
  if (this.isActive && this.isVerified) return 'active';
  if (!this.isActive) return 'suspended';
  if (!this.isVerified) return 'pending';
  return 'unknown';
});

// Utility method
userSchema.methods.getFullAddress = function () {
  return `${this.address.street}, ${this.address.city}, ${this.address.state} - ${this.address.pincode}`;
};

// Hide sensitive fields
userSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('User', userSchema);
