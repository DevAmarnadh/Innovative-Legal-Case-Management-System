import React, { useState, useEffect } from 'react';
import { db, storage } from './firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import Cookies from 'js-cookie';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
  Alert,
  IconButton,
  Chip,
  Avatar,
  Tooltip,
  styled,
  useTheme,
  alpha,
  Skeleton,
  Fade,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import DescriptionIcon from '@mui/icons-material/Description';
import CategoryIcon from '@mui/icons-material/Category';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import InfoIcon from '@mui/icons-material/Info';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FilterListIcon from '@mui/icons-material/FilterList';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import TimelineIcon from '@mui/icons-material/Timeline';
import RefreshIcon from '@mui/icons-material/Refresh';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Styled Components
const PageWrapper = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #ebedee 100%)',
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
}));

const DashboardHeader = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  position: 'relative',
  zIndex: 1,
  '& .MuiTypography-h4': {
    fontWeight: 700,
    marginBottom: theme.spacing(1),
    background: 'linear-gradient(45deg, #1a237e, #283593)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
  }
}));

const SearchSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: 'none',
  border: `1px solid ${theme.palette.divider}`,
  background: alpha('#fff', 0.9),
  backdropFilter: 'blur(8px)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
  },
}));

const StatsCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2.5),
  borderRadius: theme.spacing(2),
  boxShadow: 'none',
  border: `1px solid ${theme.palette.divider}`,
  background: alpha('#fff', 0.9),
  backdropFilter: 'blur(8px)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
  },
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

const CaseCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.spacing(2),
  boxShadow: 'none',
  border: `1px solid ${theme.palette.divider}`,
  background: alpha('#fff', 0.9),
  backdropFilter: 'blur(8px)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 32px rgba(0,0,0,0.1)',
  },
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

const CaseHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
  color: theme.palette.primary.contrastText,
  borderRadius: '16px 16px 0 0',
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
    pointerEvents: 'none',
  },
}));

const CaseContent = styled(CardContent)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  background: alpha('#fff', 0.9),
  backdropFilter: 'blur(8px)',
}));

const CaseFooter = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  background: alpha('#fff', 0.9),
  backdropFilter: 'blur(8px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(5),
  padding: theme.spacing(1, 3),
  textTransform: 'none',
  fontWeight: 600,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  '&.MuiButton-outlined': {
    borderColor: theme.palette.divider,
    color: theme.palette.text.primary,
    '&:hover': {
      borderColor: theme.palette.primary.main,
      backgroundColor: alpha(theme.palette.primary.main, 0.05),
      transform: 'translateY(-2px)',
    }
  },
  '&.MuiButton-contained': {
    background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
    color: theme.palette.primary.contrastText,
    boxShadow: '0 4px 12px rgba(26, 35, 126, 0.2)',
    '&:hover': {
      boxShadow: '0 8px 24px rgba(26, 35, 126, 0.3)',
      transform: 'translateY(-2px)',
    }
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
    '0%': { transform: 'translate(-100%, -100%) rotate(45deg)' },
    '100%': { transform: 'translate(100%, 100%) rotate(45deg)' },
  },
}));

const InfoItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1.5),
  backgroundColor: alpha(theme.palette.grey[50], 0.8),
  backdropFilter: 'blur(8px)',
  border: `1px solid ${theme.palette.divider}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateX(4px)',
    backgroundColor: alpha(theme.palette.grey[50], 0.95),
  },
  '& .MuiSvgIcon-root': {
    color: theme.palette.primary.main,
    transition: 'transform 0.3s ease',
  },
  '&:hover .MuiSvgIcon-root': {
    transform: 'scale(1.1)',
  },
  '& .MuiTypography-root': {
    fontWeight: 500,
    color: theme.palette.text.primary,
  }
}));

const SearchInput = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(2),
    backgroundColor: alpha(theme.palette.background.paper, 0.8),
    backdropFilter: 'blur(8px)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      backgroundColor: alpha(theme.palette.background.paper, 0.95),
      transform: 'translateY(-2px)',
    },
    '&.Mui-focused': {
      backgroundColor: '#fff',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    }
  }
}));

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
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
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2
    }
  }
};

function AllCases() {
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [filteredCases, setFilteredCases] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [userRole, setUserRole] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const theme = useTheme();

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const casesCollection = collection(db, 'cases');
        const messagesCollection = collection(db, 'messages');
        
        // First get all taken cases
        const messagesSnapshot = await getDocs(messagesCollection);
        const takenCaseIds = new Set();
        messagesSnapshot.forEach((doc) => {
          const messageData = doc.data();
          if (messageData.type === "caseTaken" && messageData.caseDetails?.id) {
            takenCaseIds.add(messageData.caseDetails.id);
          }
        });

        const querySnapshot = await getDocs(casesCollection);
        if (!querySnapshot.empty) {
          const casesData = [];
          for (const doc of querySnapshot.docs) {
            // Skip if case is already taken
            if (takenCaseIds.has(doc.id)) {
              continue;
            }

            const caseData = doc.data();
    
            // Ensure files field exists and is an array
            if (!Array.isArray(caseData.files)) {
              caseData.files = [];
            }
    
            if (caseData.files.length > 0) {
              const filesData = await Promise.all(
                caseData.files.map(async (fileInfo) => {
                  if (typeof fileInfo === 'string') {
                    const fileRef = ref(storage, fileInfo);
                    const downloadURL = await getDownloadURL(fileRef);
                    return { filePath: fileInfo, downloadURL };
                  } else if (fileInfo.filePath) {
                    const fileRef = ref(storage, fileInfo.filePath);
                    const downloadURL = await getDownloadURL(fileRef);
                    return { ...fileInfo, downloadURL };
                  } else {
                    console.error('File path is not a string:', fileInfo);
                    return null;
                  }
                }).filter(fileInfo => fileInfo !== null)
              );
    
              caseData.files = filesData;
            } else {
              caseData.files = [];
            }
    
            casesData.push({ id: doc.id, ...caseData });
          }
    
          // Initial sorting
          casesData.sort((a, b) => new Date(b.filingDateTime) - new Date(a.filingDateTime));
          setCases(casesData);
          setFilteredCases(casesData);
        } else {
          console.log('No cases found.');
        }
      } catch (error) {
        console.error('Error fetching cases:', error);
      }
    };

    const fetchUserRole = async (username) => {
      try {
        const usersCollection = collection(db, 'users');
        const querySnapshot = await getDocs(usersCollection);
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          if (userData.username === username) {
            setUserRole(userData.role);
          }
        });
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };

    const username = Cookies.get('username');
    if (username) {
      fetchUserRole(username);
    } else {
      console.log('No username found in the cookie.');
    }

    fetchCases();
  }, []);

  useEffect(() => {
    const lowercasedFilter = searchQuery.toLowerCase();
    const filteredData = cases.filter((item) =>
      item.caseTitle.toLowerCase().includes(lowercasedFilter) ||
      item.caseDescription.toLowerCase().includes(lowercasedFilter)
    );
    setFilteredCases(filteredData);
  }, [searchQuery, cases]);

  const handleViewCaseDetails = (caseItem) => {
    setSelectedCase(caseItem);
  };

  const handleTakeCase = async () => {
    try {
      console.log('Case taken by lawyer:', selectedCase.id);

      const username = Cookies.get('username');
      const messageRef = collection(db, 'messages');
      await addDoc(messageRef, {
        username,
        caseDetails: selectedCase,
        type: "caseTaken",
        timestamp: new Date().toISOString()
      });

      // Remove the taken case from the local state
      const updatedCases = cases.filter(c => c.id !== selectedCase.id);
      setCases(updatedCases);
      setFilteredCases(updatedCases);

      setSnackbarMessage('Case successfully taken!');
      setSnackbarOpen(true);

      setTimeout(() => {
        setSnackbarMessage("Please check your inbox for adding hearing details.");
        setSnackbarOpen(true);
      }, 4000);

      setSelectedCase(null);
    } catch (error) {
      console.error('Error taking the case:', error);
      setSnackbarMessage('Error taking the case. Please try again.');
      setSnackbarOpen(true);
    }
  };

  const handleSortOrder = (order) => {
    const sortedCases = [...filteredCases].sort((a, b) => {
      if (order === 'newest') {
        return new Date(b.filingDateTime) - new Date(a.filingDateTime);
      } else {
        return new Date(a.filingDateTime) - new Date(b.filingDateTime);
      }
    });
    setFilteredCases(sortedCases);
    setSortOrder(order);
  };

  return (
    <PageWrapper>
      <Container maxWidth="xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <DashboardHeader>
            <Typography variant="h4">
              Legal Case Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Browse and manage available legal cases
            </Typography>
          </DashboardHeader>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <SearchSection>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <SearchInput
                  fullWidth
                  variant="outlined"
                  placeholder="Search cases by title or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <SearchIcon sx={{ 
                        mr: 1, 
                        color: alpha(theme.palette.text.secondary, 0.7)
                      }} />
                    ),
                  }}
                  size="medium"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <ActionButton
                      variant="outlined"
                      startIcon={<FilterListIcon />}
                    >
                      Filter
                    </ActionButton>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <ActionButton
                      variant="outlined"
                      startIcon={<SortIcon />}
                      onClick={() => handleSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
                    >
                      {sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}
                    </ActionButton>
                  </motion.div>
                </Box>
              </Grid>
            </Grid>

            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <Grid container spacing={3} sx={{ mt: 3 }}>
                {[
                  { value: filteredCases.length, label: 'Available Cases', icon: <DashboardIcon /> },
                  { value: [...new Set(filteredCases.map(c => c.caseType))].length, label: 'Case Types', icon: <CategoryIcon /> },
                  { value: [...new Set(filteredCases.map(c => c.caseAssignee))].length, label: 'Active Clients', icon: <PersonIcon /> },
                  { value: filteredCases.filter(c => c.files?.length > 0).length, label: 'Cases with Documents', icon: <AttachFileIcon /> }
                ].map((stat, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <motion.div
                      variants={fadeInUp}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <StatsCard>
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                        >
                          {stat.icon}
                          <Typography variant="h3" color="primary" sx={{ 
                            fontWeight: 700, 
                            mb: 1,
                            background: 'linear-gradient(45deg, #1a237e, #283593)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                          }}>
                            {stat.value}
                          </Typography>
                        </motion.div>
                        <Typography variant="body2" color="text.secondary">
                          {stat.label}
                        </Typography>
                      </StatsCard>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          </SearchSection>
        </motion.div>

        <AnimatePresence>
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Grid container spacing={3}>
              {filteredCases.map((caseItem, index) => (
                <Grid item xs={12} md={6} lg={4} key={caseItem.id}>
                  <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    layout
                  >
                    <CaseCard>
                      <CaseHeader>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                          {caseItem.caseType}
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {caseItem.caseTitle}
                        </Typography>
                      </CaseHeader>
                      
                      <CaseContent>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{
                            mb: 3,
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {caseItem.caseDescription}
                        </Typography>

                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                              <Avatar sx={{ 
                                width: 32, 
                                height: 32, 
                                bgcolor: 'primary.light',
                                background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
                              }}>
                                {caseItem.caseAssignee.charAt(0)}
                              </Avatar>
                              <Box>
                                <Typography variant="caption" color="text.secondary">
                                  Client
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {caseItem.caseAssignee}
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>
                          <Grid item xs={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <AccessTimeIcon color="action" fontSize="small" />
                              <Typography variant="body2" color="text.secondary">
                                {new Date(caseItem.filingDateTime).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Grid>
                          {caseItem.files?.length > 0 && (
                            <Grid item xs={6}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <AttachFileIcon color="action" fontSize="small" />
                                <Typography variant="body2" color="text.secondary">
                                  {caseItem.files.length} Documents
                                </Typography>
                              </Box>
                            </Grid>
                          )}
                        </Grid>
                      </CaseContent>

                      <CaseFooter>
                        {userRole === 'Lawyers/Attorneys' && (
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            style={{ width: '100%' }}
                          >
                            <ActionButton
                              variant="contained"
                              onClick={() => handleViewCaseDetails(caseItem)}
                              fullWidth
                              endIcon={<ArrowForwardIcon />}
                            >
                              View Details
                            </ActionButton>
                          </motion.div>
                        )}
                      </CaseFooter>
                    </CaseCard>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </AnimatePresence>

        <Dialog
          open={Boolean(selectedCase)}
          onClose={() => setSelectedCase(null)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: theme.shadows[8],
              background: alpha('#fff', 0.9),
              backdropFilter: 'blur(8px)',
            }
          }}
          TransitionComponent={Fade}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <DialogTitle sx={{ pb: 1 }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 600,
                background: 'linear-gradient(45deg, #1a237e, #283593)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Case Details
              </Typography>
            </DialogTitle>
            <DialogContent dividers>
              {selectedCase && (
                <Box sx={{ py: 1 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" sx={{ 
                        fontWeight: 600, 
                        color: 'primary.main',
                        mb: 1,
                      }}>
                        {selectedCase.caseTitle}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedCase.caseDescription}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <InfoItem>
                        <PersonIcon fontSize="small" />
                        <Typography variant="body2">
                          Client: {selectedCase.caseAssignee}
                        </Typography>
                      </InfoItem>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <InfoItem>
                        <CategoryIcon fontSize="small" />
                        <Typography variant="body2">
                          Type: {selectedCase.caseType}
                        </Typography>
                      </InfoItem>
                    </Grid>
                    <Grid item xs={12}>
                      <InfoItem>
                        <AccessTimeIcon fontSize="small" />
                        <Typography variant="body2">
                          Filed: {new Date(selectedCase.filingDateTime).toLocaleString()}
                        </Typography>
                      </InfoItem>
                    </Grid>
                    {selectedCase.files && selectedCase.files.length > 0 && (
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" gutterBottom sx={{ 
                          color: 'text.secondary', 
                          mb: 1,
                          fontWeight: 600,
                        }}>
                          Attached Documents:
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {selectedCase.files.map((file, index) => (
                            <motion.div
                              key={index}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button
                                variant="outlined"
                                size="small"
                                href={file.downloadURL}
                                target="_blank"
                                startIcon={<AttachFileIcon />}
                                sx={{ 
                                  borderRadius: 2,
                                  textTransform: 'none',
                                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                  '&:hover': {
                                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                                    borderColor: theme.palette.primary.main,
                                  }
                                }}
                              >
                                {file.filePath.split('/').pop()}
                              </Button>
                            </motion.div>
                          ))}
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              )}
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
              {userRole === 'Lawyers/Attorneys' && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <ActionButton
                    variant="contained"
                    onClick={handleTakeCase}
                    endIcon={<ArrowForwardIcon />}
                  >
                    Take Case
                  </ActionButton>
                </motion.div>
              )}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  onClick={() => setSelectedCase(null)}
                  sx={{ 
                    borderRadius: 2,
                    color: 'text.secondary',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.grey[500], 0.1),
                    }
                  }}
                >
                  Close
                </Button>
              </motion.div>
            </DialogActions>
          </motion.div>
        </Dialog>

        <AnimatePresence>
          {snackbarOpen && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.3 }}
              style={{
                position: 'fixed',
                bottom: 24,
                right: 24,
                zIndex: 9999,
              }}
            >
              <Alert
                severity="success"
                sx={{
                  borderRadius: 2,
                  boxShadow: theme.shadows[4],
                  backgroundColor: alpha(theme.palette.success.light, 0.9),
                  backdropFilter: 'blur(8px)',
                  color: theme.palette.success.dark,
                  '& .MuiAlert-icon': {
                    color: theme.palette.success.main,
                  }
                }}
                onClose={() => setSnackbarOpen(false)}
              >
                {snackbarMessage}
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </PageWrapper>
  );
}

export default AllCases;