import React, { useState, useRef } from 'react';
import { Container, Typography, Box, Card, CardContent, Avatar, Button, Divider, TextField, IconButton, CircularProgress } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Person, Email, Phone, LocationOn, Edit, PhotoCamera, Save, Cancel } from '@mui/icons-material';
import { updateUserProfile, uploadProfilePhoto, deleteProfilePhoto } from '../services/api';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [editAddress, setEditAddress] = useState(user?.address || '');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleEditToggle = () => {
    if (isEditing) {
      setEditName(user.name);
      setEditPhone(user.phone);
      setEditAddress(user.address);
    }
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = async () => {
    setUploadingPhoto(true);
    try {
      const updateData = {
        name: editName,
        phone: editPhone,
        address: editAddress,
      };
      
      const response = await updateUserProfile(user.id, updateData);
      
      if (response.data.user) {
        login(response.data.user);
        toast.success('Profile updated successfully!');
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    
    setUploadingPhoto(true);
    
    try {
      const response = await uploadProfilePhoto(user.id, file);
      if (response.data.user) {
        login(response.data.user);
        toast.success('Profile photo updated successfully!');
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error(error.response?.data?.error || 'Failed to upload photo');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (window.confirm('Are you sure you want to remove your profile photo?')) {
      setUploadingPhoto(true);
      try {
        const response = await deleteProfilePhoto(user.id);
        if (response.data.user) {
          login(response.data.user);
          toast.success('Profile photo removed');
        }
      } catch (error) {
        console.error('Error removing photo:', error);
        toast.error('Failed to remove profile photo');
      } finally {
        setUploadingPhoto(false);
      }
    }
  };

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        👤 My Profile
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          {/* Profile Photo Section */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={user.profilePhoto ? `http://localhost:4000${user.profilePhoto}` : null}
                alt={user.name}
                sx={{
                  width: 120,
                  height: 120,
                  bgcolor: '#ff6b35',
                  fontSize: 48,
                  mb: 2,
                  border: '3px solid #ff6b35',
                  cursor: 'pointer'
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                {!user.profilePhoto && getInitials(user.name)}
              </Avatar>
              {uploadingPhoto && (
                <Box sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'rgba(0,0,0,0.5)',
                  borderRadius: '50%',
                  width: 120,
                  height: 120,
                  mb: 2
                }}>
                  <CircularProgress sx={{ color: 'white' }} />
                </Box>
              )}
              <IconButton
                sx={{
                  position: 'absolute',
                  bottom: 10,
                  right: 0,
                  backgroundColor: '#ff6b35',
                  color: 'white',
                  '&:hover': { backgroundColor: '#e55a2b' }
                }}
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPhoto}
              >
                <PhotoCamera />
              </IconButton>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/jpeg,image/png,image/jpg,image/gif"
                onChange={handlePhotoUpload}
                disabled={uploadingPhoto}
              />
            </Box>
            
            {user.profilePhoto && (
              <Button
                size="small"
                color="error"
                onClick={handleRemovePhoto}
                disabled={uploadingPhoto}
                sx={{ mt: 1 }}
              >
                Remove Photo
              </Button>
            )}
            
            <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
              {user.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Member since {new Date(user.createdAt || Date.now()).toLocaleDateString()}
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Profile Information */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Person sx={{ color: '#ff6b35', fontSize: 28 }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary">Full Name</Typography>
                {isEditing ? (
                  <TextField
                    fullWidth
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                ) : (
                  <Typography variant="body1">{user.name}</Typography>
                )}
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Email sx={{ color: '#ff6b35', fontSize: 28 }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary">Email Address</Typography>
                <Typography variant="body1">{user.email}</Typography>
                <Typography variant="caption" color="text.secondary">Email cannot be changed</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Phone sx={{ color: '#ff6b35', fontSize: 28 }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary">Phone Number</Typography>
                {isEditing ? (
                  <TextField
                    fullWidth
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                ) : (
                  <Typography variant="body1">{user.phone || 'Not provided'}</Typography>
                )}
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <LocationOn sx={{ color: '#ff6b35', fontSize: 28 }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary">Delivery Address</Typography>
                {isEditing ? (
                  <TextField
                    fullWidth
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    multiline
                    rows={2}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                ) : (
                  <Typography variant="body1">{user.address || 'Not provided'}</Typography>
                )}
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            {isEditing ? (
              <>
                <Button
                  variant="outlined"
                  onClick={handleEditToggle}
                  startIcon={<Cancel />}
                  disabled={uploadingPhoto}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSaveProfile}
                  startIcon={<Save />}
                  disabled={uploadingPhoto}
                  sx={{ backgroundColor: '#ff6b35' }}
                >
                  {uploadingPhoto ? 'Saving...' : 'Save Changes'}
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/orders')}
                  sx={{ borderColor: '#ff6b35', color: '#ff6b35' }}
                >
                  My Orders
                </Button>
                <Button
                  variant="contained"
                  onClick={handleEditToggle}
                  startIcon={<Edit />}
                  sx={{ backgroundColor: '#ff6b35' }}
                >
                  Edit Profile
                </Button>
              </>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ProfilePage;