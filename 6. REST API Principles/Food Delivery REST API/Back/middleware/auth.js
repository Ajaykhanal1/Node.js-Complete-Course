// Simple API key authentication (in real app, use JWT)
const API_KEYS = ['test-api-key-123', 'dev-key-456'];

const authenticate = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey || !API_KEYS.includes(apiKey)) {
        return res.status(401).json({ error: "Invalid or missing API key" });
    }
    
    next();
};

const validateOrder = (req, res, next) => {
    const { userId, restaurantId, items } = req.body;
    
    if (!userId) return res.status(400).json({ error: "userId is required" });
    if (!restaurantId) return res.status(400).json({ error: "restaurantId is required" });
    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "items array is required with at least one item" });
    }
    
    for (const item of items) {
        if (!item.menuId) return res.status(400).json({ error: "Each item must have menuId" });
        if (!item.quantity || item.quantity < 1) {
            return res.status(400).json({ error: "Each item must have quantity >= 1" });
        }
    }
    
    next();
};

module.exports = { authenticate, validateOrder };