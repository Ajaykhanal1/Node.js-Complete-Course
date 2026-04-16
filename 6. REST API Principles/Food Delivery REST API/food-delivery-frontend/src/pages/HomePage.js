import React, { useState, useEffect, useCallback } from 'react';
import { Container, Grid, Typography, TextField, MenuItem, Box, CircularProgress } from '@mui/material';
import RestaurantCard from '../components/Restaurant/RestaurantCard';
import { getRestaurants } from '../services/api';

const HomePage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    cuisine: '',
    minRating: ''
  });

  const cuisines = ['Italian', 'American', 'Japanese', 'Chinese', 'Mexican', 'Indian'];

  // ✅ Define fetchRestaurants FIRST
  const fetchRestaurants = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getRestaurants(filters);
      setRestaurants(response.data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // ✅ Now useEffect can safely call fetchRestaurants
  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ 
        textAlign: 'center', 
        mb: 6,
        py: 4,
        background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)',
        borderRadius: 4,
        color: 'white'
      }}>
        <Typography variant="h3" gutterBottom fontWeight="bold">
          🍔 Craving Something?
        </Typography>
        <Typography variant="h6">
          Order from the best restaurants in your city
        </Typography>
      </Box>

      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          select
          label="Cuisine"
          value={filters.cuisine}
          onChange={(e) => setFilters({ ...filters, cuisine: e.target.value })}
          size="small"
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">All Cuisines</MenuItem>
          {cuisines.map((cuisine) => (
            <MenuItem key={cuisine} value={cuisine}>
              {cuisine}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Minimum Rating"
          value={filters.minRating}
          onChange={(e) => setFilters({ ...filters, minRating: e.target.value })}
          size="small"
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">Any Rating</MenuItem>
          <MenuItem value="4">4+ Stars</MenuItem>
          <MenuItem value="4.5">4.5+ Stars</MenuItem>
        </TextField>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#ff6b35' }} />
        </Box>
      ) : restaurants.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No restaurants found
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {restaurants.map((restaurant) => (
            <Grid item xs={12} sm={6} md={4} key={restaurant.id}>
              <RestaurantCard restaurant={restaurant} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default HomePage;