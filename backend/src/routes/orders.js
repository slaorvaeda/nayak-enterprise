const express = require('express');
const router = express.Router();
const Order = require('../models/Order.model');
const Cart = require('../models/Cart.model');
const Product = require('../models/Product.model');
const User = require('../models/User.model');
const { protect, verified } = require('../middleware/auth');
const { orderValidation } = require('../middleware/validation');

// @desc    Create new order from cart
// @route   POST /api/orders
// @access  Private
router.post('/', protect, orderValidation, async (req, res) => {
  try {
    const {
      paymentMethod,
      shippingAddress,
      customerNotes
    } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ customer: req.user._id })
      .populate('items.product');

    if (!cart || cart.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Validate cart items
    const orderItems = [];
    let subtotal = 0;

    for (const cartItem of cart.items) {
      const product = cartItem.product;
      
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product not found for item: ${cartItem.name}`
        });
      }

      if (!product.isActive) {
        return res.status(400).json({
          success: false,
          message: `Product ${product.name} is not available`
        });
      }

      if (product.stockQuantity < cartItem.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stockQuantity}`
        });
      }

      if (cartItem.quantity < product.minOrderQuantity) {
        return res.status(400).json({
          success: false,
          message: `Minimum order quantity for ${product.name} is ${product.minOrderQuantity}`
        });
      }

      if (cartItem.quantity > product.maxOrderQuantity) {
        return res.status(400).json({
          success: false,
          message: `Maximum order quantity for ${product.name} is ${product.maxOrderQuantity}`
        });
      }

      const itemTotal = cartItem.unitPrice * cartItem.quantity;
      const discount = cartItem.originalPrice ? (cartItem.originalPrice - cartItem.unitPrice) * cartItem.quantity : 0;

      orderItems.push({
        product: product._id,
        name: product.name,
        sku: product.sku,
        quantity: cartItem.quantity,
        unitPrice: cartItem.unitPrice,
        totalPrice: itemTotal,
        originalPrice: cartItem.originalPrice,
        discount
      });

      subtotal += itemTotal;
    }

    // Calculate shipping cost
    const shippingCost = subtotal >= 10000 ? 0 : 500;

    // Calculate tax (GST - 18%)
    const tax = subtotal * 0.18;

    // Calculate total
    const total = subtotal - cart.discount + shippingCost + tax;

    // Create order
    const order = new Order({
      customer: req.user._id,
      items: orderItems,
      subtotal,
      discount: cart.discount,
      shippingCost,
      tax,
      total,
      paymentMethod,
      shippingAddress,
      customerNotes
    });
    await order.save();

    // Update product stock (robust, prevent negative stock, use transaction)
    const session = await Product.startSession();
    session.startTransaction();
    try {
      for (const item of orderItems) {
        const product = await Product.findById(item.product).session(session);
        if (!product) throw new Error(`Product not found: ${item.product}`);
        if (product.stockQuantity < item.quantity) {
          throw new Error(`Insufficient stock for product: ${product.name}`);
        }
        product.stockQuantity -= item.quantity;
        await product.save({ session });
      }
      await session.commitTransaction();
      session.endSession();
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }

    // Update user statistics
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { totalOrders: 1, totalSpent: total },
      lastOrderDate: new Date()
    });

    // Clear cart
    await cart.clearCart();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: {
        order
      }
    });
  } catch (error) {
    console.error('Create order error:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      details: error.message
    });
  }
});

// @desc    Get user's orders
// @route   GET /api/orders
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const filter = { customer: req.user._id };
    if (status && status !== 'All') {
      filter.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const orders = await Order.find(filter)
      .populate('items.product', 'name sku images')
      .sort({ orderDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalOrders: total,
          hasNextPage: skip + orders.length < total,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      customer: req.user._id
    }).populate('items.product', 'name sku images description');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: {
        order
      }
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order'
    });
  }
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      customer: req.user._id
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.status !== 'pending' && order.status !== 'confirmed') {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage'
      });
    }

    // Update order status
    order.status = 'cancelled';
    await order.save();

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stockQuantity: item.quantity }
      });
    }

    // Update user statistics
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { totalOrders: -1, totalSpent: -order.total }
    });

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: {
        order
      }
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order'
    });
  }
});

// @desc    Get order tracking
// @route   GET /api/orders/:id/tracking
// @access  Private
router.get('/:id/tracking', protect, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      customer: req.user._id
    }).select('orderNumber status trackingNumber carrier estimatedDelivery actualDelivery orderDate statusUpdatedAt');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Mock tracking events (replace with actual tracking logic)
    const trackingEvents = [
      {
        status: 'pending',
        title: 'Order Placed',
        description: 'Your order has been placed successfully',
        timestamp: order.orderDate,
        completed: true
      },
      {
        status: 'confirmed',
        title: 'Order Confirmed',
        description: 'Your order has been confirmed and is being processed',
        timestamp: order.status === 'confirmed' ? order.statusUpdatedAt : null,
        completed: ['confirmed', 'processing', 'shipped', 'delivered'].includes(order.status)
      },
      {
        status: 'processing',
        title: 'Processing',
        description: 'Your order is being prepared for shipment',
        timestamp: order.status === 'processing' ? order.statusUpdatedAt : null,
        completed: ['processing', 'shipped', 'delivered'].includes(order.status)
      },
      {
        status: 'shipped',
        title: 'Shipped',
        description: order.trackingNumber ? `Your order has been shipped. Tracking: ${order.trackingNumber}` : 'Your order has been shipped',
        timestamp: order.status === 'shipped' ? order.statusUpdatedAt : null,
        completed: ['shipped', 'delivered'].includes(order.status)
      },
      {
        status: 'delivered',
        title: 'Delivered',
        description: 'Your order has been delivered successfully',
        timestamp: order.status === 'delivered' ? order.actualDelivery : null,
        completed: order.status === 'delivered'
      }
    ];

    res.json({
      success: true,
      data: {
        order: {
          orderNumber: order.orderNumber,
          status: order.status,
          trackingNumber: order.trackingNumber,
          carrier: order.carrier,
          estimatedDelivery: order.estimatedDelivery,
          actualDelivery: order.actualDelivery
        },
        trackingEvents
      }
    });
  } catch (error) {
    console.error('Get tracking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get tracking information'
    });
  }
});

// @desc    Get order statistics
// @route   GET /api/orders/stats
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const stats = await Order.aggregate([
      { $match: { customer: req.user._id } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$total' },
          averageOrderValue: { $avg: '$total' }
        }
      }
    ]);

    const statusCounts = await Order.aggregate([
      { $match: { customer: req.user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const recentOrders = await Order.find({ customer: req.user._id })
      .sort({ orderDate: -1 })
      .limit(5)
      .select('orderNumber status total orderDate');

    res.json({
      success: true,
      data: {
        stats: stats[0] || { totalOrders: 0, totalSpent: 0, averageOrderValue: 0 },
        statusCounts,
        recentOrders
      }
    });
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get order statistics'
    });
  }
});

module.exports = router; 