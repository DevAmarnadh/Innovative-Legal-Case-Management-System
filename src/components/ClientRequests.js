import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Paper,
  Chip,
  Alert,
  Avatar,
  CircularProgress,
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import { collection, getDocs, where, query, addDoc } from 'firebase/firestore';
import { db } from './firebase';
import Cookies from 'js-cookie';
import LawyerProfile from './LawyerProfile/LawyerProfile';
import { styled, alpha } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import LanguageIcon from '@mui/icons-material/Language';
import GavelIcon from '@mui/icons-material/Gavel';
import StarIcon from '@mui/icons-material/Star';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import WorkIcon from '@mui/icons-material/Work';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GradeIcon from '@mui/icons-material/Grade';
import TranslateIcon from '@mui/icons-material/Translate';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import DescriptionIcon from '@mui/icons-material/Description';
import CategoryIcon from '@mui/icons-material/Category';
import DateRangeIcon from '@mui/icons-material/DateRange';
import { motion, AnimatePresence } from 'framer-motion';

const languages = [
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi" },
  { code: "bn", name: "Bengali" },
  { code: "te", name: "Telugu" },
  { code: "mr", name: "Marathi" },
  { code: "ta", name: "Tamil" },
  { code: "ur", name: "Urdu" },
  { code: "gu", name: "Gujarati" },
  { code: "kn", name: "Kannada" },
  { code: "ml", name: "Malayalam" },
  { code: "or", name: "Odia" },
  { code: "pa", name: "Punjabi" },
  { code: "as", name: "Assamese" },
  { code: "ne", name: "Nepali" },
];

const MainContainer = styled('div')(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)',
  padding: theme.spacing(3),
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
    '0%': { transform: 'scale(1)', opacity: 0.5 },
    '50%': { transform: 'scale(1.5)', opacity: 0.8 },
    '100%': { transform: 'scale(1)', opacity: 0.5 },
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  }
}));

const ContentWrapper = styled(motion.div)(({ theme }) => ({
  maxWidth: 1400,
  margin: '0 auto',
  marginTop: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    marginTop: theme.spacing(3),
  }
}));

const TopSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(3),
  background: 'linear-gradient(135deg, #fff 0%, #f8faff 100%)',
  boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
  marginBottom: theme.spacing(4)
}));

const FormGrid = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: theme.spacing(3),
  marginTop: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
  }
}));

const LawyersSection = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3)
}));

const LawyerGrid = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
  }
}));

const LawyerCard = styled(motion(Card))(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.spacing(2),
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  border: '1px solid rgba(0, 0, 0, 0.08)',
  background: alpha('#fff', 0.9),
  backdropFilter: 'blur(10px)',
  overflow: 'hidden',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #1a237e, #283593)',
    transform: 'scaleX(0)',
    transition: 'transform 0.3s ease',
    transformOrigin: 'left'
  },
  '&:hover::before': {
    transform: 'scaleX(1)'
  }
}));

const ProfileImage = styled(Box)(({ theme }) => ({
  position: 'relative',
  transition: 'all 0.3s ease',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: '50%',
    background: 'linear-gradient(45deg, #1a237e, #283593)',
    zIndex: -1,
    opacity: 0,
    transition: 'opacity 0.3s ease'
  },
  '&:hover': {
    transform: 'scale(1.05)',
    '&::after': {
      opacity: 1
    }
  }
}));

const ExpertiseChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 2px 8px rgba(26, 35, 126, 0.15)'
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(2),
    backgroundColor: '#fff',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#fff',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    },
    '&.Mui-focused': {
      backgroundColor: '#fff',
      boxShadow: '0 0 0 2px rgba(26, 35, 126, 0.2)',
    }
  }
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  padding: theme.spacing(1.2, 3),
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.9rem',
  boxShadow: 'none',
  background: 'linear-gradient(45deg, #1a237e 30%, #283593 90%)',
  color: '#ffffff',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    boxShadow: '0 6px 20px rgba(26, 35, 126, 0.3)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.2), transparent)',
    transform: 'rotate(45deg)',
    animation: 'shimmer 3s infinite'
  },
  '@keyframes shimmer': {
    '0%': { transform: 'translate(-100%, -100%) rotate(45deg)' },
    '100%': { transform: 'translate(100%, 100%) rotate(45deg)' },
  }
}));

const StatsChip = styled(Chip)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  backgroundColor: alpha(theme.palette.primary.main, 0.08),
  color: theme.palette.primary.main,
  fontWeight: 600,
  height: 28,
  '& .MuiChip-icon': {
    color: 'inherit',
    fontSize: '1rem',
  },
  '& .MuiChip-label': {
    padding: '0 10px',
    fontSize: '0.75rem',
  }
}));

const InfoItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  backgroundColor: 'rgba(25, 118, 210, 0.04)',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(25, 118, 210, 0.08)',
  }
}));

const InfoIcon = styled(Box)(({ theme }) => ({
  width: 45,
  height: 45,
  borderRadius: theme.spacing(1),
  backgroundColor: 'rgba(25, 118, 210, 0.12)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.primary.main,
  '& svg': {
    fontSize: 24,
  }
}));

const ProfileDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    transform: 'translateY(50px)',
    opacity: 0,
    transition: 'all 0.3s ease-out',
    borderRadius: theme.spacing(3),
    overflow: 'hidden'
  },
  '&.MuiDialog-root.MuiModal-root': {
    '& .MuiDialog-paper': {
      transform: 'translateY(0)',
      opacity: 1
    }
  }
}));

const ProfileSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  '&:not(:last-child)': {
    borderBottom: `1px solid ${theme.palette.divider}`
  }
}));

const ProfileStat = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1.5),
  borderRadius: theme.spacing(1.5),
  backgroundColor: alpha(theme.palette.primary.main, 0.04),
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    transform: 'translateY(-2px)'
  }
}));

const ConsultationDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    transform: 'translateY(50px)',
    opacity: 0,
    transition: 'all 0.3s ease-out',
    borderRadius: theme.spacing(3),
    overflow: 'hidden',
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
  },
  '&.MuiDialog-root.MuiModal-root': {
    '& .MuiDialog-paper': {
      transform: 'translateY(0)',
      opacity: 1
    }
  }
}));

const DialogHeader = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(45deg, #1a237e 0%, #283593 100%)',
  padding: theme.spacing(4),
  color: 'white',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1), transparent)',
    animation: 'float 6s ease-in-out infinite'
  }
}));

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const buttonVariants = {
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      yoyo: Infinity
    }
  },
  tap: {
    scale: 0.95
  }
};

const ClientRequests = () => {
  const [selectedCase, setSelectedCase] = useState("");
  const [selectedCaseTitle, setSelectedCaseTitle] = useState("");
  const [requestMessage, setRequestMessage] = useState("");
  const [lawyersList, setLawyersList] = useState([]);
  const [selectedLawyer, setSelectedLawyer] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUsername, setLoggedInUsername] = useState("");
  const [clientCases, setClientCases] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [recommendedLawyers, setRecommendedLawyers] = useState([]);
  const [showRecommendedLawyers, setShowRecommendedLawyers] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [showLawyerProfile, setShowLawyerProfile] = useState(false);
  const [selectedLawyerProfile, setSelectedLawyerProfile] = useState(null);
  const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);
  const [lawyers, setLawyers] = useState([]);
  const [isLoadingLawyers, setIsLoadingLawyers] = useState(false);
  const [isLoadingCases, setIsLoadingCases] = useState(false);
  const [caseError, setCaseError] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const recommendedCollection = collection(db, "recommendedLawyers");
        const querySnapshot = await getDocs(recommendedCollection);
        
        if (!querySnapshot.empty) {
          const lawyersData = [];
          querySnapshot.forEach((doc) => {
            const lawyer = doc.data();
            lawyersData.push({
              username: lawyer.username,
              department: lawyer.department,
              experience: lawyer.experience,
              rating: lawyer.rating,
              email: lawyer.email,
              specialization: lawyer.specialization,
              cases_won: lawyer.cases_won,
              boardOfCouncil: lawyer.boardOfCouncil,
              description: lawyer.description,
              image: lawyer.image,
              education: lawyer.education,
              languages: lawyer.languages,
              expertise: lawyer.expertise,
              achievements: lawyer.achievements,
              contact: lawyer.contact
            });
          });
          setRecommendedLawyers(lawyersData);
        }

        const username = Cookies.get("username");
        if (username) {
          setIsLoggedIn(true);
          setLoggedInUsername(username);
          fetchClientCases(username);
        }
        fetchLawyers();
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, []);

  const fetchLawyers = async () => {
    setIsLoadingLawyers(true);
    try {
      const lawyersCollection = collection(db, "users");
      const q = query(lawyersCollection, where("role", "==", "Lawyers/Attorneys"));
      const querySnapshot = await getDocs(q);
      
      const lawyersData = [];
      querySnapshot.forEach((doc) => {
        const lawyer = doc.data();
        lawyersData.push({
          username: lawyer.username,
          department: lawyer.department || 'Not Specified',
          experience: lawyer.experience || 0,
          rating: lawyer.rating || 0,
          email: lawyer.email,
          serviceType: lawyer.serviceType || 'Free',
          specialization: lawyer.specialization || [],
          languages: lawyer.languages || []
        });
      });
      setLawyers(lawyersData);
    } catch (error) {
      console.error("Error fetching lawyers:", error);
    } finally {
      setIsLoadingLawyers(false);
    }
  };

  const fetchClientCases = async (username) => {
    setIsLoadingCases(true);
    setCaseError(null);
    try {
      const casesCollection = collection(db, "cases");
      const q = query(casesCollection, where("username", "==", username));
      const querySnapshot = await getDocs(q);
      
      const casesData = [];
      querySnapshot.forEach((doc) => {
        const caseData = doc.data();
        casesData.push({ 
          id: doc.id, 
          title: caseData.caseTitle,
          description: caseData.caseDescription,
          status: caseData.status,
          ...caseData 
        });
      });
      setClientCases(casesData);
    } catch (error) {
      console.error("Error fetching client cases:", error);
      setCaseError("Failed to fetch your cases. Please try again later.");
    } finally {
      setIsLoadingCases(false);
    }
  };

  const handleSendRequest = async () => {
    try {
      const request = {
        caseId: selectedCase,
        caseTitle: selectedCaseTitle,
        message: requestMessage,
        language: selectedLanguage,
        username: selectedLawyer,
        from: loggedInUsername,
        type: "reqMsg",
        timestamp: new Date(),
      };
      const requestsCollection = collection(db, "requests");
      await addDoc(requestsCollection, request);

      setSnackbarMessage("Request sent successfully!");
      setSnackbarOpen(true);

      setTimeout(() => {
        setSnackbarMessage("The lawyer will get back to you shortly.");
        setSnackbarOpen(true);
      }, 4000);

      setSelectedCase("");
      setRequestMessage("");
      setSelectedLawyer("");
      setSelectedLanguage("");
    } catch (error) {
      console.error("Error sending request:", error);
      setSnackbarMessage("Error sending request: " + error);
      setSnackbarOpen(true);
    }
  };

  const handleLawyerProfile = (lawyer) => {
    const defaultProfile = {
      username: lawyer.username || '',
      department: lawyer.department || '',
      rating: lawyer.rating || 0,
      experience: lawyer.experience || 0,
      cases_won: lawyer.cases_won || 0,
      casesHandled: lawyer.casesHandled || 0,
      expertise: lawyer.expertise || [],
      languages: lawyer.languages || [],
      image: lawyer.image || null,
    };
    setSelectedLawyerProfile(defaultProfile);
    setShowLawyerProfile(true);
  };

  const startVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(
        "Your browser does not support speech recognition. Please use Chrome or Firefox."
      );
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = selectedLanguage;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setRequestMessage(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.start();
  };

  return (
    <MainContainer>
      <ContentWrapper
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <LawyersSection>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 3 
          }}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Recommended Lawyers
              </Typography>
            </motion.div>
            
            {isLoggedIn && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <ActionButton
                  variant="contained"
                  onClick={() => setIsComposeModalOpen(true)}
                  startIcon={<PersonIcon />}
                  component={motion.button}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Request Consultation
                </ActionButton>
              </motion.div>
            )}
          </Box>

          <AnimatePresence>
            <motion.div variants={containerVariants}>
              <Grid container spacing={3}>
                {recommendedLawyers.map((lawyer, index) => (
                  <Grid item xs={12} sm={6} md={4} key={lawyer.username}>
                    <LawyerCard
                      variants={cardVariants}
                      whileHover={{ y: -8 }}
                      initial="hidden"
                      animate="visible"
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          gap: 2,
                          mb: 3
                        }}>
                          <ProfileImage>
                            {lawyer.image ? (
                              <Box
                                component="img"
                                src={lawyer.image}
                                alt={lawyer.username}
                                sx={{
                                  width: 60,
                                  height: 60,
                                  borderRadius: '50%',
                                  objectFit: 'cover',
                                  border: '2px solid white',
                                  boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
                                }}
                              />
                            ) : (
                              <Avatar
                                sx={{
                                  width: 60,
                                  height: 60,
                                  bgcolor: 'primary.light',
                                  color: 'primary.main',
                                  fontSize: 24,
                                  boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
                                }}
                              >
                                <PersonIcon />
                              </Avatar>
                            )}
                          </ProfileImage>
                          <Box>
                            <Typography variant="h6" sx={{ 
                              fontWeight: 700,
                              background: 'linear-gradient(45deg, #1a237e 30%, #283593 90%)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent'
                            }}>
                              {lawyer.username}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: 'text.secondary',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5
                              }}
                            >
                              <WorkIcon sx={{ fontSize: 16 }} />
                              {lawyer.department}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                            <StatsChip
                              icon={<StarIcon />}
                              label={`${lawyer.rating} Rating`}
                              size="small"
                            />
                            <StatsChip
                              icon={<WorkIcon />}
                              label={`${lawyer.experience}+ Years`}
                              size="small"
                            />
                          </Box>
                        </Box>
                        <ActionButton
                          variant="contained"
                          fullWidth
                          onClick={() => handleLawyerProfile(lawyer)}
                          endIcon={<ArrowForwardIcon />}
                          sx={{
                            mt: 'auto',
                            position: 'relative',
                            overflow: 'hidden'
                          }}
                        >
                          View Profile
                        </ActionButton>
                      </CardContent>
                    </LawyerCard>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          </AnimatePresence>
        </LawyersSection>

        <ConsultationDialog
          open={isComposeModalOpen}
          onClose={() => setIsComposeModalOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogHeader>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  Request Legal Consultation
                </Typography>
                <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                  Fill in the details below to connect with your chosen legal expert
                </Typography>
              </motion.div>
            </Box>
          </DialogHeader>
          
          <DialogContent sx={{ p: 4, mt: 2 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <FormGrid>
                <StyledTextField
                  select
                  label="Select Lawyer"
                  value={selectedLawyer}
                  onChange={(e) => setSelectedLawyer(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <PersonIcon sx={{ mr: 1, fontSize: 20, color: '#1a237e' }} />
                    ),
                  }}
                  size="small"
                  disabled={isLoadingLawyers}
                >
                  <MenuItem value="">Select a Lawyer</MenuItem>
                  {lawyers.map((lawyer) => (
                    <MenuItem 
                      key={lawyer.username} 
                      value={lawyer.username}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        py: 1
                      }}
                    >
                      <Box sx={{ width: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {lawyer.username}
                          </Typography>
                          <Chip 
                            size="small" 
                            label={lawyer.serviceType}
                            color={lawyer.serviceType === 'Paid' ? 'primary' : 'success'}
                            sx={{ ml: 1 }}
                          />
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip 
                            size="small" 
                            label={lawyer.department}
                            sx={{ 
                              bgcolor: 'rgba(26, 35, 126, 0.08)',
                              color: '#1a237e',
                              fontSize: '0.75rem'
                            }}
                          />
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <WorkIcon sx={{ fontSize: 14 }} />
                            {lawyer.experience} Years
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </StyledTextField>

                <StyledTextField
                  select
                  label="Language"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <LanguageIcon sx={{ mr: 1, fontSize: 20, color: '#1a237e' }} />
                    ),
                  }}
                  size="small"
                >
                  <MenuItem value="">Select a Language</MenuItem>
                  {languages.map((lang) => (
                    <MenuItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </MenuItem>
                  ))}
                </StyledTextField>

                <StyledTextField
                  select
                  label="Select Case"
                  value={selectedCase}
                  onChange={(e) => {
                    setSelectedCase(e.target.value);
                    const selectedCaseData = clientCases.find(c => c.id === e.target.value);
                    setSelectedCaseTitle(selectedCaseData?.title || "");
                  }}
                  InputProps={{
                    startAdornment: (
                      <DescriptionIcon sx={{ mr: 1, fontSize: 20, color: '#1a237e' }} />
                    ),
                  }}
                  size="small"
                  error={!!caseError}
                  helperText={caseError}
                  disabled={isLoadingCases}
                >
                  <MenuItem value="">Select a Case</MenuItem>
                  {isLoadingCases ? (
                    <MenuItem disabled>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      Loading cases...
                    </MenuItem>
                  ) : clientCases.length === 0 ? (
                    <MenuItem disabled>No cases found</MenuItem>
                  ) : (
                    clientCases.map((caseItem) => (
                      <MenuItem 
                        key={caseItem.id} 
                        value={caseItem.id}
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          py: 1
                        }}
                      >
                        <Box sx={{ width: '100%' }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {caseItem.title}
                          </Typography>
                          {caseItem.status && (
                            <Chip 
                              size="small" 
                              label={caseItem.status}
                              color={caseItem.status.toLowerCase() === 'active' ? 'success' : 'default'}
                              sx={{ ml: 1 }}
                            />
                          )}
                          {caseItem.description && (
                            <Typography variant="caption" color="text.secondary" noWrap>
                              {caseItem.description}
                            </Typography>
                          )}
                        </Box>
                      </MenuItem>
                    ))
                  )}
                </StyledTextField>

                <Box sx={{ 
                  position: 'relative', 
                  gridColumn: '1 / -1',
                  '& .MuiInputBase-root': {
                    transition: 'all 0.3s ease',
                    '&:hover, &.Mui-focused': {
                      boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                    }
                  }
                }}>
                  <StyledTextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Your Message"
                    value={requestMessage}
                    onChange={(e) => setRequestMessage(e.target.value)}
                    placeholder="Describe your case details..."
                    InputProps={{
                      sx: {
                        borderRadius: 2,
                        bgcolor: 'background.paper',
                        '&:hover': {
                          bgcolor: 'background.paper'
                        }
                      }
                    }}
                  />
                  <IconButton 
                    onClick={startVoiceInput}
                    size="small"
                    sx={{ 
                      position: 'absolute',
                      right: 12,
                      top: 12,
                      width: 36,
                      height: 36,
                      bgcolor: 'rgba(26, 35, 126, 0.1)',
                      color: '#1a237e',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        bgcolor: '#1a237e',
                        color: 'white',
                        transform: 'scale(1.1)'
                      }
                    }}
                  >
                    <MicIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                </Box>

                <Box sx={{ 
                  gridColumn: '1 / -1', 
                  display: 'flex', 
                  justifyContent: 'flex-end', 
                  gap: 2,
                  mt: 2 
                }}>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="outlined"
                      onClick={() => setIsComposeModalOpen(false)}
                      sx={{ 
                        borderRadius: 2,
                        borderColor: '#1a237e',
                        color: '#1a237e',
                        '&:hover': {
                          borderColor: '#1a237e',
                          bgcolor: 'rgba(26, 35, 126, 0.04)'
                        }
                      }}
                    >
                      Cancel
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <ActionButton
                      variant="contained"
                      onClick={handleSendRequest}
                      disabled={!selectedCase || !selectedLawyer || !requestMessage}
                      endIcon={<ArrowForwardIcon />}
                      sx={{ 
                        minWidth: 180,
                        position: 'relative',
                        overflow: 'hidden',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          top: '-50%',
                          left: '-50%',
                          width: '200%',
                          height: '200%',
                          background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.2), transparent)',
                          transform: 'rotate(45deg)',
                          animation: 'shimmer 3s infinite'
                        }
                      }}
                    >
                      Send Request
                    </ActionButton>
                  </motion.div>
                </Box>
              </FormGrid>
            </motion.div>
          </DialogContent>
        </ConsultationDialog>

        <ProfileDialog
          open={showLawyerProfile}
          onClose={() => setShowLawyerProfile(false)}
          maxWidth="sm"
          fullWidth
          TransitionComponent={motion.div}
        >
          {selectedLawyerProfile && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Box sx={{ 
                position: 'relative', 
                height: 250,
                background: 'linear-gradient(45deg, #1a237e 0%, #283593 100%)',
                backgroundSize: '200% 200%',
                animation: 'gradientBG 15s ease infinite',
                display: 'flex', 
                alignItems: 'center',
                px: 4,
                overflow: 'hidden'
              }}>
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1), transparent)',
                    animation: 'float 6s ease-in-out infinite'
                  }}
                />
                <Box sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                  width: '100%',
                  color: 'white',
                  position: 'relative',
                  zIndex: 1
                }}>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20
                    }}
                  >
                    <ProfileImage sx={{ transform: 'scale(1.2)' }}>
                      {selectedLawyerProfile.image ? (
                        <Box
                          component="img"
                          src={selectedLawyerProfile.image}
                          alt={selectedLawyerProfile.username}
                          sx={{
                            width: 120,
                            height: 120,
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '3px solid white',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                          }}
                        />
                      ) : (
                        <Avatar
                          sx={{
                            width: 120,
                            height: 120,
                            bgcolor: 'primary.light',
                            color: 'white',
                            fontSize: 48,
                            border: '3px solid white',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                          }}
                        >
                          {selectedLawyerProfile.username.charAt(0)}
                        </Avatar>
                      )}
                    </ProfileImage>
                  </motion.div>
                  <Box>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                        {selectedLawyerProfile.username}
                      </Typography>
                      <Typography variant="h6" sx={{ opacity: 0.9 }}>
                        {selectedLawyerProfile.department}
                      </Typography>
                    </motion.div>
                  </Box>
                </Box>
              </Box>

              <ProfileSection>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Professional Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                      <ProfileStat>
                        <GradeIcon color="primary" />
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">Rating</Typography>
                          <Typography variant="body1" fontWeight={600}>{selectedLawyerProfile.rating}/5</Typography>
                        </Box>
                      </ProfileStat>
                    </motion.div>
                  </Grid>
                  <Grid item xs={6}>
                    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                      <ProfileStat>
                        <WorkIcon color="primary" />
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">Experience</Typography>
                          <Typography variant="body1" fontWeight={600}>{selectedLawyerProfile.experience} Years</Typography>
                        </Box>
                      </ProfileStat>
                    </motion.div>
                  </Grid>
                  <Grid item xs={6}>
                    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                      <ProfileStat>
                        <EmojiEventsIcon color="primary" />
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">Cases Won</Typography>
                          <Typography variant="body1" fontWeight={600}>{selectedLawyerProfile.cases_won}</Typography>
                        </Box>
                      </ProfileStat>
                    </motion.div>
                  </Grid>
                  <Grid item xs={6}>
                    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                      <ProfileStat>
                        <AccountBalanceIcon color="primary" />
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">Cases Handled</Typography>
                          <Typography variant="body1" fontWeight={600}>{selectedLawyerProfile.casesHandled}</Typography>
                        </Box>
                      </ProfileStat>
                    </motion.div>
                  </Grid>
                </Grid>
              </ProfileSection>

              <ProfileSection>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Expertise
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {selectedLawyerProfile?.expertise?.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Chip
                        label={item}
                        icon={<GavelIcon />}
                        variant="outlined"
                        color="primary"
                        sx={{ 
                          borderRadius: 2,
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            transform: 'scale(1.05)',
                            boxShadow: '0 2px 8px rgba(26, 35, 126, 0.15)'
                          }
                        }}
                      />
                    </motion.div>
                  ))}
                </Box>
              </ProfileSection>

              <Box sx={{ p: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    onClick={() => setShowLawyerProfile(false)}
                    variant="outlined"
                    sx={{ 
                      color: '#1a237e',
                      borderColor: '#1a237e',
                      borderRadius: 2,
                      '&:hover': {
                        borderColor: '#283593',
                        bgcolor: 'rgba(26, 35, 126, 0.04)'
                      }
                    }}
                  >
                    Close
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <ActionButton
                    variant="contained"
                    onClick={() => {
                      setSelectedLawyer(selectedLawyerProfile.username);
                      setShowLawyerProfile(false);
                      setIsComposeModalOpen(true);
                    }}
                    endIcon={<ArrowForwardIcon />}
                  >
                    Request Consultation
                  </ActionButton>
                </motion.div>
              </Box>
            </motion.div>
          )}
        </ProfileDialog>

        {snackbarOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            <Alert 
              severity="success" 
              sx={{ 
                position: 'fixed',
                bottom: 24,
                left: '50%',
                transform: 'translateX(-50%)',
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              }}
              onClose={() => setSnackbarOpen(false)}
            >
              {snackbarMessage}
            </Alert>
          </motion.div>
        )}
      </ContentWrapper>
    </MainContainer>
  );
};

export default ClientRequests;

