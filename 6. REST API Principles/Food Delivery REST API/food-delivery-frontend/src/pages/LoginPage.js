import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Card, CardContent, Alert, Divider, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff, PersonAdd, Login as LoginIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../services/api';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerAddress, setRegisterAddress] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await loginUser({
        email: loginEmail,
        password: loginPassword
      });
      
      if (response.data.user) {
        login(response.data.user);
        toast.success(`Welcome back, ${response.data.user.name}!`);
        navigate('/');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!registerName || !registerEmail || !registerPhone || !registerPassword) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    if (registerPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (registerPassword.length < 4) {
      setError('Password must be at least 4 characters');
      setLoading(false);
      return;
    }

    try {
      const userData = {
        name: registerName,
        email: registerEmail,
        phone: registerPhone,
        address: registerAddress || '',
        password: registerPassword
      };
      
      const response = await registerUser(userData);
      
      if (response.data.user) {
        login(response.data.user);
        toast.success('Registration successful! Welcome to FoodDelivery! 🎉');
        navigate('/');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h3" gutterBottom sx={{ color: '#ff6b35' }}>
              🍔
            </Typography>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: '#ff6b35' }}>
              FoodDelivery
            </Typography>
            <Typography variant="h6" gutterBottom>
              {isLogin ? 'Welcome Back!' : 'Create Account'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isLogin 
                ? 'Login to continue ordering your favorite food' 
                : 'Register to start ordering delicious food'}
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {isLogin ? (
            // Login Form
            <form onSubmit={handleLogin}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                sx={{ mb: 2 }}
                placeholder="john@example.com"
              />
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                sx={{ mb: 3 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                startIcon={<LoginIcon />}
                sx={{ 
                  backgroundColor: '#ff6b35',
                  '&:hover': { backgroundColor: '#e55a2b' },
                  mb: 2,
                  py: 1.5
                }}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          ) : (
            // Register Form
            <form onSubmit={handleRegister}>
              <TextField
                fullWidth
                label="Full Name"
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
                required
                sx={{ mb: 2 }}
                placeholder="John Doe"
              />
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                required
                sx={{ mb: 2 }}
                placeholder="john@example.com"
              />
              <TextField
                fullWidth
                label="Phone Number"
                value={registerPhone}
                onChange={(e) => setRegisterPhone(e.target.value)}
                required
                sx={{ mb: 2 }}
                placeholder="9876543210"
              />
              <TextField
                fullWidth
                label="Delivery Address"
                value={registerAddress}
                onChange={(e) => setRegisterAddress(e.target.value)}
                multiline
                rows={2}
                sx={{ mb: 2 }}
                placeholder="Enter your full address"
              />
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                sx={{ mb: 3 }}
                error={confirmPassword && registerPassword !== confirmPassword}
                helperText={confirmPassword && registerPassword !== confirmPassword ? "Passwords don't match" : ""}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                startIcon={<PersonAdd />}
                sx={{ 
                  backgroundColor: '#ff6b35',
                  '&:hover': { backgroundColor: '#e55a2b' },
                  mb: 2,
                  py: 1.5
                }}
              >
                {loading ? 'Creating Account...' : 'Register'}
              </Button>
            </form>
          )}

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <Button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setLoginPassword('');
                  setRegisterPassword('');
                  setConfirmPassword('');
                }}
                sx={{ 
                  color: '#ff6b35',
                  textTransform: 'none',
                  fontWeight: 'bold',
                  '&:hover': { backgroundColor: 'transparent' }
                }}
              >
                {isLogin ? 'Create Account' : 'Login Here'}
              </Button>
            </Typography>
          </Box>

          {/* Demo Credentials */}
          {isLogin && (
            <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                📝 Demo Credentials:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Email: john@example.com
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Password: password123
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Or register a new account!
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default LoginPage;