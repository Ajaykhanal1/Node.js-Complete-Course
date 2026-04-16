import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Button,
  Divider
} from '@mui/material';
import { Close, Delete, Add, Remove } from '@mui/icons-material';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Cart = ({ open, onClose }) => {
  const { 
    cartItems, 
    restaurant, 
    removeFromCart, 
    updateQuantity, 
    getCartTotal,
    clearCart 
  } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      onClose();
      navigate('/login');
      return;
    }
    onClose();
    navigate('/checkout');
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 400, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Your Cart</Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>

        {cartItems.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              Your cart is empty
            </Typography>
            <Button 
              variant="contained" 
              sx={{ mt: 2, backgroundColor: '#ff6b35' }}
              onClick={onClose}
            >
              Browse Restaurants
            </Button>
          </Box>
        ) : (
          <>
            {restaurant && (
              <Box sx={{ mb: 2, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Ordering from
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {restaurant.name}
                </Typography>
              </Box>
            )}

            <List>
              {cartItems.map((item) => (
                <ListItem key={item.menuId} sx={{ flexDirection: 'column', alignItems: 'stretch' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <ListItemText
                      primary={item.name}
                      secondary={`₹${item.price} each`}
                    />
                    <IconButton size="small" onClick={() => removeFromCart(item.menuId)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton 
                        size="small" 
                        onClick={() => updateQuantity(item.menuId, item.quantity - 1)}
                      >
                        <Remove fontSize="small" />
                      </IconButton>
                      <Typography>{item.quantity}</Typography>
                      <IconButton 
                        size="small" 
                        onClick={() => updateQuantity(item.menuId, item.quantity + 1)}
                      >
                        <Add fontSize="small" />
                      </IconButton>
                    </Box>
                    <Typography variant="body2" fontWeight="bold">
                      ₹{item.subtotal}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                </ListItem>
              ))}
            </List>

            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6" color="#ff6b35">
                  ₹{getCartTotal()}
                </Typography>
              </Box>
              
              <Button
                variant="contained"
                fullWidth
                size="large"
                sx={{ backgroundColor: '#ff6b35', mb: 1 }}
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>
              
              <Button
                variant="outlined"
                fullWidth
                onClick={clearCart}
                color="error"
              >
                Clear Cart
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  );
};

export default Cart;