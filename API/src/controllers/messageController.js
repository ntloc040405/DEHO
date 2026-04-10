const Message = require('../models/messages');
const User = require('../models/userModel');
const mongoose = require('mongoose');

// Lấy danh sách các hội thoại cho Admin
const getConversations = async (req, res) => {
  try {
    const conversations = await Message.aggregate([
      { 
        $match: {
          $or: [{ senderId: '67e32d8b2157440b136ea729' }, { receiverId: '67e32d8b2157440b136ea729' }]
        } 
      },
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: {
            $toString: {
              $cond: [
                { $eq: [{ $toString: '$senderId' }, '67e32d8b2157440b136ea729'] },
                '$receiverId',
                '$senderId'
              ]
            }
          },
          lastMessage: { $first: '$message' },
          timestamp: { $first: '$timestamp' },
          senderRole: { $first: '$senderRole' }
        }
      },
      // Safely join with user data
      {
        $lookup: {
          from: 'users',
          let: { userId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    { $eq: [{ $toString: "$_id" }, "$$userId"] },
                    { $eq: ["$email", "$$userId"] }
                  ]
                }
              }
            }
          ],
          as: 'userInfo'
        }
      },
      { $unwind: { path: '$userInfo', preserveNullAndEmptyArrays: true } },
      // Chỉ lấy những hội thoại có userInfo (đã đăng nhập)
      { $match: { userInfo: { $ne: null } } },
      {
        $project: {
          _id: 1,
          lastMessage: 1,
          timestamp: 1,
          senderRole: 1,
          name: '$userInfo.name',
          avatar: { 
            $cond: [
              { $regexMatch: { input: "$userInfo.avatar", regex: /^http/ } },
              "$userInfo.avatar",
              { $concat: ["http://localhost:4405", "$userInfo.avatar"] }
            ]
          }
        }
      },
      { $sort: { timestamp: -1 } }
    ]);

    res.status(200).json({ success: true, data: conversations });
  } catch (err) {
    console.error('API Error in getConversations:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// Lấy lịch sử chat với 1 User cụ thể
const getChatHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await Message.find({
      $or: [
        { senderId: '67e32d8b2157440b136ea729', receiverId: userId },
        { senderId: userId, receiverId: '67e32d8b2157440b136ea729' }
      ]
    }).sort({ timestamp: 1 });

    res.status(200).json({ success: true, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getConversations,
  getChatHistory
};
