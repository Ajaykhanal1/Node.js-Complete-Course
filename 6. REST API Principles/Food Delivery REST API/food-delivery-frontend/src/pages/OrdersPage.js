import React, { useState, useEffect, useCallback } from 'react';
import { Container, Typography, Box, Card, CardContent, Chip, Grid, Button, CircularProgress, Divider } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { getUserOrders, cancelOrder } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, LocalShipping, Restaurant, Cancel } from '@mui/icons-material';
import toast from 'react-hot-toast';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Define fetchOrders FIRST
  const fetchOrders = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await getUserOrders(user.id);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Now useEffect can safely call fetchOrders
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ff9800',
      confirmed: '#2196f3',
      preparing: '#9c27b0',
      ready: '#00bcd4',
      picked_up: '#ff6b35',
      delivered: '#4caf50',
      cancelled: '#f44336'
    };
    return colors[status] || '#757575';
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'delivered':
        return <CheckCircle />;
      case 'picked_up':
        return <LocalShipping />;
      case 'cancelled':
        return <Cancel />;
      default:
        return <Restaurant />;
    }
  };

  // ✅ Cancel order function
  const handleCancelOrder = async (orderId, event) => {
    event.stopPropagation(); // Prevent navigating to order details
    
    // Show confirmation dialog
    const confirmCancel = window.confirm(
      'Are you sure you want to cancel this order?\n\n' +
      '⚠️ This action cannot be undone.'
    );
    
    if (!confirmCancel) return;
    
    setCancellingOrderId(orderId);
    try {
      const response = await cancelOrder(orderId);
      toast.success(response.data.message || 'Order cancelled successfully!');
      // Refresh orders list
      await fetchOrders();
    } catch (error) {
      console.error('Error cancelling order:', error);
      const errorMessage = error.response?.data?.error || 'Failed to cancel order';
      toast.error(errorMessage);
    } finally {
      setCancellingOrderId(null);
    }
  };

  // Check if order can be cancelled (only pending or confirmed)
  const canCancelOrder = (status) => {
    return status === 'pending' || status === 'confirmed';
  };

  if (!user) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Please login to view your orders
        </Typography>
        <Button variant="contained" onClick={() => navigate('/login')} sx={{ backgroundColor: '#ff6b35' }}>
          Login
        </Button>
      </Container>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress sx={{ color: '#ff6b35' }} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        📦 My Orders
      </Typography>

      {orders.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No orders yet
          </Typography>
          <Button variant="contained" onClick={() => navigate('/')} sx={{ backgroundColor: '#ff6b35' }}>
            Start Ordering
          </Button>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {orders.map((order) => (
            <Grid item xs={12} key={order.id}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 3
                  },
                  opacity: order.status === 'cancelled' ? 0.7 : 1
                }} 
                onClick={() => navigate(`/track-order/${order.id}`)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Order #{order.id}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(order.createdAt).toLocaleString()}
                      </Typography>
                    </Box>
                    <Chip
                      icon={getStatusIcon(order.status)}
                      label={order.status.toUpperCase()}
                      sx={{
                        backgroundColor: getStatusColor(order.status),
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    />
                  </Box>

                  <Typography variant="body1" gutterBottom>
                    🍔 {order.restaurantName}
                  </Typography>

                  <Box sx={{ mt: 2 }}>
                    {order.items.map((item, idx) => (
                      <Typography key={idx} variant="body2" color="text.secondary">
                        {item.quantity}x {item.name} - ₹{item.subtotal}
                      </Typography>
                    ))}
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                    <Typography variant="h6" color="#ff6b35">
                      Total: ₹{order.totalPrice}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {/* Cancel Order Button - Only show if cancellable */}
                      {canCancelOrder(order.status) && (
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={(e) => handleCancelOrder(order.id, e)}
                          disabled={cancellingOrderId === order.id}
                          startIcon={cancellingOrderId === order.id ? <CircularProgress size={16} /> : <Cancel />}
                          sx={{ 
                            borderColor: '#f44336',
                            color: '#f44336',
                            '&:hover': {
                              borderColor: '#d32f2f',
                              backgroundColor: '#ffebee'
                            }
                          }}
                        >
                          {cancellingOrderId === order.id ? 'Cancelling...' : 'Cancel Order'}
                        </Button>
                      )}
                      
                      {/* Track Order Button */}
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/track-order/${order.id}`);
                        }}
                        sx={{ 
                          borderColor: '#ff6b35', 
                          color: '#ff6b35',
                          '&:hover': {
                            borderColor: '#e55a2b',
                            backgroundColor: '#fff3e0'
                          }
                        }}
                      >
                        {order.status === 'cancelled' ? 'View Details' : 'Track Order'}
                      </Button>
                    </Box>
                  </Box>
                  
                  {/* Show cancellation message if cancelled */}
                  {order.status === 'cancelled' && order.cancelledAt && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
                      Cancelled on: {new Date(order.cancelledAt).toLocaleString()}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default OrdersPage;