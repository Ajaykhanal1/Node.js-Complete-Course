const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Import routes
const restaurantRoutes = require('./routes/restaurants');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');
const deliveryRoutes = require('./routes/deliveries');

// Import middleware
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 4000;

const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const userId = req.params.id;
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `user-${userId}-${uniqueSuffix}${ext}`);
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: fileFilter
});


// ============================================
// MIDDLEWARE
// ============================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static('uploads'));
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
    credentials: true
}));
app.use(morgan('dev'));

// ============================================
// ROUTES
// ============================================
app.get('/', (req, res) => {
    res.json({
        name: "🍔 Food Delivery API",
        version: "1.0.0",
        port: PORT,
        endpoints: {
            restaurants: "/restaurants",
            menu: "/restaurants/:id/menu",
            orders: "/orders",
            users: "/users",
            "user-register": "/users/register",
            "user-login": "/users/login",
            deliveries: "/deliveries/order/:orderId"
        }
    });
});

// IMPORTANT: These must be in this order
app.use('/restaurants', restaurantRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);  // ← THIS MUST BE HERE
app.use('/deliveries', deliveryRoutes);

// ============================================
// ERROR HANDLERS
// ============================================
app.use(notFound);
app.use(errorHandler);

// ============================================
// START SERVER
// ============================================
app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`📋 API Documentation: http://localhost:${PORT}`);
    console.log(`\n📌 Available User Routes:`);
    console.log(`   POST   /users/register  - Register new user`);
    console.log(`   POST   /users/login     - Login user`);
    console.log(`   GET    /users           - Get all users`);
    console.log(`   GET    /users/:id       - Get user by ID`);
    console.log(`   PUT    /users/:id       - Update user`);
    console.log(`   POST   /users/:id/upload-photo - Upload photo`);
    console.log(`   DELETE /users/:id/photo - Delete photo`);
    console.log(`\n📸 Image upload limit: 10MB`);
    console.log(`📁 Uploads folder: http://localhost:${PORT}/uploads\n`);
});