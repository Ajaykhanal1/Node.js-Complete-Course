import React, { useState } from 'react';
import { Container, Typography, Box, Card, CardContent, Button, Divider, Alert } from '@mui/material';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { placeOrder } from '../services/api';
import toast from 'react-hot-toast';

const CartPage = () => {
  const { cartItems, restaurant, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [loading, setLoading] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  if (cartItems.length === 0) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Your cart is empty
        </Typography>
        <Button variant="contained" onClick={() => navigate('/')} sx={{ backgroundColor: '#ff6b35' }}>
          Browse Restaurants
        </Button>
      </Container>
    );
  }

  const handlePlaceOrder = async () => {
    if (!restaurant) {
      toast.error('No restaurant selected');
      return;
    }

    const orderData = {
      userId: user.id,
      restaurantId: restaurant.id,
      items: cartItems.map(item => ({
        menuId: item.menuId,
        quantity: item.quantity
      })),
      paymentMethod
    };

    setLoading(true);
    try {
      const response = await placeOrder(orderData);
      toast.success('Order placed successfully!');
      clearCart();
      navigate(`/track-order/${response.data.orderId}`);
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error(error.response?.data?.error || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        🛒 Checkout
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Order Summary
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Restaurant: {restaurant?.name}
            </Typography>
          </Box>

          {cartItems.map((item) => (
            <Box key={item.menuId} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>
                {item.quantity}x {item.name}
              </Typography>
              <Typography>₹{item.subtotal}</Typography>
            </Box>
          ))}

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Total</Typography>
            <Typography variant="h6" color="#ff6b35">
              ₹{getCartTotal()}
            </Typography>
          </Box>

          {restaurant && getCartTotal() < restaurant.minOrder && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Minimum order amount is ₹{restaurant.minOrder}. Add ₹{restaurant.minOrder - getCartTotal()} more.
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Payment Method
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant={paymentMethod === 'cash' ? 'contained' : 'outlined'}
              onClick={() => setPaymentMethod('cash')}
              sx={{ 
                backgroundColor: paymentMethod === 'cash' ? '#ff6b35' : 'transparent',
                borderColor: '#ff6b35',
                color: paymentMethod === 'cash' ? 'white' : '#ff6b35'
              }}
            >
              Cash on Delivery
            </Button>
            <Button
              variant={paymentMethod === 'card' ? 'contained' : 'outlined'}
              onClick={() => setPaymentMethod('card')}
              sx={{ 
                backgroundColor: paymentMethod === 'card' ? '#ff6b35' : 'transparent',
                borderColor: '#ff6b35',
                color: paymentMethod === 'card' ? 'white' : '#ff6b35'
              }}
            >
              Credit/Debit Card
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Button
  variant="contained"
  fullWidth
  size="large"
  onClick={() => navigate('/checkout')}  // ← Change this line
  disabled={restaurant && getCartTotal() < restaurant.minOrder}
  sx={{ backgroundColor: '#ff6b35', py: 1.5 }}
>
        {loading ? 'Placing Order...' : 'Place Order'}
      </Button>
    </Container>
  );
};

export default CartPage;