import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Avatar,
  Card,
  CardMedia,
  Chip,
  Fab,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Paper,
} from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EmailIcon from '@mui/icons-material/Email';
import SearchIcon from '@mui/icons-material/Search';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import CloseIcon from '@mui/icons-material/Close';
import HelpIcon from '@mui/icons-material/Help';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import styled from '@emotion/styled';

const ChatDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    width: '400px',
    maxHeight: '600px',
    borderRadius: '20px',
    background: '#fff',
  }
}));

const ChatMessage = styled(Paper)(({ theme, isUser }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  maxWidth: '80%',
  alignSelf: isUser ? 'flex-end' : 'flex-start',
  backgroundColor: isUser ? theme.palette.primary.main : '#f5f5f5',
  color: isUser ? '#fff' : 'inherit',
  borderRadius: '15px',
  boxShadow: 'none',
}));

const AvatarFab = styled(Fab)(({ theme }) => ({
  width: 60,
  height: 60,
  borderRadius: '50%',
  boxShadow: '0 4px 12px rgba(26, 35, 126, 0.2)',
  background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
  border: '2px solid #fff',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 16px rgba(26, 35, 126, 0.3)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#4CAF50',
    top: '5px',
    right: '5px',
    border: '2px solid #fff',
  }
}));

const MainPage = () => {
  const navigate = useNavigate();
  const username = Cookies.get('username');
  const userRole = Cookies.get('role');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [showBanner, setShowBanner] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      text: "Hello! I'm your AI Legal Assistant. I can help you with legal questions and provide general legal information. Please note that my responses are for informational purposes only and should not be considered as formal legal advice. How can I assist you today?", 
      isUser: false 
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPopMessage, setShowPopMessage] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopMessage(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { label: 'Success Rate', value: '94%', icon: <TrendingUpIcon />, trend: '+2%' },
    { label: 'Active Cases', value: '28', icon: <GavelIcon />, trend: '+5' },
    { label: 'Response Time', value: '2h', icon: <AccessTimeIcon />, trend: '-10m' },
  ];

  const clientActions = [
    {
      title: 'Add New Case',
      icon: <AddCircleOutlineIcon />,
      description: 'File a new case with our expert lawyers',
      path: '/add-case',
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=500&q=80'
    },
    {
      title: 'My Cases',
      icon: <GavelIcon />,
      description: 'Track and manage your ongoing cases',
      path: '/my-cases',
      image: 'https://images.unsplash.com/photo-1589578527966-fdac0f44566c?auto=format&fit=crop&w=500&q=80'
    },
    {
      title: 'Find Lawyers',
      icon: <SearchIcon />,
      description: 'Connect with specialized legal experts',
      path: '/lawyers',
      image: 'https://images.unsplash.com/photo-1521791055366-0d553872125f?auto=format&fit=crop&w=500&q=80'
    },
    {
      title: 'Messages',
      icon: <EmailIcon />,
      description: 'Communicate securely with your legal team',
      path: '/inbox',
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=500&q=80'
    }
  ];

  const lawyerActions = [
    {
      title: 'View Cases',
      icon: <AssignmentIcon />,
      description: 'Browse available cases and opportunities',
      path: '/all-cases',
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=500&q=80'
    },
    {
      title: 'My Cases',
      icon: <GavelIcon />,
      description: 'Manage your active case portfolio',
      path: '/my-cases',
      image: 'https://images.unsplash.com/photo-1589578527966-fdac0f44566c?auto=format&fit=crop&w=500&q=80'
    },
    {
      title: 'Client Requests',
      icon: <PeopleIcon />,
      description: 'Review and respond to client inquiries',
      path: '/lawyers',
      image: 'https://images.unsplash.com/photo-1521791055366-0d553872125f?auto=format&fit=crop&w=500&q=80'
    },
    {
      title: 'Messages',
      icon: <EmailIcon />,
      description: 'Communicate with clients securely',
      path: '/inbox',
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=500&q=80'
    }
  ];

  const actions = userRole === 'Lawyers/Attorneys' ? lawyerActions : clientActions;

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage = { text: currentMessage, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': 'AIzaSyCZiUKxF9xJVksHuYV1L5w1Fs9Q3uSePfM'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a legal assistant AI. Respond to this question: ${currentMessage}

              Format requirements:
              1. Start with a brief introduction paragraph
              2. For main points, use numbers followed by a period (1. 2. 3.)
              3. For sub-points, use letters followed by a period (a. b. c.)
              4. Use plain text only - no bold, italics, or special characters
              5. Separate paragraphs with single line breaks
              6. End with a simple legal disclaimer in a new paragraph
              
              Example format:
              [Brief introduction paragraph]

              Main points:
              1. First point
              2. Second point
                 a. Sub point
                 b. Sub point
              3. Third point

              [Closing paragraph]

              Legal Disclaimer: This information is for general guidance only.`
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        let cleanedText = data.candidates[0].content.parts[0].text
          .replace(/[""]/g, '"')
          .replace(/['']/g, "'")
          .replace(/[•●■*_~`]/g, '')
          .replace(/\*\*/g, '')
          .replace(/\n\s*\n\s*\n/g, '\n\n')
          .trim();
        
        const botResponse = { 
          text: cleanedText, 
          isUser: false 
        };
        setMessages(prev => [...prev, botResponse]);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        text: "I apologize, but I'm having trouble connecting to the AI service. Please try again in a moment.", 
        isUser: false 
      }]);
    }

    setIsLoading(false);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: '#f8fafc',
      position: 'relative',
      overflowX: 'hidden',
      overflowY: 'auto'
    }}>
      {/* Welcome Banner */}
      {showBanner && (
        <Box
          sx={{
            position: 'relative',
            bgcolor: '#1a237e',
            color: 'white',
            py: 1.5,
            px: 2,
            textAlign: 'center',
            zIndex: 10,
            width: '100%'
          }}
        >
          <Container maxWidth="lg" sx={{ position: 'relative' }}>
            <Typography variant="body1" sx={{ display: 'inline-block', mr: 2 }}>
              🎉 Welcome to the new Justice Portal! Explore our enhanced features for better legal services.
            </Typography>
            <Button
              variant="outlined"
              size="small"
              sx={{
                color: 'white',
                borderColor: 'rgba(255,255,255,0.5)',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)',
                }
              }}
            >
              Learn More
            </Button>
            <IconButton
              size="small"
              onClick={() => setShowBanner(false)}
              sx={{
                position: 'absolute',
                right: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)',
                }
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Container>
        </Box>
      )}

      {/* Feature Highlights */}
      <Box 
        sx={{ 
          bgcolor: 'white',
          py: 4,
          borderBottom: '1px solid rgba(0,0,0,0.1)',
          position: 'relative',
          zIndex: 1,
          width: '100%'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: 'rgba(26, 35, 126, 0.08)',
                    color: '#1a237e',
                    width: 56,
                    height: 56
                  }}
                >
                  <SecurityIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Secure Platform
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    End-to-end encryption for all communications
              </Typography>
            </Box>
              </Box>
    </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
          sx={{ 
                    bgcolor: 'rgba(26, 35, 126, 0.08)',
                    color: '#1a237e',
                    width: 56,
                    height: 56
                  }}
                >
                  <SpeedIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Fast Processing
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Quick response time for all legal matters
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
            sx={{ 
                    bgcolor: 'rgba(26, 35, 126, 0.08)',
                    color: '#1a237e',
                    width: 56,
                    height: 56
                  }}
                >
                  <PeopleIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Expert Support
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Access to verified legal professionals
          </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          opacity: 0.4,
          background: `
            radial-gradient(circle at 20% 35%, rgba(26, 35, 126, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 75% 44%, rgba(26, 35, 126, 0.08) 0%, transparent 40%),
            radial-gradient(circle at 50% 80%, rgba(26, 35, 126, 0.08) 0%, transparent 60%),
            linear-gradient(45deg, rgba(26, 35, 126, 0.02) 0%, transparent 100%)
          `,
          pointerEvents: 'none'
        }}
      />

      {/* Hero Section */}
      <Box 
        className="hero-section"
        sx={{ 
          position: 'relative',
          height: '70vh',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden'
        }}
      >
        <Box
          className="hero-background"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url(https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=1500&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            animation: 'zoom 20s ease-in-out infinite'
          }}
        />
        {/* Hero content */}
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={7}>
              <Typography 
                variant="h2" 
              sx={{ 
                  color: 'white',
                  fontWeight: 800,
                  mb: 2,
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  lineHeight: 1.2,
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -10,
                    left: 0,
                    width: 80,
                    height: 4,
                    background: 'linear-gradient(to right, white, transparent)',
                  }
                }}
              >
                Welcome back,<br/>{username}
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  color: 'rgba(255,255,255,0.9)',
                  mb: 4,
                  maxWidth: 600,
                  lineHeight: 1.4
                }}
              >
                {userRole === 'Lawyers/Attorneys' 
                  ? "Manage your cases and connect with clients through our secure platform"
                  : "Access expert legal assistance and track your cases with ease"}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate(actions[0].path)}
                  sx={{
                    bgcolor: 'white',
                    color: '#1a237e',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.9)',
                      transform: 'translateY(-2px)',
                    }
                  }}
                >
                  {actions[0].title}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.5)',
                    px: 4,
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)',
                      transform: 'translateY(-2px)',
                    }
                  }}
                >
                  Learn More
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {stats.map((stat, index) => (
                  <Box
                    key={index}
                    sx={{
                      flex: 1,
                      minWidth: 180,
                      p: 3,
                      bgcolor: 'rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: 2,
                      color: 'white',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        bgcolor: 'rgba(255,255,255,0.15)',
                        '&::after': {
                          transform: 'rotate(25deg) translateX(120%)',
                        }
                      },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: -10,
                        left: -100,
                        width: '80%',
                        height: '200%',
                        background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent)',
                        transform: 'rotate(25deg) translateX(-120%)',
                        transition: 'transform 0.5s ease',
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      {stat.icon}
                      <Typography variant="body2" sx={{ ml: 1, opacity: 0.8 }}>
                        {stat.label}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, mr: 1 }}>
                        {stat.value}
                      </Typography>
                      <Chip
                        label={stat.trend}
                        size="small"
                        sx={{
                          bgcolor: stat.trend.includes('+') ? 'rgba(76,175,80,0.3)' : 'rgba(244,67,54,0.3)',
                          color: 'white',
                          height: 20,
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Main Content - Quick Action Cards */}
      <Container maxWidth="lg" sx={{ mt: -8, position: 'relative', zIndex: 2, pb: 8 }}>
        <Grid container spacing={3}>
          {actions.map((action, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => navigate(action.path)}
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-12px) scale(1.02)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="220"
                  image={action.image}
                  alt={action.title}
                  sx={{
                    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: hoveredCard === index ? 'scale(1.15)' : 'scale(1)',
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(26,35,126,0.9) 100%)',
                          p: 3,
                          display: 'flex',
                          flexDirection: 'column',
                    justifyContent: 'flex-end',
                    color: 'white',
                          transition: 'all 0.3s ease',
                    opacity: hoveredCard === index ? 1 : 0.95,
                  }}
                >
                  <Avatar
                          sx={{
                      bgcolor: 'rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(10px)',
                            mb: 2,
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      transform: hoveredCard === index ? 'scale(1.2) rotate(10deg)' : 'scale(1)',
                    }}
                  >
                    {action.icon}
                  </Avatar>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600, 
                      mb: 1,
                      transform: hoveredCard === index ? 'translateX(8px)' : 'translateX(0)',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {action.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      opacity: hoveredCard === index ? 1 : 0,
                      transform: hoveredCard === index ? 'translateY(0)' : 'translateY(20px)',
                      transition: 'all 0.4s ease',
                    }}
                  >
                    {action.description}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Additional Features Section */}
      <Box sx={{ bgcolor: 'white', py: 8, mt: 4 }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h3" 
            sx={{ 
              textAlign: 'center', 
              mb: 6, 
              fontWeight: 800,
              background: 'linear-gradient(45deg, #1a237e 30%, #283593 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Why Choose Justice Portal
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box 
                sx={{ 
                  p: 4, 
                  borderRadius: 4,
                  height: '100%',
                  background: 'linear-gradient(135deg, rgba(26, 35, 126, 0.03) 0%, rgba(26, 35, 126, 0.08) 100%)',
                  transition: 'transform 0.3s ease',
                            '&:hover': {
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#1a237e' }}>
                  Advanced Case Management
                </Typography>
                <Grid container spacing={2}>
                  {[
                    'Real-time case status updates',
                    'Document management system',
                    'Automated deadline reminders',
                    'Case history tracking',
                    'Priority case flagging'
                  ].map((feature, index) => (
                    <Grid item xs={12} key={index}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box 
                          sx={{ 
                            width: 24, 
                            height: 24, 
                            borderRadius: '50%', 
                            bgcolor: 'rgba(26, 35, 126, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#1a237e',
                            fontSize: '0.8rem',
                            fontWeight: 600
                          }}
                        >
                          {index + 1}
                        </Box>
                        <Typography>{feature}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box 
                sx={{ 
                  p: 4, 
                  borderRadius: 4,
                  height: '100%',
                  background: 'linear-gradient(135deg, rgba(26, 35, 126, 0.03) 0%, rgba(26, 35, 126, 0.08) 100%)',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#1a237e' }}>
                  Client-Lawyer Collaboration
                </Typography>
                <Grid container spacing={2}>
                  {[
                    'Secure messaging platform',
                    'Video consultation scheduling',
                    'Document sharing & e-signatures',
                    'Client feedback system',
                    'Multi-language support'
                  ].map((feature, index) => (
                    <Grid item xs={12} key={index}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box 
                          sx={{ 
                            width: 24, 
                            height: 24, 
                            borderRadius: '50%', 
                            bgcolor: 'rgba(26, 35, 126, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#1a237e',
                            fontSize: '0.8rem',
                            fontWeight: 600
                          }}
                        >
                          {index + 1}
                        </Box>
                        <Typography>{feature}</Typography>
                      </Box>
                  </Grid>
                ))}
              </Grid>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box 
                sx={{ 
                  mt: 4, 
                  p: 4, 
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
                  color: 'white',
                  textAlign: 'center'
                }}
              >
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                  Ready to Experience Better Legal Services?
                </Typography>
                <Typography sx={{ mb: 3, opacity: 0.9 }}>
                  Join thousands of satisfied clients and lawyers using our platform
                </Typography>
                <Button 
                  variant="contained" 
                  size="large"
                  sx={{
                    bgcolor: 'white',
                    color: '#1a237e',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.9)',
                    }
                  }}
                >
                  Get Started Today
                </Button>
              </Box>
            </Grid>
          </Grid>
    </Container>
      </Box>

      {/* AI Lawyer Avatar Button */}
      <Box sx={{ position: 'fixed', bottom: 24, right: 24 }}>
        {showPopMessage && !isChatOpen && (
          <Box
            sx={{
              position: 'absolute',
              top: -40,
              right: 0,
              backgroundColor: '#fff',
              borderRadius: '12px',
              padding: '6px 12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              animation: 'popIn 0.3s ease-out',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '-6px',
                right: '20px',
                width: '12px',
                height: '12px',
                backgroundColor: '#fff',
                transform: 'rotate(45deg)',
                boxShadow: '2px 2px 2px rgba(0,0,0,0.05)',
              }
            }}
          >
            <Typography variant="caption" sx={{ whiteSpace: 'nowrap', fontWeight: 500 }}>
              Need legal help?
            </Typography>
          </Box>
        )}
        <AvatarFab
          onClick={() => {
            setIsChatOpen(true);
            setShowPopMessage(false);
          }}
          sx={{
            width: 60,
            height: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '&::before': {
              content: '""',
              position: 'absolute',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#4CAF50',
              top: '5px',
              right: '5px',
              border: '2px solid #fff',
            }
          }}
        >
          <Avatar
            sx={{
              width: 50,
              height: 50,
              bgcolor: 'transparent',
            }}
            src="https://img.freepik.com/premium-vector/robot-icon-chat-bot-sign-support-service-concept-chatbot-character-flat-style_41737-795.jpg"
            alt="AI Lawyer"
          >
            <GavelIcon sx={{ fontSize: 30 }} />
          </Avatar>
        </AvatarFab>
      </Box>

      {/* Chat Dialog */}
      <ChatDialog open={isChatOpen} onClose={() => setIsChatOpen(false)}>
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: '1px solid #eee',
          pb: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{ width: 36, height: 36 }}
              src="https://img.freepik.com/premium-vector/robot-icon-chat-bot-sign-support-service-concept-chatbot-character-flat-style_41737-795.jpg"
              alt="AI Lawyer"
            >
              <GavelIcon sx={{ fontSize: 24 }} />
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>AI Legal Assistant</Typography>
              <Typography variant="caption" color="text.secondary">Online</Typography>
            </Box>
          </Box>
          <IconButton onClick={() => setIsChatOpen(false)} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          p: 2,
          height: '500px'
        }}>
          <Box sx={{ 
            flexGrow: 1, 
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            mb: 2
          }}>
            {messages.map((message, index) => (
              <ChatMessage key={index} isUser={message.isUser}>
                <Typography>{message.text}</Typography>
              </ChatMessage>
            ))}
            {isLoading && (
              <ChatMessage isUser={false}>
                <Typography>Thinking...</Typography>
              </ChatMessage>
            )}
          </Box>
          <Box sx={{ 
            display: 'flex', 
            gap: 1,
            borderTop: '1px solid #eee',
            pt: 2
          }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Ask a legal question..."
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              size="small"
            />
            <IconButton 
              color="primary" 
              onClick={handleSendMessage}
              disabled={isLoading || !currentMessage.trim()}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </DialogContent>
      </ChatDialog>

      {/* Global Styles */}
      <style>
        {`
          @keyframes backgroundShift {
            0% {
              background-position: 0% 0%;
            }
            100% {
              background-position: 100% 100%;
            }
          }
          
          @keyframes float {
            0%, 100% {
              transform: translateY(0) rotate(0deg);
            }
            50% {
              transform: translateY(-20px) rotate(5deg);
            }
          }
          
          @keyframes pulse {
            0%, 100% {
              opacity: 0.15;
            }
            50% {
              opacity: 0.2;
            }
          }
          
          @keyframes popIn {
            0% {
              transform: scale(0.8);
              opacity: 0;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}
      </style>
    </Box>
  );
};

export default MainPage;