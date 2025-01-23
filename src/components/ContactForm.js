import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  IconButton,
  InputAdornment,
  Alert,
  Snackbar,
  Grid,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import SubjectIcon from '@mui/icons-material/Subject';
import MessageIcon from '@mui/icons-material/Message';
import SendIcon from '@mui/icons-material/Send';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import { motion, AnimatePresence } from 'framer-motion';

const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: '#fff',
  padding: theme.spacing(4),
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 50% 50%, rgba(26, 35, 126, 0.03) 0%, rgba(26, 35, 126, 0) 50%)',
    animation: 'pulse 15s ease-in-out infinite',
  },
  '@keyframes pulse': {
    '0%': {
      transform: 'scale(1)',
      opacity: 0.5,
    },
    '50%': {
      transform: 'scale(1.5)',
      opacity: 0.8,
    },
    '100%': {
      transform: 'scale(1)',
      opacity: 0.5,
    },
  },
}));

const ContactCard = styled(motion(Paper))(({ theme }) => ({
  width: '100%',
  maxWidth: 1200,
  margin: '0 auto',
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  borderRadius: theme.spacing(4),
  overflow: 'hidden',
  boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
  },
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
    pointerEvents: 'none',
  },
}));

const InfoSection = styled(motion(Box))(({ theme }) => ({
  background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
  padding: theme.spacing(8),
  color: 'white',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
  },
}));

const FormSection = styled(motion(Box))(({ theme }) => ({
  padding: theme.spacing(8),
  background: '#fff',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'radial-gradient(circle at 30% 30%, rgba(26, 35, 126, 0.02) 0%, rgba(26, 35, 126, 0) 70%)',
    pointerEvents: 'none',
  },
}));

const InputField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(2),
    backgroundColor: '#F8FAFC',
    border: '1px solid #E2E8F0',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      backgroundColor: '#F1F5F9',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    },
    '&.Mui-focused': {
      backgroundColor: '#fff',
      border: '1px solid #1a237e',
      boxShadow: '0 0 0 3px rgba(26, 35, 126, 0.1)',
      transform: 'translateY(-2px)',
    }
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none'
  },
  '& .MuiInputLabel-root': {
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  '& .MuiInputLabel-shrink': {
    transform: 'translate(14px, -12px) scale(0.75)',
  },
  '& .MuiInputAdornment-root': {
    '& .MuiSvgIcon-root': {
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
  '&:hover .MuiInputAdornment-root .MuiSvgIcon-root': {
    transform: 'scale(1.1)',
  },
}));

const SendButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  padding: theme.spacing(1.5, 4),
  fontSize: '1rem',
  textTransform: 'none',
  fontWeight: 600,
  background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
  boxShadow: '0 8px 16px rgba(26, 35, 126, 0.2)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    boxShadow: '0 12px 24px rgba(26, 35, 126, 0.3)',
    transform: 'translateY(-2px)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)',
    transform: 'rotate(45deg)',
    animation: 'shimmer 3s infinite',
  },
  '@keyframes shimmer': {
    '0%': {
      transform: 'translate(-100%, -100%) rotate(45deg)',
    },
    '100%': {
      transform: 'translate(100%, 100%) rotate(45deg)',
    },
  },
}));

const FeatureItem = styled(motion(Box))(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(4),
  position: 'relative',
  zIndex: 1,
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  background: 'rgba(255,255,255,0.05)',
  backdropFilter: 'blur(8px)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    background: 'rgba(255,255,255,0.1)',
    transform: 'translateX(10px)',
  },
}));

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'contacts'), {
        ...formData,
        timestamp: new Date()
      });
      
      setSnackbar({
        open: true,
        message: 'Message sent successfully!',
        severity: 'success'
      });

      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error sending message. Please try again.',
        severity: 'error'
      });
      console.error('Error adding document: ', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const featureVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
    <PageContainer>
      <ContactCard
        component={motion.div}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        elevation={0}
      >
        <InfoSection>
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20 
              }}
            >
              <ContactSupportIcon sx={{ fontSize: 48, mb: 4 }} />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 3 }}>
                Let's Talk
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Typography variant="body1" sx={{ mb: 6, opacity: 0.9 }}>
                We're here to help and answer any question you might have.
              </Typography>
            </motion.div>

            <Box>
              <FeatureItem
                variants={featureVariants}
                custom={0}
                initial="hidden"
                animate="visible"
              >
                <Box sx={{ 
                  width: 48, 
                  height: 48, 
                  borderRadius: 2, 
                  bgcolor: 'rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(8px)',
                }}>
                  <MessageIcon />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Quick Response
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Our team typically responds within 24 hours
                  </Typography>
                </Box>
              </FeatureItem>

              <FeatureItem
                variants={featureVariants}
                custom={1}
                initial="hidden"
                animate="visible"
              >
                <Box sx={{ 
                  width: 48, 
                  height: 48, 
                  borderRadius: 2, 
                  bgcolor: 'rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(8px)',
                }}>
                  <PersonIcon />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Dedicated Support
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Get personalized assistance for your queries
                  </Typography>
                </Box>
              </FeatureItem>
            </Box>
          </Box>
        </InfoSection>

        <FormSection
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Send a Message
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Fill out the form below and we'll get back to you shortly.
            </Typography>
          </motion.div>

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <InputField
                  fullWidth
                  name="name"
                  label="Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputField
                  fullWidth
                  name="email"
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <InputField
              fullWidth
              name="subject"
              label="Subject"
              value={formData.subject}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SubjectIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />

            <InputField
              fullWidth
              name="message"
              label="Message"
              multiline
              rows={4}
              value={formData.message}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ mt: 2 }}>
                    <MessageIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />

            <SendButton
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              endIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
              sx={{ mt: 2 }}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </SendButton>
          </Box>
        </FormSection>
      </ContactCard>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        TransitionComponent={motion.div}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ 
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            backdropFilter: 'blur(8px)',
          }}
          icon={snackbar.severity === 'success' ? <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 360, 360]
            }}
            transition={{ duration: 0.5 }}
          >
            <SendIcon />
          </motion.div> : undefined}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default ContactForm;
