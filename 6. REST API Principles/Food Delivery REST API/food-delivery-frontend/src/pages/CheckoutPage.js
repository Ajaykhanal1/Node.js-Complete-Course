import React, { useState } from 'react';
import { Container, Typography, Box, Card, CardContent, Button, TextField, Divider, Alert, RadioGroup, FormControlLabel, Radio, Stepper, Step, StepLabel } from '@mui/material';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { placeOrder } from '../services/api';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const { cartItems, restaurant, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState(user?.address || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [activeStep, setActiveStep] = useState(0);

  const steps = ['Review Cart', 'Shipping Info', 'Payment', 'Place Order'];

  // Redirect if not logged in
  if (!user) {
    navigate('/login');
    return null;
  }

  // Redirect if cart is empty
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

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handlePlaceOrder = async () => {
    if (!restaurant) {
      toast.error('No restaurant selected');
      return;
    }

    if (!address) {
      toast.error('Please enter delivery address');
      return;
    }

    if (!phone) {
      toast.error('Please enter phone number');
      return;
    }

    const orderData = {
      userId: user.id,
      restaurantId: restaurant.id,
      items: cartItems.map(item => ({
        menuId: item.menuId,
        quantity: item.quantity
      })),
      paymentMethod,
      deliveryAddress: address,
      phone: phone
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

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>Order Summary</Typography>
            {restaurant && (
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Restaurant: {restaurant.name}
              </Typography>
            )}
            
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
              <Typography variant="h6" color="#ff6b35">₹{getCartTotal()}</Typography>
            </Box>

            {restaurant && getCartTotal() < restaurant.minOrder && (
              <Alert severity="warning">
                Minimum order amount is ₹{restaurant.minOrder}. 
                Add ₹{restaurant.minOrder - getCartTotal()} more.
              </Alert>
            )}
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>Delivery Information</Typography>
            <TextField
              fullWidth
              label="Full Name"
              value={user.name}
              disabled
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Delivery Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              multiline
              rows={3}
              required
              sx={{ mb: 2 }}
            />
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>Payment Method</Typography>
            <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <FormControlLabel value="cash" control={<Radio />} label="Cash on Delivery" />
              <FormControlLabel value="card" control={<Radio />} label="Credit/Debit Card" />
              <FormControlLabel value="upi" control={<Radio />} label="UPI (Google Pay, PhonePe)" />
            </RadioGroup>
            
            {paymentMethod === 'card' && (
              <Box sx={{ mt: 2 }}>
                <TextField fullWidth label="Card Number" placeholder="1234 5678 9012 3456" sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField label="MM/YY" placeholder="12/25" sx={{ flex: 1 }} />
                  <TextField label="CVV" placeholder="123" sx={{ flex: 1 }} />
                </Box>
              </Box>
            )}
            
            {paymentMethod === 'upi' && (
              <TextField fullWidth label="UPI ID" placeholder="username@okhdfcbank" sx={{ mt: 2 }} />
            )}
          </Box>
        );

      case 3:
        return (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>Review Your Order</Typography>
            <Card sx={{ bgcolor: '#f5f5f5', p: 2, mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Restaurant: {restaurant?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Items: {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total: ₹{getCartTotal()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Payment: {paymentMethod === 'cash' ? 'Cash on Delivery' : paymentMethod === 'card' ? 'Card' : 'UPI'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Delivery to: {address}
              </Typography>
            </Card>
            <Alert severity="info">
              By placing this order, you agree to our terms and conditions.
            </Alert>
          </Box>
        );

      default:
        return 'Unknown step';
    }
  };

  const isStepValid = () => {
    if (activeStep === 0) {
      return !(restaurant && getCartTotal() < restaurant.minOrder);
    }
    if (activeStep === 1) {
      return address && phone;
    }
    return true;
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        🛒 Checkout
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Card>
        <CardContent sx={{ p: 4 }}>
          {getStepContent(activeStep)}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              variant="outlined"
              onClick={activeStep === 0 ? () => navigate('/cart') : handleBack}
              disabled={activeStep === 0}
            >
              {activeStep === 0 ? 'Back to Cart' : 'Back'}
            </Button>
            
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handlePlaceOrder}
                disabled={loading || !isStepValid()}
                sx={{ backgroundColor: '#ff6b35' }}
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!isStepValid()}
                sx={{ backgroundColor: '#ff6b35' }}
              >
                Continue
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default CheckoutPage;