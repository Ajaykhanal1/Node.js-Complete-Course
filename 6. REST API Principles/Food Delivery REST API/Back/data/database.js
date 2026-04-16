// Users Database
const users = [
    { 
        id: 1, 
        name: "Ajay Khanal", 
        email: "ajaykhanal@gmail.com", 
        phone: "1234567890", 
        address: "123 Main St",
        password: "123", // In real app, store hashed password
        profilePhoto: null,
        createdAt: new Date().toISOString() 
    },
    { 
        id: 2, 
        name: "Jane Smith", 
        email: "jane@example.com", 
        phone: "0987654321", 
        address: "456 Oak Ave",
        password: "$2b$10$YourHashedPasswordHere", // In real app, store hashed password
        profilePhoto: null,
        createdAt: new Date().toISOString() 
    },
    { 
        id: 3, 
        name: "Ajay khanal", 
        email: "khanalajay9848@gmail.com", 
        phone: "1111111111", 
        address: "789 Pine Rd",
        password: "1111", // In real app, store hashed password
        profilePhoto:"/uploads/user-1-1776280236567-847418969.png" ,
        createdAt: new Date().toISOString() 
    }
];

// For demo purposes, let's add a simple password field
// In production, ALWAYS hash passwords using bcrypt

// Restaurants Database
const restaurants = [
    { id: 1, name: "Pizza Hub", cuisine: "Italian", rating: 4.5, deliveryTime: 30, minOrder: 200, image: "pizza.jpg" },
    { id: 2, name: "Burger House", cuisine: "American", rating: 4.2, deliveryTime: 25, minOrder: 150, image: "burger.jpg" },
    { id: 3, name: "Sushi Master", cuisine: "Japanese", rating: 4.8, deliveryTime: 35, minOrder: 300, image: "sushi.jpg" },
    { id: 4, name: "Tandoori Nights", cuisine: "Indian", rating: 4.7, deliveryTime: 40, minOrder: 250, image: "indian.jpg" },
    { id: 5, name: "Pasta Paradise", cuisine: "Italian", rating: 4.6, deliveryTime: 28, minOrder: 180, image: "pasta.jpg" },
    { id: 6, name: "Taco Bell", cuisine: "Mexican", rating: 4.3, deliveryTime: 20, minOrder: 120, image: "taco.jpg" },
    { id: 7, name: "Noodle House", cuisine: "Chinese", rating: 4.4, deliveryTime: 32, minOrder: 200, image: "noodle.jpg" },
    { id: 8, name: "Vegan Delight", cuisine: "Italian", rating: 4.9, deliveryTime: 35, minOrder: 250, image: "vegan.jpg" }
];

// Menu Items Database
const menuItems = [
    // Pizza Hub menu (id: 1)
    { id: 1, restaurantId: 1, name: "Margherita Pizza", price: 299, category: "pizza", isAvailable: true },
    { id: 2, restaurantId: 1, name: "Pepperoni Pizza", price: 399, category: "pizza", isAvailable: true },
    { id: 3, restaurantId: 1, name: "Garlic Bread", price: 99, category: "sides", isAvailable: true },
    
    // Burger House menu (id: 2)
    { id: 4, restaurantId: 2, name: "Classic Burger", price: 199, category: "burger", isAvailable: true },
    { id: 5, restaurantId: 2, name: "Cheese Burger", price: 249, category: "burger", isAvailable: true },
    { id: 6, restaurantId: 2, name: "French Fries", price: 99, category: "sides", isAvailable: true },
    
    // Sushi Master menu (id: 3)
    { id: 7, restaurantId: 3, name: "California Roll", price: 499, category: "sushi", isAvailable: true },
    { id: 8, restaurantId: 3, name: "Salmon Nigiri", price: 599, category: "sushi", isAvailable: true },
    
    // Tandoori Nights menu (id: 4)
    { id: 9, restaurantId: 4, name: "Chicken Tikka", price: 349, category: "starters", isAvailable: true },
    { id: 10, restaurantId: 4, name: "Butter Chicken", price: 399, category: "main", isAvailable: true },
    { id: 11, restaurantId: 4, name: "Garlic Naan", price: 49, category: "bread", isAvailable: true },
    
    // Pasta Paradise menu (id: 5)
    { id: 12, restaurantId: 5, name: "Alfredo Pasta", price: 279, category: "pasta", isAvailable: true },
    { id: 13, restaurantId: 5, name: "Spaghetti Bolognese", price: 299, category: "pasta", isAvailable: true },
    { id: 14, restaurantId: 5, name: "Garlic Bread", price: 89, category: "sides", isAvailable: true },
    
    // Taco Bell menu (id: 6)
    { id: 15, restaurantId: 6, name: "Crunchy Taco", price: 99, category: "tacos", isAvailable: true },
    { id: 16, restaurantId: 6, name: "Burrito Bowl", price: 249, category: "bowls", isAvailable: true },
    { id: 17, restaurantId: 6, name: "Nachos", price: 149, category: "sides", isAvailable: true },
    
    // Noodle House menu (id: 7)
    { id: 18, restaurantId: 7, name: "Hakka Noodles", price: 199, category: "noodles", isAvailable: true },
    { id: 19, restaurantId: 7, name: "Fried Rice", price: 179, category: "rice", isAvailable: true },
    { id: 20, restaurantId: 7, name: "Manchurian", price: 229, category: "starters", isAvailable: true },
    
    // Vegan Delight menu (id: 8)
    { id: 21, restaurantId: 8, name: "Vegan Burger", price: 249, category: "burgers", isAvailable: true },
    { id: 22, restaurantId: 8, name: "Buddha Bowl", price: 299, category: "bowls", isAvailable: true },
    { id: 23, restaurantId: 8, name: "Smoothie Bowl", price: 199, category: "healthy", isAvailable: true }
];
const orders = [];
let orderIdCounter = 1;
const deliveries = [];

module.exports = {
    users,
    restaurants,
    menuItems,
    orders,
    deliveries,
    getNextOrderId: () => ++orderIdCounter
};