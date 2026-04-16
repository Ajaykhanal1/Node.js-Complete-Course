const express = require('express');
const router = express.Router();
const { deliveries, orders } = require('../data/database');

// GET /deliveries/order/:orderId - Track delivery for specific order
router.get('/order/:orderId', (req, res) => {
    const orderId = parseInt(req.params.orderId);
    const delivery = deliveries.find(d => d.orderId === orderId);
    
    if (!delivery) {
        return res.status(404).json({ error: "Delivery not found for this order" });
    }
    
    const order = orders.find(o => o.id === orderId);
    
    res.json({
        orderId: delivery.orderId,
        orderStatus: order?.status,
        deliveryStatus: delivery.status,
        riderId: delivery.riderId,
        estimatedTimeRemaining: order?.status === "picked_up" ? "10-15 minutes" : "Waiting for pickup",
        lastUpdated: delivery.updatedAt
    });
});

// PUT /deliveries/rider/location - Update rider location (simulated)
router.put('/rider/location', (req, res) => {
    const { riderId, lat, lng, orderId } = req.body;
    
    const delivery = deliveries.find(d => d.orderId === orderId);
    if (delivery) {
        delivery.riderLocation = { lat, lng };
        delivery.updatedAt = new Date().toISOString();
        
        res.json({
            message: "Location updated",
            riderId,
            location: { lat, lng }
        });
    } else {
        res.status(404).json({ error: "Delivery not found" });
    }
});

module.exports = router;