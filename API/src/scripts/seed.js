const mongoose = require('mongoose');
require('dotenv').config();

// Models
const Category = require('../models/categoryModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');
const Order = require('../models/orderModel');
const Message = require('../models/messages');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongodb:27017/deho';

const bcrypt = require('bcryptjs');

// --- DATA EMBEDDED START ---
const CATEGORIES_DATA = [{"_id":{"$oid":"67e326a52157440b136ea715"},"name":"Phòng Ngủ","slug":"phong-ngu ","image":"/images/categories/phong-ngu.png","updatedAt":{"$date":"2025-04-03T10:44:17.659Z"}},{"_id":{"$oid":"67e326a52157440b136ea716"},"name":"Phòng Khách","slug":"phong-khach","image":"/images/categories/phong-khach.png"},{"_id":{"$oid":"67e326a52157440b136ea717"},"name":"Phòng Ăn","slug":"phong-an","image":"/images/categories/phong-an.png"},{"_id":{"$oid":"67e326a52157440b136ea718"},"name":"Phòng Làm Việc ","slug":"phong-lam-viec","image":"/images/categories/phong-lam-viec.png","updatedAt":{"$date":"2025-03-31T05:14:46.916Z"}}];

const USERS_DATA = [
  {
    "_id": { "$oid": "67e32d8b2157440b136ea729" },
    "name": "Nguyên Quản Trị",
    "email": "admin@deho.vn",
    "phone": "0909000000",
    "address": "456 Đường Quản Trị, Quận 3, TP. HCM",
    "role": "admin",
    "password": "admin123" 
  },
  {
    "_id": { "$oid": "67e32d8b2157440b136ea72a" },
    "name": "Trần Khách Hàng",
    "email": "customer@deho.vn",
    "phone": "0909888777",
    "address": "789 Đường Mua Sắm, Quận 5, TP. HCM",
    "role": "customer",
    "password": "admin123"
  }
];

const PRODUCTS_DATA = [
  {
    "_id": { "$oid": "67fb0351f07de8526cae34bb" },
    "name": "Ghế Sofa MOHO HALDEN 801",
    "slug": "ghesofa",
    "description": "Kích thước: Dài 180cm x Rộng 85cm x Cao 82cm",
    "price": 10790000,
    "salePrice": 6999000,
    "thumbnail": "/images/1744503633763-ghesofa1.webp",
    "images": ["/images/1744503633763-ghesofa1.1.jpg"],
    "categoryId": { "$oid": "67e326a52157440b136ea716" },
    "createdAt": { "$date": "2025-04-13T00:20:33.771Z" },
    "updatedAt": { "$date": "2025-04-20T18:44:29.693Z" },
    "__v": 0,
    "sellCount": 4
  },
  {
    "_id": { "$oid": "67fb0424f07de8526cae34c3" },
    "name": "Ghế Sofa MOHO LYNGBY 601",
    "slug": "sofa",
    "description": "Kích thước: Dài 160cm x Rộng 79cm x Cao 72cm",
    "price": 10790000,
    "salePrice": 6499000,
    "thumbnail": "/images/1744503844075-pro_be_noi_that_moho_sofa_lyngby_7_ba5f47391b59470e842a70476e8def06_master.jpg",
    "images": ["/images/1744503844082-pro_be_noi_that_moho_sofa_lyngby_3_bfd59f3a9ace4e0bbea337fc23debdd5_master.jpg"],
    "categoryId": { "$oid": "67e326a52157440b136ea716" },
    "createdAt": { "$date": "2025-04-13T00:24:04.091Z" },
    "updatedAt": { "$date": "2025-04-20T18:44:52.428Z" },
    "__v": 0,
    "sellCount": 6
  },
  {
    "_id": { "$oid": "67fb04b5f07de8526cae34c8" },
    "name": "Ghế Sofa MOHO LYNGBY Góc L",
    "slug": "sofa",
    "description": "Kích thước: Dài 192cm x Rộng 132cm x Cao 72cm",
    "price": 12990000,
    "salePrice": 8199000,
    "thumbnail": "/images/1744503989537-pro_be_noi_that_moho___1__2a8d850c5cba4d0c87f1b4803eace91d_master.jpg",
    "images": ["/images/1744503989540-pro_be_noi_that_moho___2__acd996ed82684c60b11f65cede53b78d_master.jpg"],
    "categoryId": { "$oid": "67e326a52157440b136ea716" },
    "createdAt": { "$date": "2025-04-13T00:26:29.546Z" },
    "updatedAt": { "$date": "2025-04-20T16:49:38.506Z" },
    "__v": 0,
    "sellCount": 2
  },
  {
    "_id": { "$oid": "67fb0564f07de8526cae34d2" },
    "name": "Tủ Giày – Tủ Trang Trí Gỗ MOHO VIENNA 204",
    "slug": "tugiay",
    "description": "Kích thước: Dài 80cm x Rộng 32cm x Cao 100cm",
    "price": 4490000,
    "salePrice": 2899000,
    "thumbnail": "/images/1744504164107-pro_go_phoi_trang_noi_that_moho_tu_giay_trang_tri_vienna_204_9_b9e1762b3b104e2b95e3297cb6bd83da_master.webp",
    "images": ["/images/1744504164108-pro_go_phoi_trang_noi_that_moho_tu_giay_trang_tri_vienna_204_878b1deccc9c409481404d310e8fb045_master.webp"],
    "categoryId": { "$oid": "67e326a52157440b136ea716" },
    "createdAt": { "$date": "2025-04-13T00:29:24.112Z" },
    "updatedAt": { "$date": "2025-04-20T17:04:32.052Z" },
    "__v": 0,
    "sellCount": 2
  },
  {
    "_id": { "$oid": "67fb0657f07de8526cae34dc" },
    "name": "Bàn Làm Việc Gỗ MOHO VLINE 601 Màu Nâu",
    "slug": "banlamviec",
    "description": "Kích thước: Dài 110cm x Rộng 55cm x Cao 74cm",
    "price": 2990000,
    "salePrice": null,
    "thumbnail": "/images/1744504407947-pro_nau_noi_that_moho_ban_lam_viec_vline_601_45d5b92f9a2b464e8382610013e531d7_master.webp",
    "images": ["/images/1744504407951-pro_nau_noi_that_moho_ban_lam_viec_vline_601_a_e60e2f8b72854311ae12424eed3cb88a_master.webp"],
    "categoryId": { "$oid": "67e326a52157440b136ea718" },
    "createdAt": { "$date": "2025-04-13T00:33:27.954Z" },
    "updatedAt": { "$date": "2025-04-13T00:33:27.954Z" },
    "__v": 0,
    "sellCount": 0
  },
  {
    "_id": { "$oid": "67fb06adf07de8526cae34e3" },
    "name": "Ghế Xoay Văn Phòng Tay Gập Thông Minh MOHO RIGA 701",
    "slug": "ghe",
    "description": "Kích thước: Dài 52cm x Rộng 65cm x Cao 94-101cm",
    "price": 1690000,
    "salePrice": 1099000,
    "thumbnail": "/images/1744504493567-pro_den_noi_that_moho_ghe_van_phong_riga_1_36e7043208564abbb45f8bd6f68f998d_master.jpg",
    "images": ["/images/1744504493568-pro_den_noi_that_moho_ghe_van_phong_riga_3_4722911408574dbf8513ef8d4aeefe0e_master.webp"],
    "categoryId": { "$oid": "67e326a52157440b136ea718" },
    "createdAt": { "$date": "2025-04-13T00:34:53.575Z" },
    "updatedAt": { "$date": "2025-04-13T00:34:53.575Z" },
    "__v": 0,
    "sellCount": 0
  },
  {
    "_id": { "$oid": "67fb06eef07de8526cae34e7" },
    "name": "Kệ Để Sách 3 Tầng MOHO WORKS 703",
    "slug": "ke",
    "description": "Kích thước: Dài 80cm x Rộng 32cm x Cao 106cm ",
    "price": 2490000,
    "salePrice": null,
    "thumbnail": "/images/1744504558160-pro_den_noi_that_moho_ke_de_sach_7_6d68505ffeaa46e6a1642cad38af56a5_master.webp",
    "images": ["/images/1744504558161-pro_den_noi_that_moho_ke_de_sach_8_e44f4b290be04aac83bc2f615437144c_master.webp"],
    "categoryId": { "$oid": "67e326a52157440b136ea718" },
    "createdAt": { "$date": "2025-04-13T00:35:58.165Z" },
    "updatedAt": { "$date": "2025-04-20T17:09:02.269Z" },
    "__v": 0,
    "sellCount": 1
  },
  {
    "_id": { "$oid": "67fb0735f07de8526cae34eb" },
    "name": "Combo Bàn Làm Việc Gỗ MOHO VLINE 1m2",
    "slug": "banlamviec",
    "description": "- Bàn làm việc VLINE: Dài 110cm x Rộng 55cm x Cao 74cm  - Ghế ăn MILAN: Dài 52cm x Rộng 49cm x Cao 74cm",
    "price": 5180000,
    "salePrice": null,
    "thumbnail": "/images/1744504629416-pro_nau_noi_that_moho_combo_ban_lam_viec_go_moho_ghe_fyn_5_8bc415ae0bd24dc88a3c261f13a95710_master.webp",
    "images": ["/images/1744504629419-pro_nau_noi_that_moho_combo_ban_lam_viec_go_moho_ghe_nexo_5_75d8bfa8974d45f2ad79ae23ae7e7537_master.webp"],
    "categoryId": { "$oid": "67e326a52157440b136ea718" },
    "createdAt": { "$date": "2025-04-13T00:37:09.425Z" },
    "updatedAt": { "$date": "2025-04-13T00:37:09.425Z" },
    "__v": 0,
    "sellCount": 0
  },
  {
    "_id": { "$oid": "67fb07e9f07de8526cae34f0" },
    "name": "Nệm Lò Xo Royal Vải Tricat Nhiều Kích Thước (Bảo Hành 8 Năm)",
    "slug": "nem",
    "description": "Kích thước: 1m/ 1m2/ 1m4/ 1m6/ 1m8 x 2m x 10/ 15/ 20cm",
    "price": 3970000,
    "salePrice": null,
    "thumbnail": "/images/1744504809242-pro_trang_kem_noi_that_moho_nem_lo_xo_van_thanh__9ffeace09eae494baf02dd69905f753b_master.png",
    "images": ["/images/1744504809245-pro_trang_kem_noi_that_moho_nem_lo_xo_van_thanh_1_f450cb4751eb444d963cf01ecad6b5d5_master.png"],
    "categoryId": { "$oid": "67e326a52157440b136ea715" },
    "createdAt": { "$date": "2025-04-13T00:40:09.249Z" },
    "updatedAt": { "$date": "2025-04-20T17:24:03.347Z" },
    "__v": 0,
    "sellCount": 6
  },
  {
    "_id": { "$oid": "67fb0834f07de8526cae34f7" },
    "name": "Nệm Foam Vải Gấm (Bảo Hành 10 Năm)",
    "slug": "nem",
    "description": "Kích thước: 1m6x2m0x11",
    "price": 3880000,
    "salePrice": null,
    "thumbnail": "/images/1744504884974-10_nam_mousse_ep_fced4c16452e416eaab21f4418ca16eb_1024x1024.webp",
    "images": [],
    "categoryId": { "$oid": "67e326a52157440b136ea715" },
    "createdAt": { "$date": "2025-04-13T00:41:24.982Z" },
    "updatedAt": { "$date": "2025-04-13T00:41:24.982Z" },
    "__v": 0,
    "sellCount": 0
  },
  {
    "_id": { "$oid": "67fb08baf07de8526cae34fe" },
    "name": "Hệ tủ bếp MOHO Kitchen Premium Narvik ",
    "slug": "tu",
    "description": "- Bếp chữ L 3.4m: 2274 x 1724mm",
    "price": 19816667,
    "salePrice": null,
    "thumbnail": "/images/1744505018740-pro_1m5_chu_i_noi_that_moho_tu_bep_premium_chu_i_1m5_narvik_b_804c3680a33649c097732eaf825f08a8_master.webp",
    "images": ["/images/1744505018741-pro_1m5_chu_i_noi_that_moho_tu_bep_premium_chu_i_1m5_narvik_c_8273740dc0ef4573906ba2ffed50ffdd_master.webp"],
    "categoryId": { "$oid": "67e326a52157440b136ea717" },
    "createdAt": { "$date": "2025-04-13T00:43:38.744Z" },
    "updatedAt": { "$date": "2025-04-13T00:43:38.744Z" },
    "__v": 0,
    "sellCount": 0
  },
  {
    "_id": { "$oid": "67fb0980f07de8526cae3508" },
    "name": "Hệ tủ bếp MOHO Kitchen Premium Ubeda",
    "slug": "bep",
    "description": "Bếp chữ L 3.4m: 2274 x 1724mm ",
    "price": 19816667,
    "salePrice": null,
    "thumbnail": "/images/1744505216848-pro_1m5_chu_i_noi_that_moho_tu_bep_premium_chu_i_1m5_ubeda_c_604284e648254233b4b822f8a0f6de15_master.webp",
    "images": ["/images/1744505216849-1744505018740-pro_1m5_chu_i_noi_that_moho_tu_bep_premium_chu_i_1m5_narvik_b_804c3680a33649c097732eaf825f08a8_master.webp"],
    "categoryId": { "$oid": "67e326a52157440b136ea717" },
    "createdAt": { "$date": "2025-04-13T00:46:56.852Z" },
    "updatedAt": { "$date": "2025-04-20T16:56:12.208Z" },
    "__v": 0,
    "sellCount": 6
  },
  {
    "_id": { "$oid": "67fb09d1f07de8526cae350d" },
    "name": "Bàn Sofa MOHO KOSTER Màu Nâu",
    "slug": "bantra",
    "description": "Bàn Sofa: Dài 90 X Rộng 50 X H40 (cm)",
    "price": 2090000,
    "salePrice": null,
    "thumbnail": "/images/1744505297756-pro_nau_noi_that_moho_ban_sofa_koster_mau_nau_1_7bd3712bece542ecb45bfe3933373900_large.webp",
    "images": ["/images/1744505297756-pro_nau_noi_that_moho_ban_sofa_koster_mau_nau_2_2e9b0e60494541dc8f65b0efcf70298a_master.webp"],
    "categoryId": { "$oid": "67e326a52157440b136ea716" },
    "createdAt": { "$date": "2025-04-13T00:48:17.760Z" },
    "updatedAt": { "$date": "2025-04-20T17:16:46.220Z" },
    "__v": 0,
    "sellCount": 10
  },
  {
    "_id": { "$oid": "67fb0a6bf07de8526cae3513" },
    "name": "Bàn Sofa HOBRO 301 (màu nâu 90)",
    "slug": "ban",
    "description": "Kích thước: Rộng 400 x Dài 900 x Cao 400",
    "price": 1990000,
    "salePrice": null,
    "thumbnail": "/images/1744505451109-pro_mau_nau_noi_that_moho_ban_sofa_hobro___1__b8b2225e1732409086e953121185762d_master.jpg",
    "images": ["/images/1744505451111-pro_mau_nau_noi_that_moho_ban_sofa_hobro___2__eca0f716a389412991d0de9fe840ec58_master.jpg"],
    "categoryId": { "$oid": "67e326a52157440b136ea716" },
    "createdAt": { "$date": "2025-04-13T00:50:51.124Z" },
    "updatedAt": { "$date": "2025-04-20T17:16:06.323Z" },
    "__v": 0,
    "sellCount": 2
  }
];

const ORDERS_DATA = [
  {
    "_id": { "$oid": "67e32ce52157440b136ea727" },
    "customerName": "Nguyễn Văn A",
    "customerEmail": "nguyenvana@gmail.com",
    "customerPhone": "0909123456",
    "customerAddress": { "address": "123 Đường ABC", "district": "Quận 1", "city": "TP. HCM" },
    "customerNote": "Giao hàng sau 18h.",
    "items": [{ "productId": "1234567890abcdef", "productName": "Giường Ngủ MOHO KOSTER Màu Nâu 1m6", "quantity": 1, "price": 6490000 }],
    "total": 6490000,
    "status": "Đã hủy",
    "adminNote": "Đã xác minh SĐT.",
    "createdAt": "2025-03-26T14:30:00",
    "updatedAt": { "$date": "2025-04-05T06:41:33.886Z" }
  }
];

const MESSAGES_DATA = [
  {
    "senderId": "67e32d8b2157440b136ea729",
    "receiverId": "67e32d8b2157440b136ea72a",
    "senderRole": "admin",
    "name": "Quản trị viên",
    "message": "Xin chào! Bạn cần giúp gì không?",
    "timestamp": { "$date": "2025-04-20T10:00:00Z" }
  }
];
// --- DATA EMBEDDED END ---

const DATA_SETS = [
  { data: CATEGORIES_DATA, model: Category, label: 'Categories' },
  { data: USERS_DATA, model: User, label: 'Users' },
  { data: PRODUCTS_DATA, model: Product, label: 'Products' },
  { data: ORDERS_DATA, model: Order, label: 'Orders' },
  { data: MESSAGES_DATA, model: Message, label: 'Messages' },
];

const parseMongoData = (data) => {
  return JSON.parse(JSON.stringify(data), (key, value) => {
    if (value && typeof value === 'object') {
      if (value.$oid) return new mongoose.Types.ObjectId(value.$oid);
      if (value.$date) return new Date(value.$date);
    }
    const idFields = ['_id', 'categoryId', 'productId', 'senderId', 'receiverId'];
    if (idFields.includes(key) && typeof value === 'string' && value.match(/^[0-9a-fA-F]{24}$/)) {
      return new mongoose.Types.ObjectId(value);
    }
    return value;
  });
};

const connectWithRetry = async (retryCount = 0) => {
  const MAX_RETRIES = 15;
  try {
    const safeUri = MONGODB_URI.replace(/\/\/.*@/, '//****:****@');
    console.log(`📡 Đang kết nối tới: ${safeUri}`);
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ Đã kết nối MongoDB thành công');
    console.log(`📂 Database: ${mongoose.connection.name}`);
  } catch (err) {
    if (retryCount < MAX_RETRIES) {
      console.log(`⏳ MongoDB chưa sẵn sàng (Thử lại lần ${retryCount + 1}/${MAX_RETRIES})...`);
      await new Promise(resolve => setTimeout(resolve, 3000));
      return connectWithRetry(retryCount + 1);
    }
    throw err;
  }
};

const seedData = async () => {
  try {
    console.log('🚀 Bắt đầu quá trình nạp dữ liệu (Safe Mode)...');
    await connectWithRetry();

    for (const set of DATA_SETS) {
      const parsedData = parseMongoData(set.data);

      let cleanedData = parsedData.map(item => {
        if (item.role && typeof item.role === 'string') {
          item.role = item.role.trim();
        }
        return item;
      });

      // ✅ Check DB có data chưa
      const count = await set.model.countDocuments();

      if (count > 0) {
        console.log(`⏭️ Bỏ qua ${set.label} (đã có ${count} bản ghi)`);
        continue;
      }

      // ✅ Chỉ hash password khi insert lần đầu
      if (set.label === 'Users') {
        cleanedData = cleanedData.map(user => ({
          ...user,
          password: bcrypt.hashSync('admin123', 10) // luôn đảm bảo đúng pass
        }));
        console.log(`🔐 Đã mã hóa mật khẩu cho ${cleanedData.length} người dùng.`);
      }

      if (cleanedData.length > 0) {
        console.log(`📥 Đang nạp ${cleanedData.length} bản ghi vào ${set.label}...`);
        await set.model.insertMany(cleanedData, { ordered: false });
      }

      console.log(`📦 Đã nạp thành công cho ${set.label}`);
    }

    console.log('✨ SEED HOÀN TẤT (KHÔNG GHI ĐÈ DATA)');
    process.exit(0);

  } catch (err) {
    console.error('❌ LỖI KHI SEED DỮ LIỆU:', err.message);
    process.exit(1);
  }
};

seedData();
