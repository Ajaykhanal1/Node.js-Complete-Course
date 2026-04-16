import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, IconButton, Badge, Box } from '@mui/material';
import { ShoppingCart, RestaurantMenu, History, Person } from '@mui/icons-material';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ onCartClick }) => {  // ← Receive onCartClick as prop
  const { getTotalItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#ff6b35' }}>
      <Toolbar>
        <Typography 
          variant="h6" 
          component={Link} 
          to="/" 
          sx={{ 
            flexGrow: 1, 
            textDecoration: 'none', 
            color: 'white',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <RestaurantMenu /> 🍔 FoodDelivery
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <IconButton color="inherit" component={Link} to="/">
            <Typography variant="body2">Home</Typography>
          </IconButton>

          {/* ✅ THIS IS WHERE THE CART BUTTON GOES */}
          <IconButton color="inherit" onClick={onCartClick}>
            <Badge badgeContent={getTotalItems()} color="error">
              <ShoppingCart />
            </Badge>
          </IconButton>

          {user ? (
            <>
              <IconButton color="inherit" component={Link} to="/orders">
                <History />
              </IconButton>
              <IconButton color="inherit" component={Link} to="/profile">
                <Person />
              </IconButton>
              <Button 
                color="inherit" 
                onClick={() => {
                  logout();
                  navigate('/');
                }}
              >
                Logout
              </Button>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                👋 {user.name}
              </Typography>
            </>
          ) : (
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;