const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/authMiddleware');

// Toutes les routes d'analyse nécessitent une authentification
router.get('/global-stats', authMiddleware, analyticsController.getGlobalStats);
router.get('/monthly-stats', authMiddleware, analyticsController.getMonthlyStats);
router.get('/category-stats', authMiddleware, analyticsController.getCategoryStats);
router.get('/user-stats', authMiddleware, analyticsController.getUserStats);

module.exports = router;
