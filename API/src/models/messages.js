const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: { type: String, required: true },   // ID người gửi (User ID hoặc 'admin')
  receiverId: { type: String, required: true }, // ID người nhận (User ID hoặc 'admin')
  senderRole: { type: String, enum: ['admin', 'customer'], required: true },
  name: { type: String }, // Tên hiển thị lúc gửi để tránh join nhiều
  avatar: { type: String }, // Avatar hiển thị
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);