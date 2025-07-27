const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const Product = require('../models/Product.model');
const Order = require('../models/Order.model');
const Payment = require('../models/Payment.model');
const { protect, admin } = require('../middleware/auth');
const { adminAuth, adminLogin, userAdmin, getProducts, adminCreateUser, adminUpdateUser } = require('../controllers/authContoller');

// Login admin
router.post('/login', adminLogin);
//Get users by admin panel
router.get('/users', protect, adminAuth, userAdmin);
//Get products by admin panel
router.get('/products', protect, adminAuth, getProducts);
// Admin: Create a new user
router.post('/users', protect, adminAuth, adminCreateUser);
// Admin: Update any user
router.put('/users/:id', protect, adminAuth, adminUpdateUser);
// Get admin dashboard overview
router.get('/dashboard', protect, adminAuth, async (req, res) => {
  try {
    // Get total counts
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Get revenue statistics
    const revenueStats = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$total' },
          averageOrderValue: { $avg: '$total' },
          totalOrders: { $sum: 1 }
        }
      }
    ]);

    // Get recent orders
    const recentOrders = await Order.find()
      .populate('customer', 'businessName ownerName email')
      .sort({ orderDate: -1 })
      .limit(10)
      .select('orderNumber status total orderDate customer');

    // Get pending verifications
    const pendingVerifications = await User.find({ isVerified: false })
      .select('businessName ownerName email createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get low stock products
    const lowStockProducts = await Product.find({
      stockQuantity: { $lte: 10 },
      isActive: true
    })
    .select('name sku stockQuantity')
    .sort({ stockQuantity: 1 })
    .limit(10);

    // Get monthly revenue for the last 12 months
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          orderDate: { $gte: twelveMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$orderDate' },
            month: { $month: '$orderDate' }
          },
          revenue: { $sum: '$total' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Get top selling products
    const topSellingProducts = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: '$items.totalPrice' }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          name: '$product.name',
          sku: '$product.sku',
          totalQuantity: 1,
          totalRevenue: 1
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalProducts,
          totalOrders,
          totalRevenue: revenueStats[0]?.totalRevenue || 0,
          averageOrderValue: revenueStats[0]?.averageOrderValue || 0
        },
        recentOrders,
        pendingVerifications,
        lowStockProducts,
        monthlyRevenue,
        topSellingProducts
      }
    });
  } catch (error) {
    console.error('Get admin dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard data'
    });
  }
});
// Get admin analytics
router.get('/analytics', protect, admin, async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(period));

    // Revenue analytics
    const revenueAnalytics = await Order.aggregate([
      {
        $match: {
          orderDate: { $gte: daysAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$orderDate' },
            month: { $month: '$orderDate' },
            day: { $dayOfMonth: '$orderDate' }
          },
          revenue: { $sum: '$total' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // User registration analytics
    const userAnalytics = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: daysAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          registrations: { $sum: 1 },
          verified: {
            $sum: { $cond: ['$isVerified', 1, 0] }
          }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Order status distribution
    const orderStatusDistribution = await Order.aggregate([
      {
        $match: {
          orderDate: { $gte: daysAgo }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          revenue: { $sum: '$total' }
        }
      }
    ]);

    // Product category performance
    const categoryPerformance = await Order.aggregate([
      {
        $match: {
          orderDate: { $gte: daysAgo }
        }
      },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $group: {
          _id: '$product.category',
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: '$items.totalPrice' },
          orders: { $addToSet: '$_id' }
        }
      },
      {
        $project: {
          category: '$_id',
          totalQuantity: 1,
          totalRevenue: 1,
          orderCount: { $size: '$orders' }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        revenueAnalytics,
        userAnalytics,
        orderStatusDistribution,
        categoryPerformance
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get analytics'
    });
  }
});

// Get all orders (Admin)
router.get('/orders', protect, admin, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      paymentStatus,
      search,
      startDate,
      endDate
    } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (paymentStatus) {
      filter.paymentStatus = paymentStatus;
    }

    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'customer.businessName': { $regex: search, $options: 'i' } }
      ];
    }

    if (startDate || endDate) {
      filter.orderDate = {};
      if (startDate) filter.orderDate.$gte = new Date(startDate);
      if (endDate) filter.orderDate.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const orders = await Order.find(filter)
      .populate('customer', 'businessName ownerName email phone')
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
    console.error('Get admin orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
});

// Update order status (Admin)
router.put('/orders/:id/status', protect, admin, async (req, res) => {
  try {
    const { status, trackingNumber, carrier, estimatedDelivery, adminNotes } = req.body;

    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update order
    order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (carrier) order.carrier = carrier;
    if (estimatedDelivery) order.estimatedDelivery = new Date(estimatedDelivery);
    if (adminNotes) order.adminNotes = adminNotes;

    // Set actual delivery date if status is delivered
    if (status === 'delivered') {
      order.actualDelivery = new Date();
    }

    await order.save();

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: {
        order
      }
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status'
    });
  }
});

// Get all customers (Admin)
router.get('/customers', protect, admin, async (req, res) => {
  try {
    const customers = await User.find({ role: 'customer' }).select('businessName email phone isVerified createdAt');
    res.json({
      success: true,
      data: { customers }
    });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customers'
    });
  }
});

// Get all orders for a customer (Admin)
router.get('/customers/:id/orders', protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.params.id }).sort({ orderDate: -1 });
    res.json({ success: true, data: { orders } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
});

// Get all payments for a customer (Admin)
router.get('/customers/:id/payments', protect, admin, async (req, res) => {
  try {
    const payments = await Payment.find({ customer: req.params.id }).sort({ date: -1 });
    res.json({ success: true, data: { payments } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch payments' });
  }
});

// Add a payment for a customer (Admin)
router.post('/customers/:id/payments', protect, admin, async (req, res) => {
  try {
    const { amount, method, status, notes, type } = req.body;
    const payment = await Payment.create({
      customer: req.params.id,
      amount,
      method,
      status: status || 'completed',
      notes,
      type: type || 'debit'
    });
    res.json({ success: true, data: { payment } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add payment' });
  }
});

// Edit a payment/credit
router.put('/customers/:customerId/payments/:paymentId', protect, admin, async (req, res) => {
  try {
    const { amount, method, status, notes, type } = req.body;
    const payment = await Payment.findOneAndUpdate(
      { _id: req.params.paymentId, customer: req.params.customerId },
      { amount, method, status, notes, type },
      { new: true }
    );
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
    res.json({ success: true, data: { payment } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update payment' });
  }
});

// Delete a payment/credit
router.delete('/customers/:customerId/payments/:paymentId', protect, admin, async (req, res) => {
  try {
    const payment = await Payment.findOneAndDelete({
      _id: req.params.paymentId,
      customer: req.params.customerId
    });
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
    res.json({ success: true, message: 'Payment deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete payment' });
  }
});

// Get system statistics
router.get('/stats', protect, admin, async (req, res) => {
  try {
    // Today's stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayStats = await Order.aggregate([
      {
        $match: {
          orderDate: { $gte: today, $lt: tomorrow }
        }
      },
      {
        $group: {
          _id: null,
          orders: { $sum: 1 },
          revenue: { $sum: '$total' }
        }
      }
    ]);

    // This month's stats
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    const monthStats = await Order.aggregate([
      {
        $match: {
          orderDate: { $gte: thisMonth }
        }
      },
      {
        $group: {
          _id: null,
          orders: { $sum: 1 },
          revenue: { $sum: '$total' }
        }
      }
    ]);

    // User stats
    const userStats = await User.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          verified: { $sum: { $cond: ['$isVerified', 1, 0] } },
          active: { $sum: { $cond: ['$isActive', 1, 0] } }
        }
      }
    ]);

    // Product stats
    const productStats = await Product.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: { $sum: { $cond: ['$isActive', 1, 0] } },
          outOfStock: { $sum: { $cond: [{ $eq: ['$stockQuantity', 0] }, 1, 0] } },
          lowStock: { $sum: { $cond: [{ $and: [{ $gt: ['$stockQuantity', 0] }, { $lte: ['$stockQuantity', 10] }] }, 1, 0] } }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        today: todayStats[0] || { orders: 0, revenue: 0 },
        month: monthStats[0] || { orders: 0, revenue: 0 },
        users: userStats[0] || { total: 0, verified: 0, active: 0 },
        products: productStats[0] || { total: 0, active: 0, outOfStock: 0, lowStock: 0 }
      }
    });
  } catch (error) {
    console.error('Get system stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get system statistics'
    });
  }
});

module.exports = router; 