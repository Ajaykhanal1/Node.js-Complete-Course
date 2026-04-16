import React, { useState, useEffect, useCallback  } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Rating,
  Chip,
  Divider,
  CircularProgress
} from '@mui/material';
import { AccessTime, LocalOffer } from '@mui/icons-material';
import { getRestaurantById, getRestaurantMenu } from '../services/api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const RestaurantPage = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

const fetchRestaurantData = useCallback(async () => {
  setLoading(true);
  try {
    const [restaurantRes, menuRes] = await Promise.all([
      getRestaurantById(id),
      getRestaurantMenu(id)
    ]);
    setRestaurant(restaurantRes.data);
    setMenu(menuRes.data);
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    toast.error('Failed to load restaurant');
  } finally {
    setLoading(false);
  }
}, [id]); // Add id as dependency

useEffect(() => {
  fetchRestaurantData();
}, [fetchRestaurantData]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress sx={{ color: '#ff6b35' }} />
      </Box>
    );
  }

  if (!restaurant) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h5" color="error">
          Restaurant not found
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Restaurant Header */}
      <Card sx={{ mb: 4, overflow: 'hidden' }}>
        <Box
          component="img"
          sx={{
            height: 300,
            width: '100%',
            objectFit: 'cover'
          }}
          src={`https://picsum.photos/seed/${restaurant.id}/1200/400`}
          alt={restaurant.name}
        />
        <CardContent>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            {restaurant.name}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Rating value={restaurant.rating} precision={0.5} readOnly />
            <Typography variant="body1">({restaurant.rating})</Typography>
            <Chip label={restaurant.cuisine} size="small" />
          </Box>

          <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AccessTime sx={{ mr: 1, color: '#ff6b35' }} />
              <Typography>{restaurant.deliveryTime} mins</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocalOffer sx={{ mr: 1, color: '#ff6b35' }} />
              <Typography>Min order: ₹{restaurant.minOrder}</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Menu Section */}
      <Typography variant="h5" gutterBottom fontWeight="bold">
        📋 Menu
      </Typography>

      {menu && Object.keys(menu.menu).map((category) => (
        <Box key={category} sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ textTransform: 'capitalize' }}>
            {category}
          </Typography>
          <Grid container spacing={2}>
            {menu.menu[category].map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {item.name}
                    </Typography>
                    <Typography variant="h5" color="#ff6b35" gutterBottom>
                      ₹{item.price}
                    </Typography>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{ mt: 2, backgroundColor: '#ff6b35' }}
                      onClick={() => addToCart(item, restaurant)}
                    >
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Divider sx={{ mt: 3 }} />
        </Box>
      ))}
    </Container>
  );
};

export default RestaurantPage;