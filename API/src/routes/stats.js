const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const { verifyAdmin } = require('../middlewares/authMiddleware');

// Chỉ dành cho Admin
router.get('/dashboard', verifyAdmin, statsController.getDashboardStats);

module.exports = router;
