import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  useTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  Rating,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import DescriptionIcon from '@mui/icons-material/Description';
import HandshakeIcon from '@mui/icons-material/Handshake';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Footer from './Footer';
import { styled, keyframes } from '@mui/material/styles';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 0.5; }
  100% { transform: scale(1); opacity: 0.8; }
`;

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const StyledCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  borderRadius: '8px',
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(120deg, rgba(255,255,255,0) 30%, rgba(255,255,255,.8), rgba(255,255,255,0) 70%)',
    animation: `${shimmer} 3s infinite linear`,
  },
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 48px 0 rgba(31, 38, 135, 0.25)',
  }
}));

const FloatingElement = styled(Box)(({ delay = 0 }) => ({
  position: 'absolute',
  width: '150px',
  height: '150px',
  background: 'rgba(255, 255, 255, 0.1)',
  borderRadius: '50%',
  animation: `${float} 6s ease-in-out infinite`,
  animationDelay: `${delay}s`,
}));

const PulsingCircle = styled(Box)(({ delay = 0, size = 100 }) => ({
  position: 'absolute',
  width: size + 'px',
  height: size + 'px',
  background: 'rgba(255, 255, 255, 0.1)',
  borderRadius: '50%',
  animation: `${pulse} 4s ease-in-out infinite`,
  animationDelay: `${delay}s`,
}));

const TestimonialCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '12px',
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 48px 0 rgba(31, 38, 135, 0.25)',
  }
}));

const LandingPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const testimonialsRef = collection(db, 'feedback');
        const snapshot = await getDocs(testimonialsRef);
        const fetchedTestimonials = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTestimonials(fetchedTestimonials);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTestimonials();
  }, []);

  const faqItems = [
    {
      question: "How does the consultation process work?",
      answer: "Our consultation process is simple and efficient. First, create an account and submit your case details. You'll be matched with qualified lawyers who will review your case and provide initial consultation. You can then choose the lawyer you feel most comfortable with."
    },
    {
      question: "What types of cases do you handle?",
      answer: "We handle a wide range of legal matters including family law, corporate law, criminal defense, real estate, constitutional law, and civil rights cases. Our platform connects you with specialized lawyers in each field."
    },
    {
      question: "How are the lawyers verified?",
      answer: "All lawyers on our platform undergo a rigorous verification process. We check their credentials, bar association membership, practice history, and client feedback to ensure they meet our high standards."
    },
    {
      question: "What are the fees involved?",
      answer: "Fees vary depending on the type and complexity of your case. Many lawyers offer free initial consultations. All fee structures are transparent and will be discussed upfront before any engagement begins."
    }
  ];

  return (
      <Box
        sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
          position: 'relative',
        bgcolor: '#f5f5f5',
          overflow: 'hidden',
      }}
    >
      <Box sx={{ flex: '1 0 auto' }}>
        {/* Hero Section */}
        <Box sx={{ 
          bgcolor: '#1a237e',
              color: 'white',
          py: { xs: 8, md: 12 },
              textAlign: 'center',
          backgroundImage: 'linear-gradient(rgba(26, 35, 126, 0.9), rgba(26, 35, 126, 0.9)), url("/assets/image.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <FloatingElement sx={{ top: '10%', left: '5%' }} />
          <FloatingElement sx={{ top: '60%', right: '10%' }} delay={2} />
          <PulsingCircle sx={{ bottom: '10%', left: '15%' }} delay={1} size={120} />
          <PulsingCircle sx={{ top: '20%', right: '15%' }} delay={2} size={80} />
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                mb: 3,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                }}
              >
                Justice Portal
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  opacity: 0.9,
                maxWidth: '800px',
                mx: 'auto',
                }}
              >
                Your Gateway to Legal Excellence - Professional Legal Services at Your Fingertips
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{
                    bgcolor: 'white',
                    color: '#1a237e',
                    '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.9)',
                    },
                  px: 4,
                  }}
                >
                Get Started
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{
                    color: 'white',
                    borderColor: 'white',
                    '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)',
                  },
                  px: 4,
                  }}
                >
                  Sign In
                </Button>
          </Box>
        </Container>
      </Box>

        {/* How It Works Section */}
        <Box sx={{ 
          py: 8, 
          bgcolor: 'white',
          position: 'relative',
            overflow: 'hidden',
        }}>
          <PulsingCircle sx={{ top: '10%', left: '5%' }} delay={1.5} size={100} />
          <PulsingCircle sx={{ bottom: '10%', right: '5%' }} delay={2.5} size={150} />
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
            <Typography
              variant="h3"
              align="center"
              sx={{
                fontWeight: 700,
                mb: 6,
                        color: '#1a237e',
            }}
          >
            How It Works
          </Typography>
            <Grid container spacing={4}>
            {[
              {
                  icon: <PersonIcon sx={{ fontSize: 40, color: '#1a237e' }} />,
                title: 'Create Account',
                description: 'Quick and easy registration process',
              },
              {
                  icon: <DescriptionIcon sx={{ fontSize: 40, color: '#1a237e' }} />,
                title: 'Submit Case',
                description: 'Describe your legal requirements',
              },
              {
                  icon: <HandshakeIcon sx={{ fontSize: 40, color: '#1a237e' }} />,
                title: 'Connect',
                description: 'Get matched with expert lawyers',
              },
            ].map((step, index) => (
              <Grid item xs={12} md={4} key={index}>
                  <StyledCard>
                    <Box sx={{ mb: 2 }}>
                    {step.icon}
                    </Box>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#1a237e' }}>
                    {step.title}
                  </Typography>
                    <Typography color="text.secondary">
                    {step.description}
                  </Typography>
                  </StyledCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

        {/* Our Impact Section */}
        <Box sx={{ 
          py: 8, 
          bgcolor: '#f5f5f5',
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: 'linear-gradient(rgba(26, 35, 126, 0.92), rgba(26, 35, 126, 0.92)), url("/Assets/image.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          color: 'white',
        }}>
          <FloatingElement sx={{ bottom: '20%', left: '10%' }} delay={1} />
          <FloatingElement sx={{ top: '30%', right: '5%' }} delay={3} />
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
            <Typography
              variant="h3"
              align="center"
              sx={{
                fontWeight: 700,
                mb: 6,
                color: 'white',
              }}
            >
              Our Impact
            </Typography>
            <Grid container spacing={4}>
              {[
                {
                  metric: '98%',
                  label: 'Success Rate',
                  description: 'Cases resolved successfully',
                },
                {
                  metric: '50K+',
                  label: 'Cases Handled',
                  description: 'Across various legal domains',
                },
                {
                  metric: '30K+',
                  label: 'Happy Clients',
                  description: 'Satisfied with our service',
                },
                {
                  metric: '4.8/5',
                  label: 'Average Rating',
                  description: 'Based on client feedback',
                },
              ].map((stat, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <StyledCard sx={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.15)',
                    }
                  }}>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        color: 'white',
                        mb: 1,
                      }}
                    >
                      {stat.metric}
                    </Typography>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ fontWeight: 600, color: 'white' }}
                    >
                      {stat.label}
                    </Typography>
                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      {stat.description}
                    </Typography>
                  </StyledCard>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Testimonials Section */}
        <Box sx={{ 
          py: 8, 
          bgcolor: '#f5f5f5',
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: 'linear-gradient(rgba(26, 35, 126, 0.95), rgba(26, 35, 126, 0.95)), url("/Assets/image.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          color: 'white',
        }}>
          <FloatingElement sx={{ top: '20%', left: '5%' }} delay={1} />
          <FloatingElement sx={{ bottom: '10%', right: '5%' }} delay={2} />
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
            <Typography
              variant="h3"
              align="center"
              sx={{
                fontWeight: 700,
                mb: 6,
                color: 'white',
              }}
            >
              Client Testimonials
            </Typography>
            <Grid container spacing={4}>
              {loading ? (
                <Box sx={{ width: '100%', textAlign: 'center', py: 4, color: 'white' }}>
                  <Typography>Loading testimonials...</Typography>
                </Box>
              ) : testimonials.length > 0 ? (
                testimonials.map((testimonial, index) => (
                  <Grid item xs={12} md={4} key={testimonial.id}>
                    <TestimonialCard sx={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.15)',
                      }
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar 
                          src={testimonial.userImage} 
                          sx={{ 
                            width: 56, 
                            height: 56, 
                            mr: 2,
                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                            color: 'white',
                          }}
                        >
                          {testimonial.userName?.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600, color: 'white' }}>
                            {testimonial.userName}
                          </Typography>
                          <Rating 
                            value={testimonial.rating} 
                            readOnly 
                            size="small"
                            sx={{
                              color: 'white',
                              '& .MuiRating-iconFilled': {
                                color: 'white',
                              },
                              '& .MuiRating-iconEmpty': {
                                color: 'rgba(255, 255, 255, 0.3)',
                              }
                            }}
                          />
                        </Box>
                      </Box>
                      <Typography
                        sx={{ 
                          fontStyle: 'italic',
                          color: 'rgba(255, 255, 255, 0.9)',
                          mb: 2,
                          flex: 1
                        }}
                      >
                        "{testimonial.comment}"
                      </Typography>
                      <Typography
                        variant="body2" 
                        sx={{ 
                          color: 'rgba(255, 255, 255, 0.7)',
                          mt: 'auto'
                        }}
                      >
                        {new Date(testimonial.timestamp?.toDate()).toLocaleDateString()}
                      </Typography>
                    </TestimonialCard>
                  </Grid>
                ))
              ) : (
                <Box sx={{ width: '100%', textAlign: 'center', py: 4, color: 'white' }}>
                  <Typography>No testimonials available yet.</Typography>
                </Box>
              )}
            </Grid>
          </Container>
        </Box>

      {/* FAQ Section */}
        <Box sx={{ 
          py: 8, 
          bgcolor: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <PulsingCircle sx={{ top: '15%', right: '10%' }} delay={2} size={100} />
          <PulsingCircle sx={{ bottom: '20%', left: '5%' }} delay={3} size={120} />
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
              variant="h3"
            align="center"
            sx={{
                fontWeight: 700,
                mb: 6,
                color: '#1a237e',
            }}
          >
            Frequently Asked Questions
          </Typography>
          <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            {faqItems.map((item, index) => (
              <Accordion
                key={index}
                sx={{
                  mb: 2,
                  boxShadow: 'none',
                    '&:before': { display: 'none' },
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '8px !important',
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {item.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography color="text.secondary">
                    {item.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Container>
      </Box>
          </Box>

      <Box sx={{ 
        position: 'sticky',
        bottom: 0,
        width: '100%',
        bgcolor: 'background.paper',
        zIndex: 10,
        borderTop: '1px solid rgba(0, 0, 0, 0.1)',
        mt: 'auto'
      }}>
      <Footer />
      </Box>
    </Box>
  );
};

export default LandingPage; 
