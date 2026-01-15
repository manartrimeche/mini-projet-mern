const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Review = require('../models/Review');

// Obtenir les statistiques globales
exports.getGlobalStats = async (req, res) => {
  try {
    // Compter les utilisateurs
    const totalUsers = await User.countDocuments();

    // Compter les commandes et calculer le revenu total
    const orders = await Order.find().populate('items');
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

    // Compter les produits
    const totalProducts = await Product.countDocuments();

    // Obtenir les produits les plus vendus via OrderItem
    const OrderItem = require('../models/OrderItem');
    const bestSellers = await OrderItem.aggregate([
      { $group: {
          _id: '$product',
          totalQuantity: { $sum: '$quantity' },
          totalRevenue: { $sum: { $multiply: ['$price', '$quantity'] } }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 }
    ]);

    // Obtenir la note moyenne des produits
    const avgRating = await Review.aggregate([
      { $group: {
          _id: null,
          averageRating: { $avg: '$rating' }
        }
      }
    ]);

    // Taux de conversion (basé sur les utilisateurs avec au moins une commande)
    const usersWithOrders = await Order.distinct('user');
    const conversionRate = totalUsers > 0 ? ((usersWithOrders.length / totalUsers) * 100).toFixed(2) : 0;

    res.json({
      totalUsers,
      totalOrders,
      totalRevenue: totalRevenue.toFixed(2),
      totalProducts,
      avgRating: avgRating[0]?.averageRating.toFixed(2) || 0,
      conversionRate,
      bestSellers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtenir les statistiques mensuelles
exports.getMonthlyStats = async (req, res) => {
  try {
    const monthlyData = await Order.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$totalPrice' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json(monthlyData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtenir les statistiques par catégorie
exports.getCategoryStats = async (req, res) => {
  try {
    const categoryStats = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json(categoryStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtenir les statistiques utilisateurs
exports.getUserStats = async (req, res) => {
  try {
    const userStats = {
      totalUsers: await User.countDocuments(),
      activeUsers: await Order.distinct('user'),
      usersWithProfile: await User.countDocuments({ profile: { $exists: true, $ne: null } }),
      recentUsers: await User.find().sort({ createdAt: -1 }).limit(10).select('username email createdAt')
    };

    res.json(userStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
