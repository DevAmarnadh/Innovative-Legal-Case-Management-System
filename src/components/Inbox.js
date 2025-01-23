import React, { useState, useEffect, useRef } from 'react';
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
  IconButton,
  Alert,
  Paper,
  Divider,
  Chip,
  ButtonGroup,
  MenuItem,
  Badge,
  Avatar,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  styled,
  CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import GavelIcon from '@mui/icons-material/Gavel';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import { db, storage } from './firebase';
import { collection, getDocs, addDoc, deleteDoc, getDoc, doc, query, where, updateDoc } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import Cookies from 'js-cookie';
import axios from 'axios';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SendIcon from '@mui/icons-material/Send';
import AllInboxIcon from '@mui/icons-material/AllInbox';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import EventNoteIcon from '@mui/icons-material/EventNote';
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import NoMessagesImage from '../assets/no-messages.svg';
import CommunicationImage from '../assets/communication.svg';
import InfoIcon from '@mui/icons-material/Info';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { alpha } from '@mui/material/styles';
import DescriptionIcon from '@mui/icons-material/Description';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import ArticleIcon from '@mui/icons-material/Article';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import UpdateIcon from '@mui/icons-material/Update';
import VideocamIcon from '@mui/icons-material/Videocam';
import StopIcon from '@mui/icons-material/Stop';
import ReplayIcon from '@mui/icons-material/Replay';

// Styled components
const drawerWidth = 280;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(4),
    marginLeft: drawerWidth,
    background: 'linear-gradient(135deg, #f5f7fa 0%, #ebedee 100%)',
    minHeight: '100vh',
    paddingTop: '64px',
    overflowX: 'hidden',
    position: 'relative',
    zIndex: 0,
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'radial-gradient(circle at 50% 50%, rgba(26, 35, 126, 0.03) 0%, rgba(26, 35, 126, 0) 50%)',
    },
  })
);

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  position: 'fixed',
  zIndex: 1,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    backgroundColor: theme.palette.background.default,
    borderRight: 'none',
    boxShadow: '0 0 20px rgba(0,0,0,0.05)',
    paddingTop: '64px',
    height: '100%',
    position: 'fixed',
    zIndex: 1,
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      boxShadow: '0 0 30px rgba(0,0,0,0.1)',
    }
  },
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  justifyContent: 'center',
}));

const StyledListItem = styled(ListItem)(({ theme, active }) => ({
  margin: theme.spacing(0.5, 1),
  padding: theme.spacing(1.5, 2),
  borderRadius: theme.spacing(2),
  backgroundColor: active ? '#1a237e' : 'transparent',
  color: active ? '#ffffff' : theme.palette.text.primary,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    backgroundColor: active ? '#283593' : 'rgba(0, 0, 0, 0.04)',
    transform: 'translateX(8px)',
  },
  '& .MuiListItemIcon-root': {
    minWidth: '40px',
    color: 'inherit',
    opacity: active ? 1 : 0.7,
    transition: 'opacity 0.3s ease',
  },
  '& .MuiListItemText-primary': {
    fontWeight: active ? 600 : 500,
    fontSize: '0.95rem',
    transition: 'all 0.3s ease',
  },
  '& .MuiChip-root': {
    minWidth: '32px',
    height: '24px',
    fontWeight: 600,
    backgroundColor: active ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.08)',
    color: active ? '#ffffff' : theme.palette.text.primary,
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'scale(1.05)',
      backgroundColor: active ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.12)',
    }
  },
}));

const StyledInboxHeader = styled(Paper)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .1)',
}));

const StyledMessageCard = styled(Card)(({ theme, type }) => ({
  position: 'relative',
  overflow: 'visible',
  borderRadius: theme.spacing(0.75),
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  border: '1px solid rgba(0,0,0,0.06)',
  boxShadow: 'none',
  marginBottom: theme.spacing(0.75),
  cursor: 'pointer',
  background: '#fff',
  '&:hover': {
    transform: 'translateX(8px)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '2px',
    backgroundColor: type,
    borderTopLeftRadius: theme.spacing(0.75),
    borderBottomLeftRadius: theme.spacing(0.75),
    transition: 'width 0.3s ease',
  },
  '&:hover::before': {
    width: '4px',
  }
}));

const MessageTypeChip = styled(Chip)(({ theme }) => ({
  borderRadius: '16px',
  fontWeight: 500,
  textTransform: 'capitalize',
}));

// Add new styled components
const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.spacing(2),
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const ContactButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1.5),
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    transform: 'translateY(-3px)',
    boxShadow: '0 6px 20px rgba(26,35,126,0.15)',
  },
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '1rem',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  position: 'relative',
  overflow: 'hidden',
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
  }
}));

const InfoItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  backgroundColor: 'rgba(26, 35, 126, 0.04)',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(26, 35, 126, 0.08)',
  }
}));

const StyledInfoIcon = styled(Box)(({ theme }) => ({
  width: 45,
  height: 45,
  borderRadius: theme.spacing(1),
  backgroundColor: 'rgba(26, 35, 126, 0.12)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#1a237e',
  '& svg': {
    fontSize: 24,
  }
}));

const StatsChip = styled(Chip)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  backgroundColor: 'rgba(26, 35, 126, 0.08)',
  color: '#1a237e',
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

// Add this new styled component
const UpdateCard = styled(Box)(({ theme }) => ({
  background: alpha(theme.palette.primary.main, 0.03),
  borderRadius: theme.spacing(1),
  padding: theme.spacing(2),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  marginTop: theme.spacing(2),
}));

// Helper function to parse timestamps
const parseTimestamp = (timestamp) => {
  if (!timestamp) return new Date(0); // Default to epoch if no timestamp
  if (timestamp instanceof Date) {
    return timestamp;
  } else if (timestamp.toDate) {
    return timestamp.toDate();
  } else if (typeof timestamp === 'string') {
    return new Date(timestamp);
  }
  return new Date(0); // Default to epoch if no valid timestamp
};

const MessageContent = ({ message }) => (
  <Box sx={{ mb: 2 }}>
    {/* Request Message */}
    {message.type === "reqMsg" && (
      <>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.light' }}>
            <PersonIcon sx={{ fontSize: 16 }} />
          </Avatar>
          <Typography variant="subtitle2">{message.from}</Typography>
        </Box>
        <Box sx={{ 
          bgcolor: 'background.default',
          p: 2,
          borderRadius: 1,
          border: '1px solid rgba(0,0,0,0.04)'
        }}>
          <Typography variant="subtitle1" gutterBottom sx={{ color: 'primary.main' }}>
            {message.caseTitle}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
            {message.message}
          </Typography>
        </Box>

        {/* Show Case Update if exists */}
        {message.caseUpdate && (
          <UpdateCard>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <InfoIcon color="primary" />
              <Typography variant="subtitle2" color="primary">
                Case Update
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
              {message.caseUpdate}
            </Typography>
          </UpdateCard>
        )}

        {/* Show Files if attached */}
        {message.files && message.files.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AttachFileIcon fontSize="small" />
              Attached Files:
            </Typography>
            <Grid container spacing={1}>
              {message.files.map((file, index) => {
                let FileIcon = DescriptionIcon;
                const extension = file.name.split('.').pop()?.toLowerCase();
                
                if (['pdf'].includes(extension)) {
                  FileIcon = PictureAsPdfIcon;
                } else if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
                  FileIcon = ImageIcon;
                } else if (['doc', 'docx'].includes(extension)) {
                  FileIcon = ArticleIcon;
                }

                return (
                  <Grid item xs={12} sm={6} key={index}>
                    <Paper
                      sx={{
                        p: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: 'action.hover'
                        }
                      }}
                      onClick={() => window.open(file.url, '_blank')}
                    >
                      <FileIcon color="primary" />
                      <Typography variant="body2" noWrap sx={{ flex: 1 }}>
                        {file.name}
                      </Typography>
                      <IconButton size="small">
                        <OpenInNewIcon fontSize="small" />
                      </IconButton>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        )}
      </>
    )}

    {/* Hearing Message */}
    {message.type === "hearingMsg" && (
      <>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <Avatar sx={{ width: 24, height: 24, bgcolor: '#1a237e' }}>
            <PersonIcon sx={{ fontSize: 16 }} />
          </Avatar>
          <Typography variant="subtitle2">{message.sender}</Typography>
        </Box>
        <Box sx={{ 
          bgcolor: 'background.default',
          p: 2,
          borderRadius: 1,
          border: '1px solid rgba(0,0,0,0.04)'
        }}>
          <Typography variant="subtitle1" gutterBottom sx={{ color: '#1a237e' }}>
            {message.caseTitle}
          </Typography>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
            {message.hearingDetails}
          </Typography>
        </Box>
      </>
    )}

    {/* Case Taken Message */}
    {message.type === "caseTaken" && (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1 
      }}>
        <Typography 
          variant="subtitle2" 
          color="primary.main" 
          sx={{ 
            fontWeight: 500,
            fontSize: '0.875rem',
            lineHeight: 1.2
          }}
        >
          {message.caseTitle || message.caseDetails?.caseTitle}
        </Typography>
        {message.timestamp && (
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{ fontSize: '0.75rem' }}
          >
            {parseTimestamp(message.timestamp).toLocaleString()}
          </Typography>
        )}
      </Box>
    )}

    {/* Client Confirmation Message */}
    {message.type === "clientConfirmation" && (
      <>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <Avatar sx={{ width: 24, height: 24, bgcolor: '#e91e63' }}>
            <PersonIcon sx={{ fontSize: 16 }} />
          </Avatar>
          <Box>
            <Typography variant="subtitle2">{message.from}</Typography>
            {message.clientEmail && (
              <Typography variant="caption" color="text.secondary">
                {message.clientEmail}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Main Message */}
        <Box sx={{ 
          bgcolor: 'background.default',
          p: 2,
          borderRadius: 1,
          border: '1px solid rgba(0,0,0,0.04)'
        }}>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
            {message.originalMessage}
          </Typography>
        </Box>

        {/* Case Update Section */}
        {message.caseUpdate && (
          <UpdateCard>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <InfoIcon color="primary" />
              <Typography variant="subtitle2" color="primary">
                Case Update
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
              {message.caseUpdate}
            </Typography>
          </UpdateCard>
        )}

        {/* Attached Files Section */}
        {message.files && message.files.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AttachFileIcon fontSize="small" />
              Attached Files:
            </Typography>
            <Grid container spacing={1}>
              {message.files.map((file, index) => {
                let FileIcon = DescriptionIcon;
                const extension = file.name.split('.').pop()?.toLowerCase();
                
                if (['pdf'].includes(extension)) {
                  FileIcon = PictureAsPdfIcon;
                } else if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
                  FileIcon = ImageIcon;
                } else if (['doc', 'docx'].includes(extension)) {
                  FileIcon = ArticleIcon;
                }

                return (
                  <Grid item xs={12} sm={6} key={index}>
                    <Paper
                      sx={{
                        p: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: 'action.hover'
                        }
                      }}
                      onClick={() => window.open(file.url, '_blank')}
                    >
                      <FileIcon color="primary" />
                      <Typography variant="body2" noWrap sx={{ flex: 1 }}>
                        {file.name}
                      </Typography>
                      <IconButton size="small">
                        <OpenInNewIcon fontSize="small" />
                      </IconButton>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        )}

        {/* Add video preview if exists */}
        {message.videoURL && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <VideocamIcon fontSize="small" />
              Recorded Video:
            </Typography>
            <Box sx={{ 
              width: '100%', 
              maxWidth: 400,
              borderRadius: 1,
              overflow: 'hidden',
              boxShadow: 1
            }}>
              <video 
                controls 
                src={message.videoURL}
                style={{ width: '100%', height: 'auto' }}
              />
            </Box>
          </Box>
        )}

        {/* Message Tags */}
        <Box sx={{ display: 'flex', gap: 1, mt: 1.5 }}>
          {message.messageType === 'direct' && (
            <Chip 
              label="Direct Message"
              size="small"
              sx={{
                bgcolor: 'rgba(26, 35, 126, 0.08)',
                color: '#1a237e',
              }}
              icon={<EmailIcon sx={{ color: '#1a237e' }} />}
            />
          )}
          {message.relatedCase && (
            <Chip 
              label={message.caseTitle || 'Case Update'}
              size="small"
              color="primary"
              icon={<FolderSpecialIcon />}
            />
          )}
          {message.department && (
            <Chip 
              label={message.department}
              size="small"
              color="secondary"
            />
          )}
        </Box>
      </>
    )}
  </Box>
);

function Inbox() {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [loggedInUsername, setLoggedInUsername] = useState('');
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [selectedCaseDetails, setSelectedCaseDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hearingDetails, setHearingDetails] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [userRole, setUserRole] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState(null);
  const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [selectedLawyer, setSelectedLawyer] = useState('');
  const [availableLawyers, setAvailableLawyers] = useState([]);
  const [replyHearingModalOpen, setReplyHearingModalOpen] = useState(false);
  const [selectedClientMessage, setSelectedClientMessage] = useState(null);
  const [messageStats, setMessageStats] = useState({
    reqMsgCount: 0,
    hearingMsgCount: 0,
    caseTakenCount: 0,
    clientMsgCount: 0,
    caseUpdateCount: 0
  });
  const [caseStatusModalOpen, setCaseStatusModalOpen] = useState(false);
  const [selectedCaseForStatus, setSelectedCaseForStatus] = useState(null);
  const [caseStatus, setCaseStatus] = useState('');
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(5);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [caseUpdate, setCaseUpdate] = useState('');
  const [selectedCase, setSelectedCase] = useState('');
  const [userCases, setUserCases] = useState([]);
  const [messageType, setMessageType] = useState('direct');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordingPreview, setRecordingPreview] = useState('');
  const videoRef = useRef(null);
  const mediaChunks = useRef([]);

  const calculateMessageStats = (messages) => {
    const stats = {
      reqMsgCount: 0,
      hearingMsgCount: 0,
      caseTakenCount: 0,
      clientMsgCount: 0,
      caseUpdateCount: 0
    };

    messages.forEach(message => {
      switch (message.type) {
        case 'reqMsg':
          if (message.messageType === 'update') {
            stats.caseUpdateCount++;
          } else if (message.messageType === 'direct') {
            stats.clientMsgCount++;  // Count direct messages as client messages
          } else {
            stats.reqMsgCount++;
          }
          break;
        case 'clientConfirmation':
          if (message.messageType === 'update') {
            stats.caseUpdateCount++;
          } else if (message.messageType === 'direct') {
            stats.clientMsgCount++;  // Only count direct messages as client messages
          }
          break;
        case 'hearingMsg':
          stats.hearingMsgCount++;
          break;
        case 'caseTaken':
          stats.caseTakenCount++;
          break;
        default:
          break;
      }
    });

    return stats;
  };

  const handleCaseTakenMessage = async (message) => {
    try {
      if (!message.caseDetails) return;

      // Create a notification message for the client
      const clientNotification = {
        type: 'caseTaken',
        username: message.caseDetails.username, // Send to the client
        lawyerName: loggedInUsername, // Add lawyer's name
        message: `Lawyer ${loggedInUsername} has taken up your case: ${message.caseDetails.caseTitle}`,
        timestamp: new Date(),
        caseTitle: message.caseDetails.caseTitle,
        email: message.caseDetails.email
      };

      // Send notification to client
      const messagesCollectionRef = collection(db, 'messages');
      await addDoc(messagesCollectionRef, clientNotification);

      // Send confirmation message for lawyer
      const lawyerConfirmation = {
        type: 'confirmation',
        username: loggedInUsername,
        message: `You have taken up the case: ${message.caseDetails.caseTitle} from client ${message.caseDetails.username}`,
        timestamp: new Date(),
        status: 'sent',
        caseTitle: message.caseDetails.caseTitle
      };
      await addDoc(messagesCollectionRef, lawyerConfirmation);

      // Send email notification if client email is available
      if (message.caseDetails.email) {
        const body = {
          name: message.caseDetails.username,
          intro: `Lawyer ${loggedInUsername} has taken up your case: ${message.caseDetails.caseTitle}`,
          outro: "Thank you for choosing Justice Portal. We are dedicated to serving you and ensuring your legal needs are met with professionalism and care."
        };

        await axios.post('https://justice-portal-server.vercel.app/api/submit/message', {
          userEmail: message.caseDetails.email,
          userName: message.caseDetails.username,
          mailBody: body,
          subject: "Case Taken by Lawyer"
        });
      }

      // Show success message
      setSnackbarMessage('Case taken notification sent to client!');
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error sending case taken notification:", error);
      setSnackbarMessage('Error sending case taken notification');
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const cookieUsername = Cookies.get('username');
        console.log("Retrieved username from cookies:", cookieUsername);
        
        if (cookieUsername) {
          setLoggedInUsername(cookieUsername);
          
          // Fetch user role
          const usersCollection = collection(db, 'users');
          const userSnapshot = await getDocs(query(usersCollection, where('username', '==', cookieUsername)));
          userSnapshot.forEach((doc) => {
            const userData = doc.data();
            setUserRole(userData.role);
          });
      
          const messagesCollection = collection(db, 'messages');
          const requestsCollection = collection(db, 'requests');
      
          const messagesSnapshot = await getDocs(messagesCollection);
          const requestsSnapshot = await getDocs(query(requestsCollection, where('username', '==', cookieUsername)));
      
          const messagesData = [];
      
          // Process messages
          for (const doc of messagesSnapshot.docs) {
            const messageData = doc.data();
            
            // Skip empty or invalid messages
            if (!messageData || !messageData.type) continue;
            
            // Include messages that are:
            // 1. Addressed to the current user
            // 2. Case taken messages where the user is either the lawyer or the client
            // 3. Exclude direct messages from reqMsg section
            if (messageData.username === cookieUsername || 
               (messageData.type === 'caseTaken' && (
                 messageData.username === cookieUsername || 
                 messageData.lawyerName === cookieUsername ||
                 (messageData.caseDetails && (
                   messageData.caseDetails.username === cookieUsername ||
                   messageData.caseDetails.lawyerName === cookieUsername
                 ))
               ))) {
              
              // Skip messages without required content
              if (messageData.type === 'hearingMsg' && !messageData.hearingDetails) continue;
              if (messageData.type === 'reqMsg' && !messageData.message) continue;
              if (messageData.type === 'clientConfirmation' && !messageData.originalMessage) continue;
              
              // Don't include direct messages in reqMsg type
              if (messageData.type === 'clientConfirmation' && messageData.messageType === 'direct') {
                messagesData.push({ id: doc.id, ...messageData });
              } else if (messageData.type !== 'clientConfirmation') {
                messagesData.push({ id: doc.id, ...messageData });
              }
            }
          }
      
          // Fetch and process messages from the 'requests' collection
          requestsSnapshot.forEach((doc) => {
            const requestData = doc.data();
            // Skip empty requests or requests without messages
            if (!requestData || !requestData.message) return;
            // Only add if it's not a direct message
            if (!requestData.messageType || requestData.messageType !== 'direct') {
              messagesData.push({ id: doc.id, ...requestData, type: 'reqMsg' });
            }
          });
      
          // Sort messages by timestamp
          messagesData.sort((a, b) => {
            const timestampA = parseTimestamp(a.timestamp);
            const timestampB = parseTimestamp(b.timestamp);
            return timestampB - timestampA;
          });
      
          console.log("Final messages data:", messagesData);
          setMessages(messagesData);
          setFilteredMessages(messagesData);
          setMessageStats(calculateMessageStats(messagesData));
        } else {
          console.log("No username found in cookies.");
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, []);

  useEffect(() => {
    if (activeFilter === 'all') {
      const validMessages = messages.filter(message => 
        message && message.type && (
          (message.type === 'hearingMsg' && message.hearingDetails) ||
          (message.type === 'reqMsg' && message.message) ||
          (message.type === 'clientConfirmation' && message.originalMessage) ||
          message.type === 'caseTaken'
        )
      );
      setFilteredMessages(validMessages);
    } else if (activeFilter === 'reqMsg') {
      // Filter out case updates and direct messages from client requests
      const filtered = messages.filter(message => 
        message.type === 'reqMsg' && 
        message.message && 
        (!message.messageType || message.messageType === 'case') &&
        message.messageType !== 'update'
      );
      setFilteredMessages(filtered);
    } else if (activeFilter === 'clientConfirmation') {
      // Show only direct messages in client messages section, excluding case updates
      const filtered = messages.filter(message => 
        ((message.type === 'clientConfirmation' && message.originalMessage && message.messageType === 'direct') || 
        (message.type === 'reqMsg' && message.messageType === 'direct' && message.message))
      );
      setFilteredMessages(filtered);
    } else if (activeFilter === 'caseUpdate') {
      // Show only case update messages in case updates section
      const filtered = messages.filter(message => 
        (message.type === 'reqMsg' || message.type === 'clientConfirmation') && 
        message.messageType === 'update'
      );
      setFilteredMessages(filtered);
    } else {
      const filtered = messages.filter(message => 
        message.type === activeFilter && (
          message.type !== 'hearingMsg' || message.hearingDetails
        )
      );
      setFilteredMessages(filtered);
    }
  }, [activeFilter, messages]);

  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        const lawyersCollection = collection(db, 'users');
        const q = query(lawyersCollection, where('role', '==', 'Lawyers/Attorneys'));
        const querySnapshot = await getDocs(q);
        const lawyersData = [];
        querySnapshot.forEach((doc) => {
          const lawyer = doc.data();
          lawyersData.push({
            username: lawyer.username,
            email: lawyer.email,
            department: lawyer.department
          });
        });
        setAvailableLawyers(lawyersData);
      } catch (error) {
        console.error('Error fetching lawyers:', error);
      }
    };

    fetchLawyers();
  }, []);

  useEffect(() => {
    const fetchUserCases = async () => {
      try {
        const username = Cookies.get('username');
        if (!username) return;

        const casesRef = collection(db, 'cases');
        const q = query(casesRef, where('username', '==', username));
        const querySnapshot = await getDocs(q);
        
        const cases = [];
        querySnapshot.forEach((doc) => {
          cases.push({ id: doc.id, ...doc.data() });
        });
        
        setUserCases(cases);
      } catch (error) {
        console.error('Error fetching cases:', error);
      }
    };

    fetchUserCases();
  }, []);

  const handleAddHearing = (caseId, caseDetails) => {
    setSelectedCaseId(caseId);
    setSelectedCaseDetails(caseDetails); // Store selected case details
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCaseId(null);
    setHearingDetails('');
  };

  const handleSendHearing = async () => {
    try {
      // Validate inputs
      if (!hearingDetails) {
        setSnackbarMessage('Please enter hearing details');
        setSnackbarOpen(true);
        return;
      }

      if (!selectedCaseDetails) {
        setSnackbarMessage('No case selected');
        setSnackbarOpen(true);
      return;
    }
  
    const { username, caseTitle, email } = selectedCaseDetails;

      // Validate required fields
      if (!username || !caseTitle) {
        setSnackbarMessage('Missing required case information');
        setSnackbarOpen(true);
        return;
      }

      // Create messages collection reference
      const messagesCollectionRef = collection(db, 'messages');
  
      // Send hearing message
      const newMessage = {
        sender: loggedInUsername,
        username: username,
        hearingDetails: hearingDetails,
        type: "hearingMsg",
        email: email || '',
        caseTitle: caseTitle,
        timestamp: new Date(),
        status: 'sent'
      };
      
      // Add hearing message
      const hearingMessageRef = await addDoc(messagesCollectionRef, newMessage);
      
      if (!hearingMessageRef) {
        throw new Error('Failed to send hearing message');
      }

      // Send confirmation message for lawyer
      const confirmationMessage = {
        username: loggedInUsername,
        type: "confirmation",
        message: `Hearing details sent to client ${username} for case: ${caseTitle}`,
        caseTitle: caseTitle,
        timestamp: new Date(),
        status: "sent",
        hearingMessageId: hearingMessageRef.id
      };

      // Add confirmation message
      await addDoc(messagesCollectionRef, confirmationMessage);

      // Only send email if we have the client's email
      if (email) {
        try {
      const body = {
        name: username,
            intro: `Lawyer ${loggedInUsername} has sent you hearing details for case: ${caseTitle}\n\nHearing Details: ${hearingDetails}`,
        outro: "Thank you for choosing Justice Portal. We are dedicated to serving you and ensuring your legal needs are met with professionalism and care."
      };

          await axios.post('https://justice-portal-server.vercel.app/api/submit/message', {
            userEmail: email,
            userName: username,
            mailBody: body,
            subject: "New Hearing Details from Lawyer"
          });
        } catch (emailError) {
          console.error("Error sending email notification:", emailError);
          // Don't fail the whole operation if email fails
          setSnackbarMessage('Hearing details sent, but email notification failed');
      setSnackbarOpen(true);
          handleCloseModal();
          return;
        }
      }

      // Update messages state to include the new message
      setMessages(prevMessages => [...prevMessages, { ...newMessage, id: hearingMessageRef.id }]);

      setSnackbarMessage('Hearing details sent successfully!');
      setSnackbarOpen(true);
      handleCloseModal();
    } catch (error) {
      console.error("Error sending hearing details:", error);
      setSnackbarMessage(error.message || 'Error sending hearing details. Please try again.');
      setSnackbarOpen(true);
    }
  };

  const handleOpenDeleteModal = (message) => {
    setMessageToDelete(message);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setMessageToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!messageToDelete) return;

    const { id, type } = messageToDelete;

    try {
      const collectionName = type === 'reqMsg' ? 'requests' : 'messages';
      const messageRef = doc(db, collectionName, id);
      const messageSnapshot = await getDoc(messageRef);
      const messageData = messageSnapshot.data();

      await deleteDoc(messageRef);
      console.log("Message deleted from", collectionName);

      // Update the state to remove the deleted message
      setMessages((prevMessages) => prevMessages.filter(message => message.id !== id));
      
      setSnackbarMessage('Message deleted successfully!');
      setSnackbarOpen(true);

      // Log deletion in the 'log' collection
      const logEntry = {
        message: `Message with ID ${id} deleted from ${collectionName} collection.`,
        deletionTimestamp: new Date(),
        deletedBy: Cookies.get('username'), // Get lawyer name from cookie
        messageType: type,
        messageData: messageData // Include message data if needed
      };
      const logCollectionRef = collection(db, 'log');
      await addDoc(logCollectionRef, logEntry);

      handleCloseDeleteModal();
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const getMessageColor = (type) => {
    switch (type) {
      case "reqMsg":
        return "#4caf50";
      case "hearingMsg":
        return "#2196f3";
      case "caseTaken":
        return "#ff9800";
      case "confirmation":
        return "#9c27b0";
      case "clientConfirmation":
        return "#e91e63"; // Pink for client confirmations
      default:
        return "#9e9e9e";
    }
  };

  const getMessageIcon = (type) => {
    switch (type) {
      case "reqMsg":
        return <EmailIcon />;
      case "hearingMsg":
        return <GavelIcon />;
      case "caseTaken":
        return <AttachFileIcon />;
      case "confirmation":
        return <CheckCircleIcon />;
      case "clientConfirmation":
        return <PersonIcon />;
      default:
        return <EmailIcon />;
    }
  };

  const getFileName = (filePath) => {
    if (!filePath) return '';
    const parts = filePath.split('/');
    return parts[parts.length - 1];
  };

  const handleFileUpload = async (files) => {
    const uploadedFiles = [];
    setUploadProgress(true);

    try {
      for (const file of files) {
        const fileRef = storageRef(storage, `case-updates/${Date.now()}_${file.name}`);
        await uploadBytes(fileRef, file);
        const downloadURL = await getDownloadURL(fileRef);
        uploadedFiles.push({
          name: file.name,
          url: downloadURL,
          type: file.type,
          size: file.size
        });
      }
      setSelectedFiles(prev => [...prev, ...uploadedFiles]);
    } catch (error) {
      console.error('Error uploading files:', error);
      setSnackbarMessage('Error uploading files');
      setSnackbarOpen(true);
    }
    
    setUploadProgress(false);
  };

  const resetForm = () => {
    setMessageText('');
    setSelectedLawyer('');
    setSelectedFiles([]);
    setCaseUpdate('');
    setSelectedCase('');
    setMessageType('direct');
    setRecordedVideo(null);
    setRecordingPreview('');
    if (mediaRecorder) {
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      mediaChunks.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          mediaChunks.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        const blob = new Blob(mediaChunks.current, { type: 'video/webm' });
        const videoURL = URL.createObjectURL(blob);
        setRecordingPreview(videoURL);
        setRecordedVideo(blob);
        
        // Stop all tracks of the stream
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      setSnackbarMessage('Error starting video recording. Please check camera permissions.');
      setSnackbarOpen(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const discardRecording = () => {
    setRecordedVideo(null);
    setRecordingPreview('');
    if (mediaRecorder) {
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleSendMessage = async () => {
    try {
      if (!messageText || !selectedLawyer || (messageType === 'update' && !selectedCase)) {
        setSnackbarMessage('Please fill in all required fields');
        setSnackbarOpen(true);
        return;
      }

      let videoURL = '';
      if (recordedVideo) {
        const videoRef = storageRef(storage, `recorded-videos/${Date.now()}_video.webm`);
        await uploadBytes(videoRef, recordedVideo);
        videoURL = await getDownloadURL(videoRef);
      }

      const selectedLawyerData = availableLawyers.find(lawyer => lawyer.username === selectedLawyer);
      const selectedCaseData = messageType === 'update' ? userCases.find(c => c.id === selectedCase) : null;
      
      // Create message data
      const messageData = {
        type: 'reqMsg',
        from: loggedInUsername,
        username: selectedLawyer,
        message: messageText,
        timestamp: new Date(),
        email: selectedLawyerData.email,
        messageType: messageType,
        files: selectedFiles,
        caseUpdate: messageType === 'update' ? caseUpdate : null,
        relatedCase: messageType === 'update' ? selectedCase : null,
        caseTitle: messageType === 'update' ? selectedCaseData?.caseTitle : null,
        hasUpdate: messageType === 'update',
        hasFiles: selectedFiles.length > 0,
        videoURL: videoURL || null  // Add video URL if exists
      };

      // Add message to messages collection
      const messagesCollectionRef = collection(db, 'messages');
      await addDoc(messagesCollectionRef, messageData);

      // Send confirmation message to lawyer
      const confirmationMessage = {
        type: 'clientConfirmation',
        username: selectedLawyer,
        from: loggedInUsername,
        message: messageType === 'update'
          ? `Client ${loggedInUsername} has sent an update for case: ${selectedCaseData?.caseTitle}`
          : `Client ${loggedInUsername} has sent you a direct message`,
        timestamp: new Date(),
        status: 'unread',
        originalMessage: messageText,
        messageType: messageType,
        clientEmail: Cookies.get('email') || '',
        department: selectedLawyerData.department,
        files: selectedFiles,
        caseUpdate: messageType === 'update' ? caseUpdate : null,
        relatedCase: messageType === 'update' ? selectedCase : null,
        caseTitle: messageType === 'update' ? selectedCaseData?.caseTitle : null,
        hasUpdate: messageType === 'update',
        hasFiles: selectedFiles.length > 0,
        videoURL: videoURL || null  // Add video URL if exists
      };
      await addDoc(messagesCollectionRef, confirmationMessage);

      setSnackbarMessage(`${messageType === 'direct' ? 'Message' : 'Case update'} sent successfully!`);
      setSnackbarOpen(true);
      setIsComposeModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error sending message:', error);
      setSnackbarMessage('Error sending message');
      setSnackbarOpen(true);
    }
  };

  const handleReplyWithHearing = async () => {
    try {
      if (!hearingDetails || !selectedClientMessage) {
        setSnackbarMessage('Please enter hearing details');
        setSnackbarOpen(true);
        return;
      }

      // Send hearing message to client
      const newMessage = {
        sender: loggedInUsername,
        username: selectedClientMessage.from, // Send to the client who sent the original message
        hearingDetails: hearingDetails,
        type: "hearingMsg",
        email: selectedClientMessage.clientEmail,
        caseTitle: selectedClientMessage.caseTitle || 'Direct Message',
        timestamp: new Date(),
        inReplyTo: selectedClientMessage.id // Add reference to original message
      };

      const messagesCollectionRef = collection(db, 'messages');
      await addDoc(messagesCollectionRef, newMessage);

      // Send confirmation message for lawyer
      const confirmationMessage = {
        username: loggedInUsername,
        type: "confirmation",
        message: `Hearing details sent to client ${selectedClientMessage.from}`,
        timestamp: new Date(),
        status: "sent"
      };
      await addDoc(messagesCollectionRef, confirmationMessage);

      // Send email notification if client email is available
      if (selectedClientMessage.clientEmail) {
        const body = {
          name: selectedClientMessage.from,
          intro: `Lawyer: ${loggedInUsername} has sent you hearing details.\nHearing Details: ${hearingDetails}`,
          outro: "Thank you for choosing Justice Portal. We are dedicated to serving you and ensuring your legal needs are met with professionalism and care."
        };

        await axios.post('https://justice-portal-server.vercel.app/api/submit/message', {
          userEmail: selectedClientMessage.clientEmail,
          userName: selectedClientMessage.from,
          mailBody: body,
          subject: "New Hearing Details from Lawyer"
        });
      }

      setSnackbarMessage('Hearing details sent successfully!');
      setSnackbarOpen(true);
      setReplyHearingModalOpen(false);
      setHearingDetails('');
      setSelectedClientMessage(null);
    } catch (error) {
      console.error('Error sending hearing details:', error);
      setSnackbarMessage('Error sending hearing details');
      setSnackbarOpen(true);
    }
  };

  const handleStatusButtonClick = async (message) => {
    try {
      // First fetch the case ID
      const casesCollection = collection(db, 'cases');
      const q = query(casesCollection, 
        where('username', '==', message.from),
        where('caseTitle', '==', message.caseTitle)
      );
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const caseDoc = querySnapshot.docs[0];
        setSelectedCaseForStatus({
          caseId: caseDoc.id,
          username: message.from,
          caseTitle: message.caseTitle,
          from: loggedInUsername
        });
        setCaseStatusModalOpen(true);
      } else {
        setSnackbarMessage('Case not found');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error finding case:', error);
      setSnackbarMessage('Error finding case');
      setSnackbarOpen(true);
    }
  };

  const handleUpdateCaseStatus = async () => {
    try {
      if (!selectedCaseForStatus || !caseStatus) return;

      // Update case status in cases collection
      const caseRef = doc(db, 'cases', selectedCaseForStatus.caseId);
      await updateDoc(caseRef, {
        status: caseStatus,
        closedAt: caseStatus === 'Completed' ? new Date() : null
      });

      // Send notification to client
      const statusMessage = {
        type: 'caseStatus',
        username: selectedCaseForStatus.username, // client username
        from: loggedInUsername, // lawyer username
        message: `Your case "${selectedCaseForStatus.caseTitle}" status has been updated to ${caseStatus}`,
        timestamp: new Date(),
        caseTitle: selectedCaseForStatus.caseTitle,
        status: caseStatus,
        caseId: selectedCaseForStatus.caseId
      };

      await addDoc(collection(db, 'messages'), statusMessage);

      // If case is completed, send feedback request to client
      if (caseStatus === 'Completed') {
        const feedbackRequest = {
          type: 'feedbackRequest',
          username: selectedCaseForStatus.username,
          from: loggedInUsername,
          message: `Please provide feedback for your case "${selectedCaseForStatus.caseTitle}"`,
          timestamp: new Date(),
          caseTitle: selectedCaseForStatus.caseTitle,
          caseId: selectedCaseForStatus.caseId
        };
        await addDoc(collection(db, 'messages'), feedbackRequest);
      }

      setSnackbarMessage('Case status updated successfully!');
      setSnackbarOpen(true);
      setCaseStatusModalOpen(false);
      setSelectedCaseForStatus(null);
      setCaseStatus('');
    } catch (error) {
      console.error('Error updating case status:', error);
      setSnackbarMessage('Error updating case status');
      setSnackbarOpen(true);
    }
  };

  const handleSubmitFeedback = async () => {
    try {
      if (!feedback || !selectedCaseForStatus) return;

      // Store feedback in feedback collection
      const feedbackData = {
        caseId: selectedCaseForStatus.caseId,
        caseTitle: selectedCaseForStatus.caseTitle,
        clientUsername: loggedInUsername,
        lawyerUsername: selectedCaseForStatus.from,
        feedback,
        rating,
        timestamp: new Date()
      };

      await addDoc(collection(db, 'feedback'), feedbackData);

      // Send notification to lawyer
      const feedbackNotification = {
        type: 'feedbackSubmitted',
        username: selectedCaseForStatus.from, // lawyer
        from: loggedInUsername, // client
        message: `Client has submitted feedback for case "${selectedCaseForStatus.caseTitle}"`,
        timestamp: new Date(),
        caseTitle: selectedCaseForStatus.caseTitle,
        feedback,
        rating
      };

      await addDoc(collection(db, 'messages'), feedbackNotification);

      setSnackbarMessage('Feedback submitted successfully!');
      setSnackbarOpen(true);
      setFeedbackModalOpen(false);
      setFeedback('');
      setRating(5);
      setSelectedCaseForStatus(null);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setSnackbarMessage('Error submitting feedback');
      setSnackbarOpen(true);
    }
  };

  const menuItems = [
    {
      text: 'All Messages',
      icon: <AllInboxIcon />,
      filter: 'all',
      count: messages.length,
    },
    ...(userRole === 'Lawyers/Attorneys' ? [{
      text: 'Client Requests',
      icon: <MarkEmailUnreadIcon />,
      filter: 'reqMsg',
      count: messageStats.reqMsgCount,
    }] : []),
    {
      text: 'Hearing Updates',
      icon: <EventNoteIcon />,
      filter: 'hearingMsg',
      count: messageStats.hearingMsgCount,
    },
    {
      text: 'Cases Taken',
      icon: <FolderSpecialIcon />,
      filter: 'caseTaken',
      count: messageStats.caseTakenCount,
    },
    ...(userRole === 'Lawyers/Attorneys' ? [
      {
        text: 'Client Messages',
        icon: <ContactMailIcon />,
        filter: 'clientConfirmation',
        count: messageStats.clientMsgCount,
      },
      {
        text: 'Case Updates',
        icon: <UpdateIcon />,
        filter: 'caseUpdate',
        count: messageStats.caseUpdateCount,
      }
    ] : []),
  ];

  return (
    <Box sx={{ 
      display: 'flex', 
      bgcolor: 'background.default',
      minHeight: '100vh',
      position: 'relative',
      zIndex: 0,
    }}>
      <StyledDrawer 
        variant="permanent"
        sx={{
          '& .MuiDrawer-paper': {
            position: 'fixed',
            zIndex: 1,
          }
        }}
      >
        <DrawerHeader>
          <Box>
            {/* Drawer header content */}
          </Box>
        </DrawerHeader>

        {userRole !== 'Lawyers/Attorneys' && (
          <Box sx={{ px: 2 }}>
            <ContactButton
              variant="contained"
              fullWidth
              startIcon={<PersonIcon />}
              onClick={() => setIsComposeModalOpen(true)}
            >
              Contact with Lawyer
            </ContactButton>
          </Box>
        )}

        <List sx={{ 
          px: 2, 
          py: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5,
        }}>
          {menuItems.map((item) => (
            <StyledListItem
              button
              key={item.text}
              active={activeFilter === item.filter ? 1 : 0}
              onClick={() => setActiveFilter(item.filter)}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
              {item.count > 0 && (
                <Chip
                  size="small"
                  label={item.count}
                  color={activeFilter === item.filter ? "primary" : "default"}
                  sx={{ 
                    ml: 1,
                    fontWeight: 600,
                    bgcolor: activeFilter === item.filter ? 'rgba(26, 35, 126, 0.08)' : 'transparent',
                    color: activeFilter === item.filter ? '#1a237e' : 'inherit',
                    '& .MuiChip-label': {
                      px: 1,
                      fontSize: '0.75rem',
                    }
                  }}
                />
              )}
            </StyledListItem>
          ))}
        </List>

        <Box sx={{ p: 2, mt: 'auto' }}>
          <Paper 
            sx={{ 
              p: 3, 
              borderRadius: 3, 
              background: 'linear-gradient(45deg, #1a237e 30%, #283593 90%)',
              boxShadow: 'none',
            }}
          >
            <Typography 
              variant="subtitle2" 
              color="white"
              gutterBottom
              sx={{ fontWeight: 600, opacity: 0.9 }}
            >
              Quick Stats
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2" color="white" sx={{ opacity: 0.9 }}>
            Total Messages: {messages.length}
          </Typography>
          {userRole === 'Lawyers/Attorneys' ? (
                <Typography variant="body2" color="white" sx={{ opacity: 0.9 }}>
              Client Messages: {messageStats.clientMsgCount}
            </Typography>
          ) : (
                <Typography variant="body2" color="white" sx={{ opacity: 0.9 }}>
                  Hearing Updates: {messageStats.hearingMsgCount}
            </Typography>
          )}
        </Box>
      </Paper>
        </Box>
      </StyledDrawer>

      <Main>
        <Box sx={{ maxWidth: 900, mx: 'auto' }}>
          <Typography 
            variant="h5" 
            gutterBottom 
            sx={{ 
              mb: 3,
              fontWeight: 600,
              color: 'text.primary',
            }}
          >
            {menuItems.find(item => item.filter === activeFilter)?.text || 'Messages'}
          </Typography>
      
      {filteredMessages.length === 0 ? (
            <Paper 
              elevation={0} 
              sx={{ 
                p: 4, 
                textAlign: 'center', 
                borderRadius: 2,
                bgcolor: 'background.paper'
              }}
            >
              <Box sx={{ maxWidth: 400, mx: 'auto' }}>
                <img 
                  src={NoMessagesImage} 
                  alt="No messages" 
                  style={{ width: '100%', maxWidth: 200, marginBottom: 24 }}
                />
                <Typography variant="h5" gutterBottom color="textSecondary">
                  No messages found
          </Typography>
                <Typography variant="body1" color="textSecondary">
                  {userRole !== 'Lawyers/Attorneys' 
                    ? "Start by sending a message to a lawyer using the New Message button."
                    : "You'll see your client messages and case updates here."}
            </Typography>
              </Box>
        </Paper>
      ) : (
            <Grid container spacing={1.5}>
          {filteredMessages.map((message) => (
                ((message.type !== 'confirmation' || userRole === 'Lawyers/Attorneys') && message.type !== undefined) && (
          <Grid item xs={12} key={message.id}>
                    <StyledMessageCard type={getMessageColor(message.type)}>
                      <CardContent sx={{ 
                        p: message.type === 'caseTaken' ? '8px 12px' : 2,
                        '&:last-child': {
                          paddingBottom: message.type === 'caseTaken' ? '8px !important' : '16px !important'
                        }
                      }}>
                        {/* Message Header */}
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1, 
                          mb: message.type === 'caseTaken' ? 0.5 : 1.5 
                        }}>
                          <Avatar sx={{ 
                            width: message.type === 'caseTaken' ? 24 : 32, 
                            height: message.type === 'caseTaken' ? 24 : 32, 
                            bgcolor: '#1a237e',
                            fontSize: message.type === 'caseTaken' ? '0.8rem' : '1rem'
                          }}>
                            {getMessageIcon(message.type)}
                          </Avatar>
                          <Box sx={{ flexGrow: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                              {message.type === "hearingMsg" ? (
                                <MessageTypeChip
                                  label="Hearing Update"
                                  size="small"
              sx={{ 
                                    bgcolor: '#1a237e', 
                                    color: 'white',
                                    height: '18px',
                                    '& .MuiChip-label': {
                                      px: 0.75,
                                      fontSize: '0.65rem',
                                      fontWeight: 500,
                                    }
                                  }}
                                />
                              ) : message.type === "caseTaken" && (
                                <MessageTypeChip
                                  label="Case Taken"
                                  size="small"
                                  sx={{ 
                                    bgcolor: getMessageColor(message.type), 
                                    color: 'white',
                                    height: '18px',
                                    '& .MuiChip-label': {
                                      px: 0.75,
                                      fontSize: '0.65rem',
                                      fontWeight: 500,
                                    }
                                  }}
                                />
                              )}
                </Box>
                          </Box>
                        </Box>

                    <Divider sx={{ mb: 2 }} />

                        {/* Message Content */}
                        <MessageContent message={message} />

                        {/* Message Actions */}
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'flex-end', 
                          gap: 1,
                          mt: 1
                        }}>
                          {userRole === 'Lawyers/Attorneys' && message.type === "reqMsg" && (
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                  size="small"
                                  variant="contained"
                                  sx={{ 
                                    borderRadius: 3,
                                    bgcolor: '#1a237e',
                                    '&:hover': {
                                      bgcolor: '#283593',
                                    }
                                  }}
                                  startIcon={<GavelIcon />}
                                  onClick={() => handleAddHearing(message.id, {
                                    username: message.from,
                                    caseTitle: message.caseTitle,
                                    email: message.email
                                  })}
                                >
                                  Send Hearing
                                </Button>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  sx={{ borderRadius: 3 }}
                                  onClick={() => handleStatusButtonClick(message)}
                                >
                                  Update Status
                                </Button>
                              </Box>
                          )}
                          {userRole === 'Lawyers/Attorneys' && message.type === "clientConfirmation" && (
                            <Button
                              size="small"
                              variant="contained"
                              sx={{ 
                                borderRadius: 3,
                                bgcolor: '#1a237e',
                                '&:hover': {
                                  bgcolor: '#283593',
                                }
                              }}
                                startIcon={<GavelIcon />}
                                onClick={() => {
                                  setSelectedClientMessage(message);
                                  setReplyHearingModalOpen(true);
                                }}
                              >
                                Reply with Hearing
                          </Button>
                          )}
                <Button
                          size="small"
                            variant="outlined"
                            color="error"
                                startIcon={<DeleteIcon />}
                            onClick={() => handleOpenDeleteModal(message)}
                                sx={{ borderRadius: 3 }}
                          >
                            Delete
                          </Button>
                        </Box>
                      </CardContent>
                    </StyledMessageCard>
          </Grid>
                )
        ))}
      </Grid>
      )}
        </Box>
      </Main>

      {/* Hearing Details Dialog */}
      <Dialog 
        open={isModalOpen} 
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Hearing Details</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Hearing Details"
            fullWidth
            multiline
            rows={4}
            value={hearingDetails}
            onChange={(e) => setHearingDetails(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => handleSendHearing(selectedCaseId, selectedCaseDetails)}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this message?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteModal}>Cancel</Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleConfirmDelete}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add new Compose Message Dialog */}
      <Dialog
        open={isComposeModalOpen}
        onClose={() => setIsComposeModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Contact Lawyer</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Message Type Selection */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Select Message Type:
              </Typography>
              <ButtonGroup variant="outlined" fullWidth>
                <Button 
                  onClick={() => setMessageType('direct')}
                  variant={messageType === 'direct' ? 'contained' : 'outlined'}
                  startIcon={<EmailIcon />}
                  sx={{ 
                    flex: 1,
                    bgcolor: messageType === 'direct' ? 'primary.main' : 'transparent',
                    color: messageType === 'direct' ? 'white' : 'primary.main',
                  }}
                >
                  Direct Message
                </Button>
                <Button 
                  onClick={() => setMessageType('update')}
                  variant={messageType === 'update' ? 'contained' : 'outlined'}
                  startIcon={<UpdateIcon />}
                  sx={{ 
                    flex: 1,
                    bgcolor: messageType === 'update' ? 'primary.main' : 'transparent',
                    color: messageType === 'update' ? 'white' : 'primary.main',
                  }}
                >
                  Case Update
                </Button>
              </ButtonGroup>
            </Box>

            {/* Lawyer Selection - Common for both types */}
            <TextField
              select
              fullWidth
              label="Select Lawyer"
              value={selectedLawyer}
              onChange={(e) => setSelectedLawyer(e.target.value)}
            >
              {availableLawyers.map((lawyer) => (
                <MenuItem key={lawyer.username} value={lawyer.username}>
                  {lawyer.username} - {lawyer.department}
                </MenuItem>
              ))}
            </TextField>

            {/* Case Selection - Only for Update type */}
            {messageType === 'update' && (
              <TextField
                select
                required
                fullWidth
                label="Select Case"
                value={selectedCase}
                onChange={(e) => setSelectedCase(e.target.value)}
                error={messageType === 'update' && !selectedCase}
                helperText={messageType === 'update' && !selectedCase ? 'Please select a case for update' : ''}
              >
                {userCases.map((caseItem) => (
                  <MenuItem key={caseItem.id} value={caseItem.id}>
                    {caseItem.caseTitle}
                  </MenuItem>
                ))}
              </TextField>
            )}

            {/* Message Input - Different labels based on type */}
            <TextField
              fullWidth
              multiline
              rows={4}
              label={messageType === 'direct' ? "Message" : "Case Update Message"}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder={messageType === 'direct' 
                ? "Type your message here..." 
                : "Provide details about your case update..."}
            />

            {/* Case Update Details - Only for Update type */}
            {messageType === 'update' && (
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Additional Update Details"
                value={caseUpdate}
                onChange={(e) => setCaseUpdate(e.target.value)}
                placeholder="Provide any additional details or context about the update..."
              />
            )}

            {/* File Upload Section - Common for both types */}
            <Box sx={{ mt: 2 }}>
              <input
                type="file"
                multiple
                id="file-upload"
                style={{ display: 'none' }}
                onChange={(e) => handleFileUpload(Array.from(e.target.files))}
              />
              <label htmlFor="file-upload">
                <Button
                  component="span"
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  sx={{ mr: 2 }}
                >
                  Upload Files
                </Button>
              </label>
              {uploadProgress && <CircularProgress size={24} sx={{ ml: 2 }} />}
            </Box>

            {/* Video Recording Section */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Record Video Message:
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                gap: 2,
                alignItems: 'center',
                border: '1px solid rgba(0,0,0,0.12)',
                borderRadius: 1,
                p: 2
              }}>
                {!recordingPreview && (
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    style={{ 
                      width: '100%',
                      maxWidth: 400,
                      borderRadius: 8,
                      display: isRecording ? 'block' : 'none'
                    }}
                  />
                )}
                
                {recordingPreview && (
                  <Box sx={{ width: '100%', maxWidth: 400 }}>
                    <video
                      src={recordingPreview}
                      controls
                      style={{ width: '100%', borderRadius: 8 }}
                    />
                  </Box>
                )}

                <ButtonGroup>
                  {!isRecording && !recordingPreview && (
                    <Button
                      variant="contained"
                      startIcon={<VideocamIcon />}
                      onClick={startRecording}
                      color="primary"
                    >
                      Start Recording
                    </Button>
                  )}
                  
                  {isRecording && (
                    <Button
                      variant="contained"
                      startIcon={<StopIcon />}
                      onClick={stopRecording}
                      color="error"
                    >
                      Stop Recording
                    </Button>
                  )}
                  
                  {recordingPreview && (
                    <>
                      <Button
                        variant="outlined"
                        startIcon={<ReplayIcon />}
                        onClick={() => {
                          discardRecording();
                        }}
                      >
                        Record Again
                      </Button>
                    </>
                  )}
                </ButtonGroup>
              </Box>
            </Box>

            {/* Attached Files Display */}
            {selectedFiles.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Attached Files:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {selectedFiles.map((file, index) => (
                    <Chip
                      key={index}
                      label={file.name}
                      onDelete={() => setSelectedFiles(files => files.filter((_, i) => i !== index))}
                      icon={<AttachFileIcon />}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setIsComposeModalOpen(false);
            resetForm();
          }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSendMessage}
            disabled={!messageText || !selectedLawyer || uploadProgress || 
              (messageType === 'update' && !selectedCase)}
          >
            Send {messageType === 'direct' ? 'Message' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reply with Hearing Dialog */}
      <Dialog
        open={replyHearingModalOpen}
        onClose={() => {
          setReplyHearingModalOpen(false);
          setHearingDetails('');
          setSelectedClientMessage(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Reply with Hearing Details</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {selectedClientMessage && (
              <Box sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Original Message:
                </Typography>
                <Typography variant="body2">
                  {selectedClientMessage.originalMessage}
                </Typography>
              </Box>
            )}
            <TextField
              autoFocus
              fullWidth
              multiline
              rows={4}
              label="Hearing Details"
              value={hearingDetails}
              onChange={(e) => setHearingDetails(e.target.value)}
              placeholder="Enter hearing date, time, location, and any additional instructions..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setReplyHearingModalOpen(false);
            setHearingDetails('');
            setSelectedClientMessage(null);
          }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleReplyWithHearing}
            disabled={!hearingDetails}
          >
            Send Hearing Details
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Case Status Modal */}
      <Dialog
        open={caseStatusModalOpen}
        onClose={() => setCaseStatusModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Update Case Status</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              select
              fullWidth
              label="Case Status"
              value={caseStatus}
              onChange={(e) => setCaseStatus(e.target.value)}
            >
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCaseStatusModalOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleUpdateCaseStatus}
            disabled={!caseStatus}
          >
            Update Status
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Feedback Modal */}
      <Dialog
        open={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Submit Feedback</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              select
              fullWidth
              label="Rating"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            >
              {[5,4,3,2,1].map((value) => (
                <MenuItem key={value} value={value}>
                  {value} Star{value !== 1 ? 's' : ''}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Your Feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Please share your experience..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFeedbackModalOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmitFeedback}
            disabled={!feedback}
          >
            Submit Feedback
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      {snackbarOpen && (
        <Alert
          severity="success"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 9999,
            borderRadius: 2,
            boxShadow: 3,
          }}
          onClose={() => setSnackbarOpen(false)}
        >
          {snackbarMessage}
        </Alert>
      )}
    </Box>
  );
}

export default Inbox;
