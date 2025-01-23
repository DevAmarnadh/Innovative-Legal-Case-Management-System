import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  DialogActions,
  Grid,
  IconButton,
  Divider,
  Card,
  CardContent
} from '@mui/material';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from './firebase';
import Cookies from 'js-cookie';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import DownloadIcon from '@mui/icons-material/Download';
import HistoryIcon from '@mui/icons-material/History';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import { styled } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

const ProfileContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #ebedee 100%)',
  padding: theme.spacing(4),
}));

const ProfileWrapper = styled(Box)(({ theme }) => ({
  maxWidth: 1000,
  margin: '0 auto',
  display: 'grid',
  gridTemplateColumns: '300px 1fr',
  gap: theme.spacing(3),
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
  }
}));

const SidePanel = styled(Paper)(({ theme }) => ({
  borderRadius: theme.spacing(3),
  overflow: 'hidden',
  height: 'fit-content',
  background: 'white',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
}));

const MainPanel = styled(Paper)(({ theme }) => ({
  borderRadius: theme.spacing(3),
  overflow: 'hidden',
  background: 'white',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
}));

const UserAvatar = styled(Box)(({ theme }) => ({
  width: '100%',
  aspectRatio: '1',
  background: 'linear-gradient(45deg, #1a237e 30%, #283593 90%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  '& svg': {
    fontSize: 80,
  }
}));

const InfoItem = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(26, 35, 126, 0.04)',
  }
}));

const InfoIcon = styled(Box)(({ theme }) => ({
  width: 36,
  height: 36,
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(26, 35, 126, 0.08)',
  color: '#1a237e',
  '& svg': {
    fontSize: 20,
  }
}));

const EditButton = styled(IconButton)(({ theme }) => ({
  width: 36,
  height: 36,
  borderRadius: '12px',
  backgroundColor: 'rgba(26, 35, 126, 0.08)',
  color: '#1a237e',
  '&:hover': {
    backgroundColor: 'rgba(26, 35, 126, 0.12)',
  }
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  padding: theme.spacing(1.5, 3),
  textTransform: 'none',
  fontWeight: 600,
  boxShadow: 'none',
  '&.MuiButton-contained': {
    background: 'linear-gradient(45deg, #1a237e 30%, #283593 90%)',
    color: 'white',
    '&:hover': {
      boxShadow: '0 6px 20px rgba(26, 35, 126, 0.3)',
    }
  }
}));

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [editableFields, setEditableFields] = useState({ email: false, password: false });
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false); // State to toggle password visibility
  const [logs, setLogs] = useState([]);
  const [showLogDialog, setShowLogDialog] = useState(false); // State to control log dialog visibility

  const username = Cookies.get('username');

  useEffect(() => {
    const fetchUserData = async () => {
      if (username) {
        const usersCollectionRef = collection(db, 'users');
        const q = query(usersCollectionRef, where('username', '==', username));

        try {
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
              setUserData({ id: doc.id, ...doc.data() });
            });
          } else {
            console.log('No user found with the provided username');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        console.log('No username found in cookies');
      }
    };

    fetchUserData();
  }, [username]);

  const handleEditField = (field) => {
    setEditableFields({ ...editableFields, [field]: true });
  };

  const handleSaveField = async (field) => {
    try {
      await updateDoc(doc(db, 'users', userData.id), { [field]: userData[field] });
      setUpdateSuccess(true);
      setEditableFields({ ...editableFields, [field]: false });
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  const handleDiscardChanges = (field) => {
    setEditableFields({ ...editableFields, [field]: false });
    setUserData({ ...userData });
  };

  const handleInputChange = (e, field) => {
    const value = e.target.value;
    setUserData({ ...userData, [field]: value });
  };

  const handleViewLog = async () => {
    try {
      if (userData) {
        const logCollectionRef = collection(db, 'log');
        const q = query(logCollectionRef, where('deletedBy', '==', userData.username));
        const logQuerySnapshot = await getDocs(q);
        const logData = [];
        logQuerySnapshot.forEach((doc) => {
          logData.push({ id: doc.id, ...doc.data() });
        });
        setLogs(logData);
        setShowLogDialog(true);
      } else {
        console.log('User data not available.');
      }
    } catch (error) {
      console.error('Error fetching log data:', error);
    }
  };
  

  const handleCloseLogDialog = () => {
    setShowLogDialog(false);
  };


  const stringifyMessageData = (data, indent = 2) => {
    if (typeof data === 'object' && data !== null) {
      return Object.entries(data)
        .map(([key, value]) => {
          if (typeof value === 'object') {
            return `${' '.repeat(indent)}${key}: {\n${stringifyMessageData(value, indent + 2)}\n${' '.repeat(indent)}}`;
          } else {
            return `${' '.repeat(indent)}${key}: ${value}`;
          }
        })
        .join(',\n');
    } else {
      return data;
    }
  };
  
  const handleDownloadLog = () => {
    const formattedLogs = logs.map(log => {
      const logFields = Object.entries(log)
        .map(([key, value]) => {
          if (key === 'messageData') {
            return `${key}: {\n${stringifyMessageData(value)}\n}`;
          } else {
            return `${key}: ${value}`;
          }
        })
        .join(',\n');
      return `${log.timestamp ? log.timestamp.toDate().toLocaleString() : 'Unknown'} - {\n${logFields}\n}`;
    }).join('\n\n');
  
    const element = document.createElement('a');
    const file = new Blob([formattedLogs], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'log.txt';
    document.body.appendChild(element); // Required for this to work in Firefox
    element.click();
  };
  

  return (
    <ProfileContainer>
      <ProfileWrapper>
        <SidePanel>
          <UserAvatar>
            <PersonIcon />
          </UserAvatar>
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
              {userData?.username || 'Loading...'}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {userData?.role || 'Loading...'}
            </Typography>
            <ActionButton
              variant="contained"
              onClick={handleViewLog}
              startIcon={<HistoryIcon />}
              fullWidth
            >
              Activity Log
            </ActionButton>
          </Box>
        </SidePanel>

        <MainPanel>
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
              Account Settings
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <InfoItem>
                <InfoIcon>
                  <PersonIcon />
                </InfoIcon>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Username
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {userData?.username}
                  </Typography>
                </Box>
              </InfoItem>

              <InfoItem>
                <InfoIcon>
                  <WorkIcon />
                </InfoIcon>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Role
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {userData?.role}
                  </Typography>
                </Box>
              </InfoItem>

              <InfoItem>
                <InfoIcon>
                  <EmailIcon />
                </InfoIcon>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Email
                  </Typography>
                  {editableFields['email'] ? (
                    <Box sx={{ mt: 1, display: 'flex', gap: 2 }}>
                      <TextField
                        fullWidth
                        size="small"
                        value={userData?.email}
                        onChange={(e) => handleInputChange(e, 'email')}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                          }
                        }}
                      />
                      <IconButton 
                        color="primary"
                        onClick={() => handleSaveField('email')}
                        sx={{ borderRadius: '12px' }}
                      >
                        <SaveIcon />
                      </IconButton>
                      <IconButton 
                        color="error"
                        onClick={() => handleDiscardChanges('email')}
                        sx={{ borderRadius: '12px' }}
                      >
                        <CancelIcon />
                      </IconButton>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {userData?.email}
                      </Typography>
                      <EditButton onClick={() => handleEditField('email')}>
                        <EditIcon fontSize="small" />
                      </EditButton>
                    </Box>
                  )}
                </Box>
              </InfoItem>

              <InfoItem>
                <InfoIcon>
                  <LockIcon />
                </InfoIcon>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Password
                  </Typography>
                  {editableFields['password'] ? (
                    <Box sx={{ mt: 1, display: 'flex', gap: 2 }}>
                      <TextField
                        fullWidth
                        size="small"
                        type={passwordVisible ? 'text' : 'password'}
                        value={userData?.password}
                        onChange={(e) => handleInputChange(e, 'password')}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                          }
                        }}
                        InputProps={{
                          endAdornment: (
                            <IconButton 
                              size="small" 
                              onClick={() => setPasswordVisible(!passwordVisible)}
                            >
                              {passwordVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          ),
                        }}
                      />
                      <IconButton 
                        color="primary"
                        onClick={() => handleSaveField('password')}
                        sx={{ borderRadius: '12px' }}
                      >
                        <SaveIcon />
                      </IconButton>
                      <IconButton 
                        color="error"
                        onClick={() => handleDiscardChanges('password')}
                        sx={{ borderRadius: '12px' }}
                      >
                        <CancelIcon />
                      </IconButton>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        ********
                      </Typography>
                      <EditButton onClick={() => handleEditField('password')}>
                        <EditIcon fontSize="small" />
                      </EditButton>
                    </Box>
                  )}
                </Box>
              </InfoItem>
            </Box>
          </Box>
        </MainPanel>
      </ProfileWrapper>

      {/* Activity Log Dialog */}
      <Dialog 
        open={showLogDialog} 
        onClose={handleCloseLogDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ 
          p: 3,
          background: 'linear-gradient(45deg, #1a237e 30%, #283593 90%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <HistoryIcon />
            <Typography variant="h6">Activity Log</Typography>
          </Box>
          {logs.length > 0 && (
            <IconButton
              onClick={handleDownloadLog}
              sx={{ 
                color: 'white',
                '&:hover': { 
                  backgroundColor: 'rgba(255,255,255,0.1)' 
                }
              }}
            >
              <DownloadIcon />
            </IconButton>
          )}
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          {logs.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {logs.map((log, index) => (
                <Paper 
                  key={index} 
                  elevation={0}
                  sx={{ 
                    p: 2, 
                    borderRadius: 3,
                    bgcolor: 'grey.50',
                    '&:hover': {
                      bgcolor: 'grey.100'
                    }
                  }}
                >
                  <Typography variant="caption" color="primary" sx={{ fontWeight: 500 }}>
                    {log.timestamp ? log.timestamp.toDate().toLocaleString() : 'Unknown'}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {log.message}
                  </Typography>
                </Paper>
              ))}
            </Box>
          ) : (
            <Box sx={{ 
              py: 8, 
              textAlign: 'center',
              color: 'text.secondary'
            }}>
              <HistoryIcon sx={{ fontSize: 48, opacity: 0.5, mb: 2 }} />
              <Typography variant="h6">
                No activity logs found
              </Typography>
              <Typography variant="body2">
                Your activity history will appear here
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </ProfileContainer>
  );
};

export default Profile;