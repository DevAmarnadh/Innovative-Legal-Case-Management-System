import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Snackbar, IconButton, Avatar, Dialog, DialogTitle, DialogContent, TextField, Paper, Typography } from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { styled } from '@mui/material/styles';
import Fab from '@mui/material/Fab';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MainPage from './components/MainPage';
import AddCasePage from './components/AddCasePage';
import NavBar from './components/NavBar';
import AllCases from './components/AllCases';
import Cookies from 'js-cookie';
import Register from './components/Register';
import Login from './components/Login';
import MyCases from './components/MyCases';
import Inbox from './components/Inbox';
import ClientRequests from './components/ClientRequests';
import Profile from './components/Profile';
import SecretPage from './components/SecretPage';
import Loader from './components/Loader';
import ContactForm from './components/ContactForm';
import LandingPage from './components/LandingPage';
import Footer from './components/Footer';

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
  position: 'relative',
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

const App = () => {
  const isLoggedIn = Cookies.get('username') !== undefined;
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [buffer, setBuffer] = useState('');
  const cheatCode = 'leavemealone';
  
  // AI Assistant states
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showPopMessage, setShowPopMessage] = useState(true);
  const [messages, setMessages] = useState([
    { 
      text: "Hello! I'm your AI Legal Assistant. I can help you with legal questions and provide general legal information. Please note that my responses are for informational purposes only and should not be considered as formal legal advice. How can I assist you today?", 
      isUser: false 
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Update current path when it changes
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Pages where AI Assistant should not appear
  const excludedPaths = ['/', '/login', '/register'];

  const theme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#1a237e',
        light: '#534bae',
        dark: '#000051',
      },
      secondary: {
        main: '#c5cae9',
        light: '#f8fdff',
        dark: '#9499b7',
      },
      background: {
        default: '#f5f5f5',
        paper: '#ffffff',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
        fontSize: '2.5rem',
        marginBottom: '1rem',
      },
      h2: {
        fontWeight: 600,
        fontSize: '2rem',
        marginBottom: '0.75rem',
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.6,
        marginBottom: '1rem',
      },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            padding: '0.5rem 0',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            padding: '8px 24px',
            margin: '0.5rem',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            margin: '1rem 0',
            padding: '1rem',
          },
        },
      },
      MuiContainer: {
        styleOverrides: {
          root: {
            padding: '2rem 1rem',
          },
        },
      },
    },
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const newBuffer = (buffer + event.key).slice(-cheatCode.length);
      setBuffer(newBuffer);
      
      if (newBuffer === cheatCode) {
        const audio = new Audio(require('../src/cheat_sound.mp3'));
        audio.play();
        setOpenSnackbar(true);
        setTimeout(() => {
          window.location.href = "/secret-page";
        }, 2000);
        setBuffer('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [buffer]);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopMessage(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

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
              6. End with a simple legal disclaimer in a new paragraph`
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

  if (showLoader) {
    return <Loader />;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          {isLoggedIn && <NavBar />}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              pt: isLoggedIn ? { xs: 8, sm: 9 } : 0,
              pb: 3,
              overflow: 'hidden',
            }}
          >
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/MainPage" element={isLoggedIn ? <MainPage /> : <Navigate to="/" />} />
              <Route path="/add-case" element={isLoggedIn ? <AddCasePage /> : <Navigate to="/" />} />
              <Route path="/all-cases" element={isLoggedIn ? <AllCases /> : <Navigate to="/" />} />
              <Route path="/my-cases" element={isLoggedIn ? <MyCases /> : <Navigate to="/" />} />
              <Route path="/inbox" element={isLoggedIn ? <Inbox /> : <Navigate to="/" />} />
              <Route path="/lawyers" element={isLoggedIn ? <ClientRequests /> : <Navigate to="/" />} />
              <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/" />} />
              <Route path="/contact" element={isLoggedIn ? <ContactForm /> : <Navigate to="/" />} />
              <Route path="/secret-page" element={isLoggedIn ? <SecretPage /> : <Navigate to="/" />} />
            </Routes>
          </Box>
          {isLoggedIn && <Footer />}

          {/* AI Legal Assistant - Only show on allowed pages */}
          {isLoggedIn && !excludedPaths.includes(currentPath) && (
            <>
              <Box sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000 }}>
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
                <Box sx={{ position: 'relative' }}>
                  <AvatarFab
                    onClick={() => {
                      setIsChatOpen(true);
                      setShowPopMessage(false);
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
              </Box>

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

                  @keyframes pulse {
                    0% {
                      transform: scale(1);
                      opacity: 1;
                    }
                    50% {
                      transform: scale(1.1);
                      opacity: 0.8;
                    }
                    100% {
                      transform: scale(1);
                      opacity: 1;
                    }
                  }
                `}
              </style>
            </>
          )}
          <Snackbar
            open={openSnackbar}
            autoHideDuration={3000}
            onClose={handleCloseSnackbar}
            message="Cheat activated!"
            sx={{
              '& .MuiSnackbarContent-root': {
                bgcolor: 'primary.main',
                color: 'white',
                borderRadius: 2,
              }
            }}
          />
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;