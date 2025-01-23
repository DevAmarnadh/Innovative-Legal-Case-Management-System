import React, { useState, useEffect } from 'react';
import { db, storage } from './firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  deleteDoc, 
  doc, 
  updateDoc,
  addDoc,
  serverTimestamp 
} from "firebase/firestore";
import { 
  ref, 
  getDownloadURL, 
  deleteObject, 
  uploadBytes 
} from "firebase/storage";
import Cookies from 'js-cookie';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
  CircularProgress,
  InputAdornment,
  alpha,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import GavelIcon from '@mui/icons-material/Gavel';
import DescriptionIcon from '@mui/icons-material/Description';
import PersonIcon from '@mui/icons-material/Person';
import CategoryIcon from '@mui/icons-material/Category';
import DateRangeIcon from '@mui/icons-material/DateRange';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import FolderIcon from '@mui/icons-material/Folder';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { motion, AnimatePresence } from 'framer-motion';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import TextField from '@mui/material/TextField';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import ArticleIcon from '@mui/icons-material/Article';
import NoPhotographyIcon from '@mui/icons-material/NoPhotography';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #ebedee 100%)',
  padding: theme.spacing(4),
  overflow: 'hidden',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
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

const MainCard = styled(motion(Box))(({ theme }) => ({
  width: '100%',
  maxWidth: 1200,
  margin: '0 auto',
  display: 'grid',
  gridTemplateColumns: '1fr 3fr',
  borderRadius: theme.spacing(3),
  overflow: 'visible',
  boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
  position: 'relative',
  minHeight: 'fit-content',
  background: alpha('#fff', 0.9),
  backdropFilter: 'blur(10px)',
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
  }
}));

const SideSection = styled(motion(Box))(({ theme }) => ({
  background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
  padding: theme.spacing(6),
  color: 'white',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  position: 'relative',
  overflow: 'visible',
  minHeight: '100%',
  borderRadius: `${theme.spacing(3)} 0 0 ${theme.spacing(3)}`,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
    pointerEvents: 'none'
  },
  [theme.breakpoints.down('md')]: {
    borderRadius: `${theme.spacing(3)} ${theme.spacing(3)} 0 0`,
  }
}));

const MainSection = styled(motion(Box))(({ theme }) => ({
  padding: theme.spacing(6),
  background: alpha('#fff', 0.9),
  backdropFilter: 'blur(10px)',
  minHeight: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  borderRadius: `0 ${theme.spacing(3)} ${theme.spacing(3)} 0`,
  [theme.breakpoints.down('md')]: {
    borderRadius: `0 0 ${theme.spacing(3)} ${theme.spacing(3)}`,
  }
}));

const CaseCard = styled(motion(Card))(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.spacing(2),
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  border: '1px solid #E2E8F0',
  boxShadow: 'none',
  background: alpha('#fff', 0.9),
  backdropFilter: 'blur(10px)',
  overflow: 'hidden',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
    borderColor: '#1a237e',
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

const StatsItem = styled(motion(Box))(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(4),
  position: 'relative',
  zIndex: 1,
  padding: theme.spacing(2),
  background: 'rgba(255,255,255,0.1)',
  borderRadius: theme.spacing(2),
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  '&:hover': {
    background: 'rgba(255,255,255,0.15)',
    transform: 'translateX(8px)',
  },
  '& .MuiSvgIcon-root': {
    transition: 'transform 0.3s ease',
  },
  '&:hover .MuiSvgIcon-root': {
    transform: 'scale(1.1) rotate(5deg)',
  },
}));

const ViewButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1.5),
  padding: theme.spacing(1, 3),
  fontSize: '0.9rem',
  textTransform: 'none',
  fontWeight: 600,
  color: '#1a237e',
  borderColor: '#1a237e',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    backgroundColor: 'rgba(26, 35, 126, 0.04)',
    borderColor: '#283593',
    transform: 'translateY(-2px)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.3), transparent)',
    transform: 'rotate(45deg)',
    animation: 'shimmer 3s infinite',
  },
  '@keyframes shimmer': {
    '0%': { transform: 'translate(-100%, -100%) rotate(45deg)' },
    '100%': { transform: 'translate(100%, 100%) rotate(45deg)' },
  },
}));

const FeedbackDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.spacing(2),
    background: alpha('#fff', 0.95),
    backdropFilter: 'blur(10px)',
  }
}));

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const statsVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const FileCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  background: alpha(theme.palette.background.paper, 0.6),
  border: '1px solid',
  borderColor: alpha(theme.palette.divider, 0.1),
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    borderColor: '#1a237e',
  },
}));

function MyCases() {
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0
  });
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState({
    rating: 0,
    comment: '',
  });
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [hasFeedback, setHasFeedback] = useState(false);
  const [fileMetadata, setFileMetadata] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(false);

  useEffect(() => {
    const fetchCases = async () => {
      setLoading(true);
      const username = Cookies.get('username');

      if (username) {
        const casesCollectionRef = collection(db, 'cases');
        const q = query(casesCollectionRef, where('username', '==', username));

        try {
          const querySnapshot = await getDocs(q);
          const casesData = [];
          let completedCount = 0;

          querySnapshot.forEach((doc) => {
            const caseData = { id: doc.id, ...doc.data() };
            casesData.push(caseData);
            if (caseData.status === 'Completed') {
              completedCount++;
            }
          });

          setCases(casesData);
          setStats({
            total: casesData.length,
            completed: completedCount
          });
        } catch (error) {
          console.error('Error fetching cases:', error);
        }
      }
      setLoading(false);
    };

    fetchCases();
  }, []);

  const checkFeedbackExists = async (caseId) => {
    try {
      const feedbackRef = collection(db, 'feedback');
      const q = query(feedbackRef, where('caseId', '==', caseId));
      const querySnapshot = await getDocs(q);
      setHasFeedback(!querySnapshot.empty);
    } catch (error) {
      console.error('Error checking feedback:', error);
      setHasFeedback(false);
    }
  };

  const fetchFileMetadata = async (fileUrls) => {
    setLoadingFiles(true);
    try {
      if (!fileUrls || !Array.isArray(fileUrls)) {
        console.log('No valid file URLs provided');
        setFileMetadata([]);
        setLoadingFiles(false);
        return;
      }

      const metadata = await Promise.all(
        fileUrls.map(async (fileData, index) => {
          try {
            // Handle different file data structures
            let filePath, fileName;
            
            if (typeof fileData === 'string') {
              filePath = fileData;
              fileName = fileData.split('/').pop();
            } else if (fileData.url) {
              filePath = fileData.url;
              fileName = fileData.name || fileData.url.split('/').pop();
            } else if (fileData.path) {
              filePath = fileData.path;
              fileName = fileData.name || fileData.path.split('/').pop();
            } else {
              console.log('Invalid file data:', fileData);
              return null;
            }

            // Remove any 'cases/' prefix if it exists in the path
            const cleanPath = filePath.replace(/^cases\//, '');
            const storageRef = ref(storage, `cases/${cleanPath}`);
            
            try {
              const downloadUrl = await getDownloadURL(storageRef);
              console.log('Successfully fetched URL for file:', fileName);
              
              return {
                url: downloadUrl,
                name: fileName,
                path: cleanPath,
                extension: fileName.split('.').pop()?.toLowerCase() || '',
                size: fileData.size || null,
                type: fileData.type || null
              };
            } catch (storageError) {
              console.log('Storage error for file:', fileName, storageError);
              // If it's already a valid URL, use it directly
              if (filePath.startsWith('http')) {
                return {
                  url: filePath,
                  name: fileName,
                  path: cleanPath,
                  extension: fileName.split('.').pop()?.toLowerCase() || ''
                };
              }
              return null;
            }
          } catch (error) {
            console.error('Error processing file:', error);
            return null;
          }
        })
      );

      const validMetadata = metadata.filter(item => item !== null);
      console.log('Valid file metadata:', validMetadata);
      setFileMetadata(validMetadata);
    } catch (error) {
      console.error('Error in fetchFileMetadata:', error);
      setFileMetadata([]);
    }
    setLoadingFiles(false);
  };

  const handleViewDetails = async (caseItem) => {
    setSelectedCase(caseItem);
    setFileMetadata([]); // Clear previous files
    setLoadingFiles(true);
    
    console.log('Case data:', caseItem);
    
    try {
      // Check all possible file locations in the case data
      let files = null;
      
      if (caseItem.fileUrls && Array.isArray(caseItem.fileUrls) && caseItem.fileUrls.length > 0) {
        files = caseItem.fileUrls;
        console.log('Found files in fileUrls:', files);
      } else if (caseItem.files && Array.isArray(caseItem.files) && caseItem.files.length > 0) {
        files = caseItem.files;
        console.log('Found files in files array:', files);
      } else if (caseItem.attachments && Array.isArray(caseItem.attachments) && caseItem.attachments.length > 0) {
        files = caseItem.attachments;
        console.log('Found files in attachments:', files);
      } else if (caseItem.documents && Array.isArray(caseItem.documents) && caseItem.documents.length > 0) {
        files = caseItem.documents;
        console.log('Found files in documents:', files);
      }

      if (files) {
        await fetchFileMetadata(files);
      } else {
        console.log('No files found in case:', caseItem.id);
        setFileMetadata([]);
        setLoadingFiles(false);
      }
    } catch (error) {
      console.error('Error in handleViewDetails:', error);
      setFileMetadata([]);
      setLoadingFiles(false);
    }
    
    if (caseItem.status === 'Completed') {
      await checkFeedbackExists(caseItem.id);
    }
  };

  const handleStatusChange = async (caseId, newStatus) => {
    try {
      const caseRef = doc(db, 'cases', caseId);
      await updateDoc(caseRef, {
        status: newStatus,
        lastUpdated: serverTimestamp()
      });

      // Update local state
      setCases(prevCases => 
        prevCases.map(c => 
          c.id === caseId ? { ...c, status: newStatus } : c
        )
      );

      // If case is completed, show feedback dialog
      if (newStatus === 'Completed') {
        setShowFeedback(true);
      }

      // Update stats
      setStats(prevStats => ({
        ...prevStats,
        completed: newStatus === 'Completed' 
          ? prevStats.completed + 1 
          : prevStats.completed
      }));

    } catch (error) {
      console.error('Error updating case status:', error);
    }
  };

  const handleFeedbackSubmit = async () => {
    if (!feedback.rating || !feedback.comment) return;

    setSubmittingFeedback(true);
    try {
      // Add feedback to Firebase
      await addDoc(collection(db, 'feedback'), {
        caseId: selectedCase.id,
        caseTitle: selectedCase.caseTitle,
        clientName: selectedCase.caseAssignee,
        rating: feedback.rating,
        comment: feedback.comment,
        timestamp: serverTimestamp(),
        lawyer: Cookies.get('username')
      });

      // Reset feedback form and close dialog
      setFeedback({ rating: 0, comment: '' });
      setShowFeedback(false);
      setSelectedCase(null);

    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'Completed':
        return (
          <Chip 
            label="Completed"
            color="success"
            size="small"
            sx={{ mb: 2 }}
          />
        );
      case 'In Progress':
        return (
          <Chip 
            label="In Progress"
            color="primary"
            size="small"
            sx={{ 
              mb: 2,
              bgcolor: '#1a237e',
              '& .MuiChip-label': {
                color: 'white'
              }
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <PageContainer>
      <MainCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <SideSection
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Box sx={{ 
            position: 'relative', 
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            height: 'auto'
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
              <GavelIcon sx={{ fontSize: 48, mb: 3 }} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
                My Cases
              </Typography>
              <Typography variant="body1" sx={{ mb: 6, opacity: 0.9, lineHeight: 1.5 }}>
                View and manage your case portfolio
              </Typography>
            </motion.div>

            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <StatsItem variants={statsVariants}>
                <Box sx={{ 
                  width: 48, 
                  height: 48, 
                  borderRadius: 2, 
                  bgcolor: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FolderIcon sx={{ fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {stats.total}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Total Cases
                  </Typography>
                </Box>
              </StatsItem>

              <StatsItem variants={statsVariants}>
                <Box sx={{ 
                  width: 48, 
                  height: 48, 
                  borderRadius: 2, 
                  bgcolor: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <CheckCircleIcon sx={{ fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {stats.completed}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Completed Cases
                  </Typography>
                </Box>
              </StatsItem>
            </motion.div>
          </Box>
        </SideSection>

        <MainSection
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {loading ? (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100%' 
            }}>
              <motion.div
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <CircularProgress size={60} thickness={4} sx={{ color: '#1a237e' }} />
              </motion.div>
            </Box>
          ) : cases.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                height: '100%',
                gap: 2
              }}>
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <FolderIcon sx={{ fontSize: 64, color: 'text.secondary', opacity: 0.5 }} />
                </motion.div>
                <Typography variant="h5" color="text.secondary">
                  No cases found
                </Typography>
                <Typography variant="body1" color="text.secondary" align="center">
                  Start by adding your first case using the "Add New Case" button
                </Typography>
              </Box>
            </motion.div>
          ) : (
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <Grid container spacing={3}>
                <AnimatePresence>
                  {cases.map((caseItem, index) => (
                    <Grid item xs={12} md={6} key={caseItem.id}>
                      <CaseCard
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover="hover"
                        layout
                      >
                        <CardContent>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="h6" gutterBottom sx={{ 
                              color: '#1a237e', 
                              fontWeight: 600,
                              background: 'linear-gradient(45deg, #1a237e, #283593)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                            }}>
                              {caseItem.caseTitle}
                            </Typography>
                            {getStatusChip(caseItem.status)}
                          </Box>

                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CategoryIcon color="action" sx={{ fontSize: '1.25rem' }} />
                                <Typography variant="body2">
                                  <strong>Type:</strong> {caseItem.caseType}
                                </Typography>
                              </Box>
                            </Grid>

                            <Grid item xs={12}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <PersonIcon color="action" sx={{ fontSize: '1.25rem' }} />
                                <Typography variant="body2">
                                  <strong>Client:</strong> {caseItem.caseAssignee}
                                </Typography>
                              </Box>
                            </Grid>

                            <Grid item xs={12}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <DateRangeIcon color="action" sx={{ fontSize: '1.25rem' }} />
                                <Typography variant="body2">
                                  <strong>Filed on:</strong> {caseItem.timestamp ? 
                                    new Date(caseItem.timestamp.seconds * 1000).toLocaleDateString() :
                                    caseItem.filingDateTime || 'Date not available'
                                  }
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>

                          <Box sx={{ mt: 2 }}>
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                              <ViewButton
                                variant="outlined"
                                startIcon={<VisibilityIcon />}
                                onClick={() => handleViewDetails(caseItem)}
                                fullWidth
                              >
                                View Details
                              </ViewButton>
                            </motion.div>
                          </Box>
                        </CardContent>
                      </CaseCard>
                    </Grid>
                  ))}
                </AnimatePresence>
              </Grid>
            </motion.div>
          )}
        </MainSection>
      </MainCard>

      <Dialog 
        open={selectedCase !== null} 
        onClose={() => setSelectedCase(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden',
            background: alpha('#fff', 0.9),
            backdropFilter: 'blur(10px)',
          }
        }}
        TransitionComponent={motion.div}
      >
        {selectedCase && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <DialogTitle sx={{ 
              background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 3
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <motion.div
                  initial={{ rotate: -180, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <GavelIcon sx={{ fontSize: 32 }} />
                </motion.div>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Case Details
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
                    View complete information about the case
                  </Typography>
                </Box>
              </Box>
              <IconButton 
                onClick={() => setSelectedCase(null)}
                sx={{ color: 'white' }}
              >
                <motion.div whileHover={{ rotate: 90 }} transition={{ duration: 0.2 }}>
                  <CloseIcon />
                </motion.div>
              </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ p: 4 }}>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Typography variant="h5" gutterBottom sx={{ 
                    fontWeight: 600,
                    background: 'linear-gradient(45deg, #1a237e, #283593)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    {selectedCase.caseTitle}
                  </Typography>
                  {getStatusChip(selectedCase.status)}
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <DescriptionIcon color="action" sx={{ mt: 0.5 }} />
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Description
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                        {selectedCase.caseDescription}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CategoryIcon color="action" />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Case Type
                      </Typography>
                      <Typography variant="body1">
                        {selectedCase.caseType}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <PersonIcon color="action" />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Client Name
                      </Typography>
                      <Typography variant="body1">
                        {selectedCase.caseAssignee}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" gutterBottom fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FolderIcon color="primary" />
                      Attached Files
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      View and download case-related documents
                    </Typography>
                  </Box>
                  {loadingFiles ? (
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center', 
                      p: 3 
                    }}>
                      <CircularProgress size={40} thickness={4} sx={{ color: '#1a237e' }} />
                    </Box>
                  ) : fileMetadata.length > 0 ? (
                    <Grid container spacing={2}>
                      {fileMetadata.map((file, index) => {
                        let FileIcon = DescriptionIcon;
                        if (['pdf'].includes(file.extension)) {
                          FileIcon = PictureAsPdfIcon;
                        } else if (['jpg', 'jpeg', 'png', 'gif'].includes(file.extension)) {
                          FileIcon = ImageIcon;
                        } else if (['doc', 'docx'].includes(file.extension)) {
                          FileIcon = ArticleIcon;
                        }

                        return (
                          <Grid item xs={12} sm={6} key={index}>
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <FileCard
                                onClick={() => window.open(file.url, '_blank')}
                              >
                                <Box sx={{ 
                                  width: 40, 
                                  height: 40, 
                                  borderRadius: 1,
                                  bgcolor: alpha('#1a237e', 0.1),
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}>
                                  <FileIcon sx={{ color: '#1a237e' }} />
                                </Box>
                                <Box sx={{ flex: 1, overflow: 'hidden' }}>
                                  <Typography variant="subtitle2" noWrap sx={{ fontWeight: 600 }}>
                                    {file.name}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                                    {file.extension}
                                  </Typography>
                                </Box>
                                <IconButton 
                                  size="small" 
                                  sx={{ 
                                    color: '#1a237e',
                                    '&:hover': {
                                      bgcolor: alpha('#1a237e', 0.1)
                                    }
                                  }}
                                >
                                  <OpenInNewIcon fontSize="small" />
                                </IconButton>
                              </FileCard>
                            </motion.div>
                          </Grid>
                        );
                      })}
                    </Grid>
                  ) : (
                    <Box sx={{ 
                      p: 3, 
                      textAlign: 'center', 
                      bgcolor: alpha('#f5f5f5', 0.5),
                      borderRadius: 2,
                      border: '1px dashed',
                      borderColor: 'divider'
                    }}>
                      <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                        <NoPhotographyIcon />
                        No files attached to this case
                      </Typography>
                    </Box>
                  )}
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 3 }}>
              {selectedCase.status === 'Completed' ? (
                !hasFeedback && (
                  <Button
                    onClick={() => setShowFeedback(true)}
                    variant="contained"
                    color="primary"
                    startIcon={<StarIcon />}
                    sx={{ mr: 1 }}
                  >
                    Give Feedback
                  </Button>
                )
              ) : selectedCase.status === 'In Progress' ? (
                <Typography variant="body2" color="primary" sx={{ mr: 2 }}>
                  Case is being handled by lawyer
                </Typography>
              ) : (
                <Button
                  onClick={() => handleStatusChange(selectedCase.id, 'Completed')}
                  variant="contained"
                  color="primary"
                  sx={{ mr: 1 }}
                >
                  Mark as Completed
                </Button>
              )}
              <Button onClick={() => {
                setSelectedCase(null);
                setHasFeedback(false);
              }}>
                Close
              </Button>
            </DialogActions>
          </motion.div>
        )}
      </Dialog>

      <FeedbackDialog
        open={showFeedback}
        onClose={() => !submittingFeedback && setShowFeedback(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
          color: 'white',
          py: 3
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <StarIcon />
            <Typography variant="h6">Rate Your Experience</Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <Typography variant="subtitle1" gutterBottom>
                How would you rate your experience with this case?
              </Typography>
              <Rating
                name="rating"
                value={feedback.rating}
                onChange={(event, newValue) => {
                  setFeedback(prev => ({ ...prev, rating: newValue }));
                }}
                size="large"
                precision={0.5}
              />
            </Box>
            
            <TextField
              label="Share your experience"
              multiline
              rows={4}
              value={feedback.comment}
              onChange={(e) => setFeedback(prev => ({ ...prev, comment: e.target.value }))}
              fullWidth
              variant="outlined"
              placeholder="Tell us about your experience with the case and the lawyer..."
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setShowFeedback(false)}
            disabled={submittingFeedback}
          >
            Cancel
          </Button>
          <Button
            onClick={handleFeedbackSubmit}
            variant="contained"
            color="primary"
            disabled={!feedback.rating || !feedback.comment || submittingFeedback}
          >
            {submittingFeedback ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </DialogActions>
      </FeedbackDialog>
    </PageContainer>
  );
}

export default MyCases;
