import React, { useState } from 'react';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import Cookies from 'js-cookie';
import {
  TextField,
  Button,
  Snackbar,
  Box,
  Container,
  Paper,
  Typography,
  IconButton,
  InputAdornment,
  Alert,
  useTheme,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  Grid,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import GavelIcon from '@mui/icons-material/Gavel';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import BalanceIcon from '@mui/icons-material/Balance';
import GroupIcon from '@mui/icons-material/Group';
import SecurityIcon from '@mui/icons-material/Security';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

const departments = [
  'Civil Law',
  'Criminal Law',
  'Corporate Law',
  'Family Law',
  'Constitutional Law',
  'Environmental Law',
  'Intellectual Property Law',
  'Labor Law',
  'Tax Law',
  'Real Estate Law',
  'Immigration Law',
  'Human Rights Law',
  'Banking Law',
  'Consumer Protection Law',
  'Cyber Law'
];

const Register = () => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [coordinates, setCoordinates] = useState({
    latitude: null,
    longitude: null
  });
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: '',
    department: '',
    experience: '',
    boardOfCouncil: '',
    llbCertificateNumber: '',
    serviceType: 'Free',
    location: null,
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [registrationMessage, setRegistrationMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  const steps = ['Basic Information', 'Professional Details', 'Location Verification'];

  const handleChange = (prop) => (event) => {
    setFormData({ ...formData, [prop]: event.target.value });
  };

  const getLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            setCoordinates({
              latitude: lat,
              longitude: lon
            });

            const apiKey = 'a5ac45accf3a4ee6a8397c5dca5e7fd6';
            const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json`, {
              params: {
                q: `${lat},${lon}`,
                key: apiKey
              }
            });

            const locationDetails = response.data.results[0]?.components;
            if (locationDetails) {
              const locationData = {
                latitude: lat,
                longitude: lon,
                state: locationDetails.state || 'Unknown',
                country: locationDetails.country || 'Unknown',
              };
              setFormData({
                ...formData,
                location: locationData
              });
              setRegistrationMessage('Location verified successfully!');
              setOpenSnackbar(true);
            }
          } catch (error) {
            setRegistrationMessage('Error fetching location details.');
            setOpenSnackbar(true);
          }
        },
        (error) => {
          setRegistrationMessage('Failed to retrieve location.');
          setOpenSnackbar(true);
        }
      );
    }
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    if (!formData.location) {
      setRegistrationMessage('Please verify your location first.');
      setOpenSnackbar(true);
      return;
    }

    try {
      const usersCollectionRef = collection(db, 'users');
      const lowercaseUsername = formData.username.toLowerCase();
      const q = query(usersCollectionRef, where('username', '==', lowercaseUsername));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setRegistrationMessage('Username already exists. Please choose a different one.');
        setOpenSnackbar(true);
        return;
      }

      const userData = {
        username: lowercaseUsername,
        email: formData.email,
        role: formData.role,
        password: formData.password,
        locationData: formData.location,
        serviceType: formData.serviceType,
      };

      if (formData.role === 'Lawyers/Attorneys') {
        userData.department = formData.department;
        userData.experience = formData.experience;
        userData.boardOfCouncil = formData.boardOfCouncil;
        userData.llbCertificateNumber = formData.llbCertificateNumber;
      }

      await addDoc(usersCollectionRef, userData);
      
      // Set cookies and handle success
      Cookies.set('username', lowercaseUsername);
      Cookies.set('role', formData.role.substring(5));
      Cookies.set('email', formData.email);

      setRegistrationMessage('Registration successful! Redirecting...');
      setOpenSnackbar(true);

      setTimeout(() => {
        window.location.href = '/MainPage';
      }, 1500);
    } catch (error) {
      console.error('Error during registration:', error);
      setRegistrationMessage('An error occurred during registration.');
      setOpenSnackbar(true);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Username"
              required
              value={formData.username}
              onChange={handleChange('username')}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange('email')}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Password"
              type={passwordVisible ? 'text' : 'password'}
              required
              value={formData.password}
              onChange={handleChange('password')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setPasswordVisible(!passwordVisible)}
                      edge="end"
                    >
                      {passwordVisible ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              select
              label="Role"
              required
              value={formData.role}
              onChange={handleChange('role')}
              sx={{ mb: 2 }}
            >
              <MenuItem value="Case Owners/Clients">Case Owners/Clients</MenuItem>
              <MenuItem value="Lawyers/Attorneys">Lawyers/Attorneys</MenuItem>
            </TextField>

            {formData.role === 'Lawyers/Attorneys' && (
              <>
                <TextField
                  fullWidth
                  select
                  label="Department"
                  required
                  value={formData.department || ''}
                  onChange={handleChange('department')}
                  sx={{ mb: 2 }}
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                  ))}
                </TextField>
                <TextField
                  fullWidth
                  label="Experience (Years)"
                  required
                  value={formData.experience}
                  onChange={handleChange('experience')}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  select
                  label="Board of Council"
                  required
                  value={formData.boardOfCouncil}
                  onChange={handleChange('boardOfCouncil')}
                  sx={{ mb: 2 }}
                >
                  {indianStates.map((state) => (
                    <MenuItem key={state} value={state}>{state}</MenuItem>
                  ))}
                </TextField>
                <TextField
                  fullWidth
                  label="LLB Certificate Number"
                  required
                  value={formData.llbCertificateNumber}
                  onChange={handleChange('llbCertificateNumber')}
                  sx={{ mb: 2 }}
                />
                <br />
                <div className="input-field7">
                  <select
                    value={formData.serviceType}
                    onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                    className="custom-select"
                    required
                  >
                    <option value="Free">Service Type: Free</option>
                    <option value="Paid">Service Type: Paid</option>
                  </select>
                </div>
              </>
            )}
          </Box>
        );
      case 2:
        return (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Please verify your location to complete registration
            </Typography>
            <Button
              variant="outlined"
              startIcon={<LocationOnIcon />}
              onClick={getLocation}
              sx={{ mb: 2 }}
            >
              Verify Location
            </Button>
            {formData.location && (
              <Alert severity="success" sx={{ mt: 2 }}>
                Location verified: {formData.location.state}, {formData.location.country}
              </Alert>
            )}
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      background: 'linear-gradient(135deg, #f6f9fc 0%, #eef2f7 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Left Side - Updated styling */}
      <Box
        sx={{
          position: { xs: 'relative', md: 'fixed' },
          left: 0,
          top: 0,
          width: { xs: '100%', md: '45%' },
          height: { xs: 'auto', md: '100vh' },
          minHeight: { xs: '50vh', md: '100vh' },
          backgroundImage: `
            linear-gradient(
              to right bottom,
              rgba(25, 33, 94, 0.9),
              rgba(19, 25, 75, 0.95)
            ),
            url("/assets/legal-background.jpg")
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          boxShadow: '0 0 50px rgba(0,0,0,0.1)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(25, 33, 94, 0.2) 0%, rgba(19, 25, 75, 0.3) 100%)',
            backdropFilter: 'blur(2px)',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("/assets/pattern-overlay.png")',
            opacity: 0.1,
            mixBlendMode: 'overlay',
          }
        }}
      >
        <Box
          sx={{
            position: 'relative',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: { xs: '2rem', md: '0 5rem' },
            color: 'white',
            zIndex: 1,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Welcome Message */}
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 2,
                fontWeight: 500,
                color: '#e0e7ff',
                letterSpacing: '1px',
              }}
            >
              Welcome to
            </Typography>

            {/* Main Title */}
            <Typography 
              variant="h2" 
              sx={{ 
                mb: 3, 
                fontWeight: 700,
                background: 'linear-gradient(90deg, #fff 0%, #e0e7ff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Justice Portal
            </Typography>

            {/* Tagline */}
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 4,
                fontWeight: 400,
                color: '#e0e7ff',
                opacity: 0.9,
                lineHeight: 1.5,
              }}
            >
              Connect with expert lawyers and manage your legal journey efficiently
            </Typography>

            {/* Description */}
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 6,
                color: '#e0e7ff',
                opacity: 0.8,
                maxWidth: '500px',
                lineHeight: 1.8,
              }}
            >
              Join our trusted platform where legal professionals and clients come together. 
              Get expert guidance, secure communication, and streamlined case management all in one place.
            </Typography>

            {/* Key Features */}
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mt: 4 }}>
              {[
                { 
                  icon: <BalanceIcon />, 
                  text: 'Expert Legal Guidance',
                  description: 'Connect with qualified attorneys'
                },
                { 
                  icon: <SecurityIcon />, 
                  text: 'Secure & Confidential',
                  description: 'Your data is always protected'
                },
                { 
                  icon: <GroupIcon />, 
                  text: 'Professional Network',
                  description: 'Join our trusted community'
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                      background: 'rgba(255, 255, 255, 0.1)',
                      padding: '1.5rem',
                      borderRadius: '16px',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      transition: 'all 0.3s ease',
                      minWidth: '200px',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        background: 'rgba(255, 255, 255, 0.15)',
                      }
                    }}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1.5,
                      mb: 1
                    }}>
                      {React.cloneElement(item.icon, { 
                        sx: { fontSize: '24px', color: '#e0e7ff' } 
                      })}
                      <Typography sx={{ 
                        fontWeight: 600,
                        fontSize: '1.1rem'
                      }}>
                        {item.text}
                      </Typography>
                    </Box>
                    <Typography sx={{ 
                      opacity: 0.8,
                      fontSize: '0.9rem',
                      color: '#e0e7ff'
                    }}>
                      {item.description}
                    </Typography>
                  </Box>
                </motion.div>
              ))}
            </Box>

            {/* Trust Indicators */}
            <Box sx={{ 
              mt: 8, 
              display: 'flex', 
              gap: 4, 
              alignItems: 'center',
              opacity: 0.9
            }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff' }}>
                  1000+
                </Typography>
                <Typography sx={{ color: '#e0e7ff', fontSize: '0.9rem' }}>
                  Legal Professionals
                </Typography>
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff' }}>
                  5000+
                </Typography>
                <Typography sx={{ color: '#e0e7ff', fontSize: '0.9rem' }}>
                  Satisfied Clients
                </Typography>
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff' }}>
                  98%
                </Typography>
                <Typography sx={{ color: '#e0e7ff', fontSize: '0.9rem' }}>
                  Success Rate
                </Typography>
              </Box>
            </Box>
          </motion.div>
        </Box>
      </Box>

      {/* Right Side - Form Container */}
      <Box
        sx={{
          marginLeft: { xs: 0, md: '45%' },
          width: { xs: '100%', md: '55%' },
          minHeight: { xs: 'auto', md: '100vh' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: { xs: '1rem', md: '2rem' },
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("/assets/subtle-pattern.png")',
            opacity: 0.05,
          }
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: '600px',
            p: { xs: 2, md: 4 },
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
          }}
        >
          {/* Update form header */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700, 
                mb: 2,
                background: 'linear-gradient(90deg, #19215E 0%, #2A3178 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Create Your Account
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ opacity: 0.8 }}>
              Join our community of legal professionals and clients
            </Typography>
          </Box>

          {/* Update Stepper styling for mobile */}
          <Stepper 
            activeStep={activeStep} 
            orientation={window.innerWidth < 600 ? 'vertical' : 'horizontal'}
            sx={{ 
              mb: 4,
              '& .MuiStepLabel-root': {
                '& .MuiStepIcon-root': {
                  color: 'rgba(25, 33, 94, 0.3)',
                  '&.Mui-active': {
                    color: '#19215E',
                  },
                  '&.Mui-completed': {
                    color: '#19215E',
                  }
                },
                '& .MuiStepLabel-label': {
                  fontSize: { xs: '0.75rem', md: '0.875rem' },
                  fontWeight: 500,
                  '&.Mui-active': {
                    color: '#19215E',
                  }
                }
              }
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Update form fields styling */}
          <Box sx={{ 
            '& .MuiTextField-root': {
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#19215E',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#19215E',
                }
              }
            },
            '& .MuiButton-root': {
              borderRadius: '12px',
              textTransform: 'none',
              padding: '0.75rem 2rem',
              fontSize: '1rem',
              fontWeight: 500,
              boxShadow: 'none',
              '&.MuiButton-contained': {
                background: 'linear-gradient(90deg, #19215E 0%, #2A3178 100%)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #2A3178 0%, #19215E 100%)',
                }
              }
            }
          }}>
            <form onSubmit={handleRegistration}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {getStepContent(activeStep)}
                </motion.div>
              </AnimatePresence>

              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                mt: 4,
                pt: 2,
                borderTop: '1px solid #eee'
              }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  {...(activeStep === steps.length - 1
                    ? { type: 'submit', disabled: !formData.location }
                    : { onClick: handleNext }
                  )}
                  sx={{
                    px: 4,
                    py: 1,
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontSize: '1rem'
                  }}
                >
                  {activeStep === steps.length - 1 ? 'Register' : 'Next'}
                </Button>
              </Box>
            </form>
          </Box>
        </Paper>
      </Box>

      {/* Existing Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={registrationMessage.includes('successful') ? 'success' : 'error'}
        >
          {registrationMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Register;
