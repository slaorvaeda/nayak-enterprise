const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ customer: req.user._id })
      .populate('items.product', 'name sku price originalPrice images stockQuantity minOrderQuantity maxOrderQuantity isActive');

    if (!cart) {
      cart = await Cart.create({ customer: req.user._id });
    }

    // Update item availability based on current stock
    cart.items = cart.items.map(item => {
      const product = item.product;
      if (product) {
        item.inStock = product.isActive && product.stockQuantity > 0;
        item.maxOrderQuantity = Math.min(item.maxOrderQuantity, product.stockQuantity);
      }
      return item;
    });

    await cart.save();

    res.json({
      success: true,
      data: {
        cart
      }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cart'
    });
  }
});

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
router.post('/add', protect, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    // Get product details
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (!product.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Product is not available'
      });
    }

    if (product.stockQuantity < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stockQuantity} units available in stock`
      });
    }

    if (quantity < product.minOrderQuantity) {
      return res.status(400).json({
        success: false,
        message: `Minimum order quantity is ${product.minOrderQuantity}`
      });
    }

    if (quantity > product.maxOrderQuantity) {
      return res.status(400).json({
        success: false,
        message: `Maximum order quantity is ${product.maxOrderQuantity}`
      });
    }

    // Get or create cart
    let cart = await Cart.findOne({ customer: req.user._id });
    if (!cart) {
      cart = await Cart.create({ customer: req.user._id });
    }

    // Prepare item data
    const itemData = {
      product: productId,
      name: product.name,
      sku: product.sku,
      quantity: quantity,
      unitPrice: product.price,
      originalPrice: product.originalPrice,
      image: product.primaryImage,
      minOrderQuantity: product.minOrderQuantity,
      maxOrderQuantity: Math.min(product.maxOrderQuantity, product.stockQuantity),
      inStock: product.stockQuantity > 0
    };

    // Add item to cart
    await cart.addItem(itemData);

    res.json({
      success: true,
      message: 'Item added to cart successfully',
      data: {
        cart
      }
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to add item to cart'
    });
  }
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/update/:productId
// @access  Private
router.put('/update/:productId', protect, async (req, res) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Valid quantity is required'
      });
    }

    // Get cart
    const cart = await Cart.findOne({ customer: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Check if item exists in cart
    const cartItem = cart.items.find(item => item.product.toString() === productId);
    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    // Get product for validation
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (quantity < product.minOrderQuantity) {
      return res.status(400).json({
        success: false,
        message: `Minimum order quantity is ${product.minOrderQuantity}`
      });
    }

    const maxAllowed = Math.min(product.maxOrderQuantity, product.stockQuantity);
    if (quantity > maxAllowed) {
      return res.status(400).json({
        success: false,
        message: `Maximum order quantity is ${maxAllowed}`
      });
    }

    // Update quantity
    await cart.updateItemQuantity(productId, quantity);

    res.json({
      success: true,
      message: 'Cart updated successfully',
      data: {
        cart
      }
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update cart'
    });
  }
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:productId
// @access  Private
router.delete('/remove/:productId', protect, async (req, res) => {
  try {
    const { productId } = req.params;

    // Get cart
    const cart = await Cart.findOne({ customer: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Remove item
    await cart.removeItem(productId);

    res.json({
      success: true,
      message: 'Item removed from cart successfully',
      data: {
        cart
      }
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove item from cart'
    });
  }
});

// @desc    Clear cart
// @route   DELETE /api/cart/clear
// @access  Private
router.delete('/clear', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ customer: req.user._id });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    await cart.clearCart();

    res.json({
      success: true,
      message: 'Cart cleared successfully',
      data: {
        cart
      }
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear cart'
    });
  }
});

// @desc    Get cart summary
// @route   GET /api/cart/summary
// @access  Private
router.get('/summary', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ customer: req.user._id });
    
    if (!cart || cart.isEmpty()) {
      return res.json({
        success: true,
        data: {
          summary: {
            itemCount: 0,
            totalItems: 0,
            subtotal: 0,
            discount: 0,
            shippingCost: 0,
            total: 0,
            savings: 0
          }
        }
      });
    }

    const summary = cart.getSummary();

    res.json({
      success: true,
      data: {
        summary
      }
    });
  } catch (error) {
    console.error('Get cart summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get cart summary'
    });
  }
});

// @desc    Apply promo code
// @route   POST /api/cart/promo
// @access  Private
router.post('/promo', protect, async (req, res) => {
  try {
    const { promoCode } = req.body;

    if (!promoCode) {
      return res.status(400).json({
        success: false,
        message: 'Promo code is required'
      });
    }

    const cart = await Cart.findOne({ customer: req.user._id });
    if (!cart || cart.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Mock promo code logic (replace with actual implementation)
    let discount = 0;
    let message = '';

    if (promoCode.toUpperCase() === 'WELCOME10') {
      discount = Math.min(cart.subtotal * 0.1, 1000); // 10% off, max ₹1000
      message = 'Welcome discount applied!';
    } else if (promoCode.toUpperCase() === 'BULK20') {
      if (cart.subtotal >= 5000) {
        discount = Math.min(cart.subtotal * 0.2, 2000); // 20% off for orders above ₹5000, max ₹2000
        message = 'Bulk order discount applied!';
      } else {
        return res.status(400).json({
          success: false,
          message: 'Minimum order value of ₹5000 required for this promo code'
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid promo code'
      });
    }

    cart.discount = discount;
    await cart.calculateTotals();

    res.json({
      success: true,
      message,
      data: {
        cart,
        discount,
        promoCode
      }
    });
  } catch (error) {
    console.error('Apply promo code error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to apply promo code'
    });
  }
});

module.exports = router; 