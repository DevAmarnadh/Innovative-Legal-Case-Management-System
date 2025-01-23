import React, { useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
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
  Grid,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import GavelIcon from '@mui/icons-material/Gavel';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import '../css/Login.css';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const theme = useTheme();

  const handleLogin = async (e) => {
    e.preventDefault();

    const usersCollectionRef = collection(db, 'users');
    const lowerCaseIdentifier = identifier.toLowerCase();
    const usernameQuery = query(usersCollectionRef, where('username', '==', lowerCaseIdentifier)); // Query for username
    const emailQuery = query(usersCollectionRef, where('email', '==', lowerCaseIdentifier)); // Query for email

    try {
      const usernameSnapshot = await getDocs(usernameQuery);
      const emailSnapshot = await getDocs(emailQuery);

      if (!usernameSnapshot.empty || !emailSnapshot.empty) {
        const userDoc = !usernameSnapshot.empty ? usernameSnapshot.docs[0].data() : emailSnapshot.docs[0].data(); // Check both username and email
        if (userDoc.password === password) {
          setLoginMessage('Authenticating...');
          Cookies.set('username', userDoc.username); // Set username
          const userRole = userDoc.role.substring(5);
          Cookies.set('role', userRole);
          Cookies.set('email', userDoc.email);
          setTimeout(() => {
            window.location.href = '/MainPage';
          }, 100);
        } else {
          setLoginMessage('Invalid credentials. Please try again.');
          setOpenSnackbar(true);
        }
      } else {
        setLoginMessage('Invalid credentials or user not registered. Please try again.');
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setLoginMessage('An error occurred during login. Please try again later.');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      display: 'flex',
      background: 'linear-gradient(135deg, #f6f9fc 0%, #eef2f7 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Left Side - Background and Content */}
      <Box
        sx={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: '45%',
          height: '100vh',
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
            padding: '0 5rem',
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
              Welcome back to
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
              Your Gateway to Legal Excellence
            </Typography>

            {/* Features */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 6 }}>
              {[
                {
                  icon: <GavelIcon />,
                  title: 'Expert Legal Services',
                  description: 'Access top-tier legal expertise'
                },
                {
                  icon: <SecurityIcon />,
                  title: 'Secure & Confidential',
                  description: 'Your data is encrypted and protected'
                },
                {
                  icon: <SpeedIcon />,
                  title: 'Efficient Process',
                  description: 'Quick and streamlined legal solutions'
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 3,
                      background: 'rgba(255, 255, 255, 0.1)',
                      padding: '1.5rem',
                      borderRadius: '16px',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateX(10px)',
                        background: 'rgba(255, 255, 255, 0.15)',
                      }
                    }}
                  >
                    <Box sx={{ 
                      p: 1.5,
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.2)',
                    }}>
                      {React.cloneElement(feature.icon, { 
                        sx: { fontSize: '28px', color: '#fff' } 
                      })}
                    </Box>
                    <Box>
                      <Typography sx={{ 
                        fontWeight: 600,
                        fontSize: '1.1rem',
                        mb: 0.5
                      }}>
                        {feature.title}
                      </Typography>
                      <Typography sx={{ 
                        opacity: 0.9,
                        fontSize: '0.9rem'
                      }}>
                        {feature.description}
                      </Typography>
                    </Box>
                  </Box>
                </motion.div>
              ))}
            </Box>

            {/* Quote */}
            <Box sx={{ mt: 8, borderLeft: '4px solid rgba(255,255,255,0.2)', pl: 4 }}>
              <Typography sx={{ 
                fontStyle: 'italic', 
                color: '#e0e7ff',
                opacity: 0.9,
                fontSize: '1.1rem',
                lineHeight: 1.6
              }}>
                "Justice is the constant and perpetual will to allot to every man his due."
              </Typography>
              <Typography sx={{ 
                color: '#e0e7ff',
                opacity: 0.7,
                mt: 1
              }}>
                - Justinian I
              </Typography>
            </Box>
          </motion.div>
        </Box>
      </Box>

      {/* Right Side - Login Form */}
      <Box
        sx={{
          marginLeft: '45%',
          width: '55%',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
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
            maxWidth: '500px',
            p: 4,
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 120, delay: 0.2 }}
              >
                <IconButton
                  sx={{
                    background: 'linear-gradient(90deg, #19215E 0%, #2A3178 100%)',
                    color: 'white',
                    width: 70,
                    height: 70,
                    mb: 3,
                    '&:hover': {
                      background: 'linear-gradient(90deg, #2A3178 0%, #19215E 100%)',
                    }
                  }}
                >
                  <GavelIcon sx={{ fontSize: 35 }} />
                </IconButton>
              </motion.div>

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
                Welcome Back
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ opacity: 0.8 }}>
                Sign in to continue your legal journey
              </Typography>
            </Box>

            <form onSubmit={handleLogin}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Email or Username"
                  autoComplete="email"
                  autoFocus
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#19215E',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#19215E',
                      }
                    }
                  }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Password"
                  type={passwordVisible ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#19215E',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#19215E',
                      }
                    }
                  }}
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
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3,
                    mb: 2,
                    py: 1.5,
                    borderRadius: '12px',
                    background: 'linear-gradient(90deg, #19215E 0%, #2A3178 100%)',
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 500,
                    '&:hover': {
                      background: 'linear-gradient(90deg, #2A3178 0%, #19215E 100%)',
                    }
                  }}
                >
                  Sign In
                </Button>
              </motion.div>
            </form>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Button
                  onClick={() => window.location.href = '/register'}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    color: '#19215E',
                    '&:hover': {
                      background: 'rgba(25, 33, 94, 0.05)',
                    }
                  }}
                >
                  Register now
                </Button>
              </Typography>
            </Box>
          </motion.div>
        </Paper>
      </Box>

      {/* Snackbar */}
      <AnimatePresence>
        {openSnackbar && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            <Snackbar
              open={openSnackbar}
              autoHideDuration={3000}
              onClose={handleCloseSnackbar}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
              <Alert
                onClose={handleCloseSnackbar}
                severity={loginMessage.includes('successful') ? 'success' : 'error'}
                sx={{ 
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}
              >
                {loginMessage}
              </Alert>
            </Snackbar>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default Login;
