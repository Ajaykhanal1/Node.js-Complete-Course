import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton, Divider } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn, Phone, Email, LocationOn } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#1a1a1a',
        color: 'white',
        py: 6,
        mt: 'auto',
        borderTop: '3px solid #ff6b35'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ color: '#ff6b35', fontWeight: 'bold' }}>
              🍔 FoodDelivery
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: '#bdbdbd' }}>
              Delivering happiness to your doorstep since 2024. Best food delivery service in town!
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton 
                component="a" 
                href="#" 
                sx={{ color: 'white', '&:hover': { color: '#ff6b35' } }}
              >
                <Facebook />
              </IconButton>
              <IconButton 
                component="a" 
                href="#" 
                sx={{ color: 'white', '&:hover': { color: '#ff6b35' } }}
              >
                <Twitter />
              </IconButton>
              <IconButton 
                component="a" 
                href="#" 
                sx={{ color: 'white', '&:hover': { color: '#ff6b35' } }}
              >
                <Instagram />
              </IconButton>
              <IconButton 
                component="a" 
                href="#" 
                sx={{ color: 'white', '&:hover': { color: '#ff6b35' } }}
              >
                <LinkedIn />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Quick Links
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0 }}>
              {['About Us', 'Contact Us', 'Terms & Conditions', 'Privacy Policy', 'FAQ'].map((item) => (
                <Box component="li" key={item} sx={{ mb: 1 }}>
                  <Link 
                    href="#" 
                    sx={{ 
                      color: '#bdbdbd', 
                      textDecoration: 'none',
                      '&:hover': { color: '#ff6b35' }
                    }}
                  >
                    {item}
                  </Link>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Contact Us
            </Typography>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Phone fontSize="small" sx={{ color: '#ff6b35' }} />
              <Typography variant="body2" sx={{ color: '#bdbdbd' }}>
                +91 98765 43210
              </Typography>
            </Box>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Email fontSize="small" sx={{ color: '#ff6b35' }} />
              <Typography variant="body2" sx={{ color: '#bdbdbd' }}>
                support@fooddelivery.com
              </Typography>
            </Box>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationOn fontSize="small" sx={{ color: '#ff6b35' }} />
              <Typography variant="body2" sx={{ color: '#bdbdbd' }}>
                123 Food Street, Mumbai, India
              </Typography>
            </Box>
          </Grid>

          {/* Working Hours */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Working Hours
            </Typography>
            <Typography variant="body2" sx={{ color: '#bdbdbd' }}>
              Monday - Friday: 8:00 AM - 11:00 PM
            </Typography>
            <Typography variant="body2" sx={{ color: '#bdbdbd', mt: 1 }}>
              Saturday - Sunday: 9:00 AM - 12:00 AM
            </Typography>
            <Typography variant="body2" sx={{ color: '#ff6b35', mt: 2, fontWeight: 'bold' }}>
              24/7 Customer Support
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, bgcolor: '#333' }} />

        {/* Copyright */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#bdbdbd' }}>
            © {new Date().getFullYear()} FoodDelivery. All rights reserved. | Made with ❤️ for food lovers
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;