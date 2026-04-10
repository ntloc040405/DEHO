const Order = require('../models/orderModel');
const User = require('../models/userModel');
const Product = require('../models/productModel');

const getDashboardStats = async (req, res) => {
  try {
    // 1. Tổng doanh thu (Các đơn đã giao hoặc đã hoàn thành)
    const revenueStats = await Order.aggregate([
      { $match: { status: { $in: ['Đã giao', 'Đã hoàn thành'] } } },
      { $group: { _id: null, totalRevenue: { $sum: '$total' } } }
    ]);
    const totalRevenue = revenueStats.length > 0 ? revenueStats[0].totalRevenue : 0;

    // 2. Tổng số đơn hàng và tổng số khách hàng
    const totalOrders = await Order.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });

    // 3. Thống kê trạng thái đơn hàng (Pie Chart data)
    const orderStatusStats = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // 4. Doanh thu 7 ngày gần nhất (Line Chart data)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const weeklyRevenue = await Order.aggregate([
      { 
        $match: { 
          status: { $in: ['Đã giao', 'Đã hoàn thành'] },
          createdAt: { $gte: sevenDaysAgo }
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: '$total' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // 5. Top 5 sản phẩm bán chạy nhất
    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          totalSold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productInfo'
        }
      },
      { $unwind: '$productInfo' },
      {
        $project: {
          _id: 1,
          totalSold: 1,
          revenue: 1,
          name: '$productInfo.name'
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 }
    ]);

    res.status(200).json({
      success: true,
      message: 'Lấy dữ liệu thống kê thành công',
      data: {
        totalRevenue,
        totalOrders,
        totalCustomers,
        orderStatusStats,
        weeklyRevenue,
        topProducts
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getDashboardStats
};
