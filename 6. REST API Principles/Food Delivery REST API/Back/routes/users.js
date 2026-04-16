const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ============================================
// STEP 1: DEFINE uploadDir FIRST
// ============================================
const uploadDir = './uploads';

// ============================================
// STEP 2: CREATE FOLDER IF NOT EXISTS
// ============================================
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// ============================================
// STEP 3: CONFIGURE MULTER STORAGE
// ============================================
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const userId = req.params.id;
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `user-${userId}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

// ============================================
// STEP 4: FILE FILTER
// ============================================
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'), false);
    }
};

// ============================================
// STEP 5: CREATE MULTER INSTANCE
// ============================================
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: fileFilter
});

// Get database (AFTER all configurations)
const { users, orders } = require('../data/database');

// ============================================
// STEP 6: PHOTO UPLOAD ROUTE
// ============================================
router.post('/:id/upload-photo', upload.single('photo'), (req, res) => {
    console.log('\n📸 Photo upload request for user:', req.params.id);
    
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
        return res.status(404).json({ error: "User not found" });
    }
    
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }
    
    // Save photo URL
    const photoUrl = `/uploads/${req.file.filename}`;
    users[userIndex].profilePhoto = photoUrl;
    users[userIndex].updatedAt = new Date().toISOString();
    
    console.log('✅ Photo saved:', photoUrl);
    
    // Don't send password back
    const { password, ...safeUser } = users[userIndex];
    
    res.json({
        success: true,
        message: "Profile photo uploaded successfully",
        photoUrl: photoUrl,
        user: safeUser
    });
});

// ============================================
// STEP 7: REGISTER ROUTE
// ============================================
router.post('/register', (req, res) => {
    console.log('\n📝 Register request:', req.body);
    
    const { name, email, phone, address, password } = req.body;
    
    if (!name || !email || !phone || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }
    
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ error: "Email already registered" });
    }
    
    const newUser = {
        id: users.length + 1,
        name,
        email,
        phone,
        address: address || "",
        password,
        profilePhoto: null,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    console.log('✅ User created:', newUser.id, newUser.name);
    
    const { password: _, ...safeUser } = newUser;
    res.status(201).json({ success: true, user: safeUser });
});

// ============================================
// STEP 8: LOGIN ROUTE
// ============================================
router.post('/login', (req, res) => {
    console.log('\n🔐 Login request:', req.body.email);
    
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);
    
    if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
    }
    
    const { password: _, ...safeUser } = user;
    res.json({ success: true, user: safeUser });
});

// ============================================
// STEP 9: GET USER ROUTE
// ============================================
router.get('/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    
    const { password, ...safeUser } = user;
    res.json(safeUser);
});

// ============================================
// STEP 10: UPDATE USER ROUTE
// ============================================
router.put('/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
        return res.status(404).json({ error: "User not found" });
    }
    
    const { name, phone, address, profilePhoto } = req.body;
    
    if (name !== undefined) users[userIndex].name = name;
    if (phone !== undefined) users[userIndex].phone = phone;
    if (address !== undefined) users[userIndex].address = address;
    if (profilePhoto !== undefined) users[userIndex].profilePhoto = profilePhoto;
    
    users[userIndex].updatedAt = new Date().toISOString();
    
    const { password, ...safeUser } = users[userIndex];
    res.json({ success: true, user: safeUser });
});

// ============================================
// STEP 11: GET USER ORDERS
// ============================================
router.get('/:id/orders', (req, res) => {
    const userId = parseInt(req.params.id);
    const userOrders = orders.filter(o => o.userId === userId);
    res.json(userOrders);
});

module.exports = router;