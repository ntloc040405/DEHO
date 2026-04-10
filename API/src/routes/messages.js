const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');

// Route cho admin lấy danh sách các cuộc hội thoại
router.get('/conversations', verifyToken, verifyAdmin, messageController.getConversations);

// Route lấy lịch sử chat giữa admin và 1 user cụ thể (Mở công khai để khách vãng lai cũng lấy được)
router.get('/history/:userId', messageController.getChatHistory);

module.exports = router;
