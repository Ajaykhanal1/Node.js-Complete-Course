const express = require('express');
const router = express.Router();
const { orders, users, restaurants, menuItems, getNextOrderId, deliveries } = require('../data/database');

// POST /orders - Place new order
router.post('/', (req, res) => {
    const { userId, restaurantId, items, paymentMethod = "cash" } = req.body;
    
    // Validation
    const user = users.find(u => u.id === userId);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    
    const restaurant = restaurants.find(r => r.id === restaurantId);
    if (!restaurant) {
        return res.status(404).json({ error: "Restaurant not found" });
    }
    
    if (!items || items.length === 0) {
        return res.status(400).json({ error: "Order must have at least one item" });
    }
    
    // Calculate total price & validate items
    let totalPrice = 0;
    const orderItems = [];
    
    for (const item of items) {
        const menuItem = menuItems.find(m => m.id === item.menuId);
        if (!menuItem) {
            return res.status(404).json({ error: `Menu item ${item.menuId} not found` });
        }
        if (!menuItem.isAvailable) {
            return res.status(400).json({ error: `${menuItem.name} is not available` });
        }
        
        const itemTotal = menuItem.price * item.quantity;
        totalPrice += itemTotal;
        
        orderItems.push({
            menuId: menuItem.id,
            name: menuItem.name,
            price: menuItem.price,
            quantity: item.quantity,
            subtotal: itemTotal
        });
    }
    
    // Check minimum order
    if (totalPrice < restaurant.minOrder) {
        return res.status(400).json({ 
            error: `Minimum order amount is ₹${restaurant.minOrder}. Your total is ₹${totalPrice}`
        });
    }
    
    // Create order
    const newOrder = {
        id: getNextOrderId(),
        userId,
        restaurantId,
        restaurantName: restaurant.name,
        items: orderItems,
        totalPrice,
        status: "pending",  // pending, confirmed, preparing, ready, picked_up, delivered, cancelled
        paymentMethod,
        createdAt: new Date().toISOString(),
        estimatedDeliveryTime: restaurant.deliveryTime
    };
    
    orders.push(newOrder);
    
    // Create delivery tracking
    const delivery = {
        orderId: newOrder.id,
        riderId: null,  // Would assign from available riders
        status: "assigned",
        riderLocation: null,
        updatedAt: new Date().toISOString()
    };
    deliveries.push(delivery);
    
    res.status(201).json({
        message: "Order placed successfully!",
        orderId: newOrder.id,
        status: newOrder.status,
        totalPrice: newOrder.totalPrice,
        estimatedTime: `${restaurant.deliveryTime} minutes`
    });
});

// GET /orders/:id - Get specific order
router.get('/:id', (req, res) => {
    const orderId = parseInt(req.params.id);
    const order = orders.find(o => o.id === orderId);
    
    if (!order) {
        return res.status(404).json({ error: "Order not found" });
    }
    
    // Get delivery info
    const delivery = deliveries.find(d => d.orderId === orderId);
    
    res.json({
        ...order,
        delivery: delivery || null
    });
});

// GET /orders/user/:userId - Get user's orders
router.get('/user/:userId', (req, res) => {
    const userId = parseInt(req.params.userId);
    const userOrders = orders.filter(o => o.userId === userId).sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
    );
    
    res.json(userOrders);
});

// PUT /orders/:id - Update order status (for restaurant/delivery system)
router.put('/:id', (req, res) => {
    const orderId = parseInt(req.params.id);
    const { status } = req.body;
    
    const order = orders.find(o => o.id === orderId);
    if (!order) {
        return res.status(404).json({ error: "Order not found" });
    }
    
    const validStatuses = ["pending", "confirmed", "preparing", "ready", "picked_up", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
    }
    
    order.status = status;
    order.updatedAt = new Date().toISOString();
    
    // Update delivery status if applicable
    const delivery = deliveries.find(d => d.orderId === orderId);
    if (delivery) {
        if (status === "picked_up") delivery.status = "on_the_way";
        if (status === "delivered") delivery.status = "completed";
        delivery.updatedAt = new Date().toISOString();
    }
    
    res.json({
        message: `Order status updated to ${status}`,
        order
    });
});

// DELETE /orders/:id - Cancel order
router.delete('/:id', (req, res) => {
    const orderId = parseInt(req.params.id);
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex === -1) {
        return res.status(404).json({ error: "Order not found" });
    }
    
    // Only allow cancellation if status is pending or confirmed
    const allowedToCancel = ["pending", "confirmed"].includes(orders[orderIndex].status);
    if (!allowedToCancel) {
        return res.status(400).json({ 
            error: `Cannot cancel order with status: ${orders[orderIndex].status}. Order is already being prepared.`
        });
    }
    
    // Update order status
    orders[orderIndex].status = "cancelled";
    orders[orderIndex].cancelledAt = new Date().toISOString();
    orders[orderIndex].updatedAt = new Date().toISOString();
    
    // Update delivery status
    const deliveryIndex = deliveries.findIndex(d => d.orderId === orderId);
    if (deliveryIndex !== -1) {
        deliveries[deliveryIndex].status = "cancelled";
        deliveries[deliveryIndex].updatedAt = new Date().toISOString();
    }
    
    res.json({ 
        message: "Order cancelled successfully",
        orderId: orderId,
        status: "cancelled",
        refundStatus: "Refund will be processed within 5-7 business days"
    });
});

module.exports = router;