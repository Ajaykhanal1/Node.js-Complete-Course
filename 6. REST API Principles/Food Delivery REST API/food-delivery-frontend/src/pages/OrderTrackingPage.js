import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Card, CardContent, LinearProgress, Stepper, Step, StepLabel, Button, Chip, CircularProgress, Divider, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { getOrderById, trackDelivery, cancelOrder } from '../services/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const OrderTrackingPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const navigate = useNavigate();

  const steps = ['Order Placed', 'Confirmed', 'Preparing', 'Ready', 'Picked Up', 'Delivered'];
  const statusMap = {
    pending: 0,
    confirmed: 1,
    preparing: 2,
    ready: 3,
    picked_up: 4,
    delivered: 5,
    cancelled: -1
  };

  const fetchOrderDetails = useCallback(async () => {
    setLoading(true);
    try {
      const [orderRes, deliveryRes] = await Promise.all([
        getOrderById(orderId),
        trackDelivery(orderId)
      ]);
      setOrder(orderRes.data);
      setDelivery(deliveryRes.data);
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrderDetails();
    const interval = setInterval(fetchOrderDetails, 5000);
    return () => clearInterval(interval);
  }, [fetchOrderDetails]);

  // ✅ Implement cancel order function
  const handleCancelOrder = async () => {
    setCancelling(true);
    try {
      const response = await cancelOrder(orderId);
      toast.success(response.data.message || 'Order cancelled successfully!');
      // Refresh order details
      await fetchOrderDetails();
      setCancelDialogOpen(false);
      // Redirect to orders page after 2 seconds
      setTimeout(() => {
        navigate('/orders');
      }, 2000);
    } catch (error) {
      console.error('Error cancelling order:', error);
      const errorMessage = error.response?.data?.error || 'Failed to cancel order';
      toast.error(errorMessage);
    } finally {
      setCancelling(false);
    }
  };

  const openCancelDialog = () => {
    setCancelDialogOpen(true);
  };

  const closeCancelDialog = () => {
    setCancelDialogOpen(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress sx={{ color: '#ff6b35' }} />
      </Box>
    );
  }

  if (!order) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h5" color="error">
          Order not found
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/orders')}
          sx={{ mt: 2, backgroundColor: '#ff6b35' }}
        >
          View My Orders
        </Button>
      </Container>
    );
  }

  const currentStep = statusMap[order.status] || 0;
  const isCancelled = order.status === 'cancelled';
  const canCancel = !isCancelled && (order.status === 'pending' || order.status === 'confirmed');

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        📍 Track Order #{order.id}
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">
              {order.restaurantName}
            </Typography>
            <Chip
              label={order.status.toUpperCase()}
              sx={{
                backgroundColor: isCancelled ? '#f44336' : order.status === 'delivered' ? '#4caf50' : '#ff6b35',
                color: 'white',
                fontWeight: 'bold'
              }}
            />
          </Box>

          {!isCancelled ? (
            <>
              <Stepper activeStep={currentStep} alternativeLabel sx={{ mb: 4 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              <LinearProgress
                variant="determinate"
                value={(currentStep / (steps.length - 1)) * 100}
                sx={{
                  mb: 3,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#ff6b35'
                  }
                }}
              />
            </>
          ) : (
            <Typography variant="h6" color="error" align="center" sx={{ py: 4 }}>
              ❌ This order has been cancelled
              {order.cancelledAt && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Cancelled on: {new Date(order.cancelledAt).toLocaleString()}
                </Typography>
              )}
            </Typography>
          )}

          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Estimated Delivery Time: {order.estimatedDeliveryTime} minutes
            </Typography>
            
            {delivery && delivery.riderId && (
              <Typography variant="body2" color="text.secondary">
                🛵 Rider Assigned: #{delivery.riderId}
              </Typography>
            )}

            <Typography variant="body2" color="text.secondary">
              💰 Total Amount: ₹{order.totalPrice}
            </Typography>
            
            {order.paymentMethod && (
              <Typography variant="body2" color="text.secondary">
                💳 Payment: {order.paymentMethod === 'cash' ? 'Cash on Delivery' : order.paymentMethod}
              </Typography>
            )}
          </Box>

          {/* Cancel Order Button - Only show if cancellable */}
          {canCancel && (
            <Button
              variant="outlined"
              color="error"
              fullWidth
              sx={{ mt: 3 }}
              onClick={openCancelDialog}
            >
              Cancel Order
            </Button>
          )}

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2, backgroundColor: '#ff6b35' }}
            onClick={() => navigate('/orders')}
          >
            View All Orders
          </Button>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            🍽️ Order Items
          </Typography>
          {order.items && order.items.map((item, idx) => (
            <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>
                {item.quantity}x {item.name}
              </Typography>
              <Typography>₹{item.subtotal}</Typography>
            </Box>
          ))}
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6">Total</Typography>
            <Typography variant="h6" color="#ff6b35">
              ₹{order.totalPrice}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Cancel Confirmation Dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={closeCancelDialog}
      >
        <DialogTitle sx={{ color: '#f44336' }}>
          Cancel Order #{order.id}?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel this order?
            <br /><br />
            <strong>Order Details:</strong>
            <br />
            • Restaurant: {order.restaurantName}
            <br />
            • Total Amount: ₹{order.totalPrice}
            <br /><br />
            <strong>Note:</strong> Once cancelled, this action cannot be undone.
            {order.paymentMethod === 'cash' ? (
              <span style={{ color: '#4caf50' }}> No payment has been processed.</span>
            ) : (
              <span style={{ color: '#ff9800' }}> Refund will be processed within 5-7 business days.</span>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeCancelDialog} disabled={cancelling}>
            Keep Order
          </Button>
          <Button 
            onClick={handleCancelOrder} 
            color="error" 
            variant="contained"
            disabled={cancelling}
          >
            {cancelling ? 'Cancelling...' : 'Yes, Cancel Order'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default OrderTrackingPage;