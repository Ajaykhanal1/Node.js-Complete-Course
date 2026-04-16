import React from 'react';
import { Card, CardContent, CardMedia, Typography, Rating, Box, Button } from '@mui/material';
import { AccessTime, LocationOn } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const RestaurantCard = ({ restaurant }) => {
  const navigate = useNavigate();

  return (
    <Card 
      sx={{ 
        maxWidth: 345, 
        cursor: 'pointer',
        transition: 'transform 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 3
        }
      }}
      onClick={() => navigate(`/restaurant/${restaurant.id}`)}
    >
      <CardMedia
        component="img"
        height="200"
        image={`https://picsum.photos/seed/${restaurant.id}/400/300`}
        alt={restaurant.name}
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {restaurant.name}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating value={restaurant.rating} precision={0.5} readOnly size="small" />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            ({restaurant.rating})
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AccessTime fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {restaurant.deliveryTime} min
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LocationOn fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {restaurant.cuisine}
            </Typography>
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary">
          Min order: ₹{restaurant.minOrder}
        </Typography>

        <Button 
          variant="contained" 
          fullWidth 
          sx={{ mt: 2, backgroundColor: '#ff6b35' }}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/restaurant/${restaurant.id}`);
          }}
        >
          View Menu
        </Button>
      </CardContent>
    </Card>
  );
};

export default RestaurantCard;