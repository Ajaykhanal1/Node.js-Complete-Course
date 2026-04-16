const express = require('express');
const router = express.Router();
const { restaurants, menuItems } = require('../data/database');

// GET /restaurants - Get all restaurants
router.get('/', (req, res) => {
    // Optional: filter by cuisine, rating, etc.
    let result = [...restaurants];
    
    if (req.query.cuisine) {
        result = result.filter(r => r.cuisine.toLowerCase() === req.query.cuisine.toLowerCase());
    }
    
    if (req.query.minRating) {
    const minRating = parseFloat(req.query.minRating);
    result = result.filter(r => r.rating >= minRating);
    }
    
    res.json(result);
});

// GET /restaurants/:id - Get single restaurant
router.get('/:id', (req, res) => {
    const restaurant = restaurants.find(r => r.id === parseInt(req.params.id));
    
    if (!restaurant) {
        return res.status(404).json({ error: "Restaurant not found" });
    }
    
    res.json(restaurant);
});

// GET /restaurants/:id/menu - Get restaurant menu
router.get('/:id/menu', (req, res) => {
    const restaurantId = parseInt(req.params.id);
    const restaurant = restaurants.find(r => r.id === restaurantId);
    
    if (!restaurant) {
        return res.status(404).json({ error: "Restaurant not found" });
    }
    
    const menu = menuItems.filter(item => item.restaurantId === restaurantId && item.isAvailable);
    
    // Group by category (optional)
    const groupedMenu = menu.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {});
    
    res.json({
        restaurant: restaurant.name,
        menu: groupedMenu
    });
});

module.exports = router;