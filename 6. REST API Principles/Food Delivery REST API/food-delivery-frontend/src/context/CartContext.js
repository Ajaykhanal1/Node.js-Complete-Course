import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [restaurant, setRestaurant] = useState(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const { items, restaurant: savedRestaurant } = JSON.parse(savedCart);
      setCartItems(items || []);
      setRestaurant(savedRestaurant || null);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify({ items: cartItems, restaurant }));
  }, [cartItems, restaurant]);

  const addToCart = (item, restaurantData) => {
    // Check if adding from different restaurant
    if (restaurant && restaurant.id !== restaurantData.id) {
      toast.error('You can only order from one restaurant at a time. Clear cart first?');
      return false;
    }

    setRestaurant(restaurantData);
    
    const existingItem = cartItems.find(i => i.menuId === item.id);
    
    if (existingItem) {
      setCartItems(cartItems.map(i =>
        i.menuId === item.id
          ? { ...i, quantity: i.quantity + 1, subtotal: (i.quantity + 1) * i.price }
          : i
      ));
    } else {
      setCartItems([...cartItems, {
        menuId: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        subtotal: item.price
      }]);
    }
    
    toast.success(`${item.name} added to cart!`);
    return true;
  };

  const removeFromCart = (menuId) => {
    setCartItems(cartItems.filter(item => item.menuId !== menuId));
    toast.success('Item removed from cart');
    
    if (cartItems.length === 1) {
      setRestaurant(null);
    }
  };

  const updateQuantity = (menuId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(menuId);
      return;
    }
    
    setCartItems(cartItems.map(item =>
      item.menuId === menuId
        ? { ...item, quantity: newQuantity, subtotal: newQuantity * item.price }
        : item
    ));
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.subtotal, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const clearCart = () => {
    setCartItems([]);
    setRestaurant(null);
    localStorage.removeItem('cart');
  };

  const value = {
    cartItems,
    restaurant,
    addToCart,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    getTotalItems,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};