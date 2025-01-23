import React, { useState } from 'react';
import { db, storage } from './firebase';
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import Cookies from 'js-cookie';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Snackbar,
  MenuItem,
  Grid,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MicIcon from '@mui/icons-material/Mic';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import GavelIcon from '@mui/icons-material/Gavel';
import DescriptionIcon from '@mui/icons-material/Description';
import CategoryIcon from '@mui/icons-material/Category';
import PersonIcon from '@mui/icons-material/Person';
import TranslateIcon from '@mui/icons-material/Translate';

const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: '#fff',
  padding: theme.spacing(4),
  overflow: 'auto',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
}));

const FormCard = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: 1200,
  margin: '0 auto',
  display: 'grid',
  gridTemplateColumns: '1fr 2fr',
  borderRadius: theme.spacing(3),
  overflow: 'visible',
  boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
  position: 'relative',
  minHeight: 'fit-content',
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
  }
}));

const InfoSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
  padding: theme.spacing(6),
  color: 'white',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  position: 'relative',
  overflow: 'visible',
  minHeight: '100%',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
    pointerEvents: 'none'
  }
}));

const FormSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(6),
  background: '#fff',
  minHeight: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative'
}));

const InputField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(1.5),
    backgroundColor: '#F8FAFC',
    border: '1px solid #E2E8F0',
    transition: 'all 0.2s ease',
    fontSize: '1rem',
    '& .MuiInputAdornment-root .MuiSvgIcon-root': {
      fontSize: '1.25rem',
    },
    '&:hover': {
      backgroundColor: '#F1F5F9',
    },
    '&.Mui-focused': {
      backgroundColor: '#fff',
      border: '1px solid #1a237e',
      boxShadow: '0 0 0 3px rgba(26, 35, 126, 0.1)',
    }
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none'
  },
  '& .MuiInputLabel-root': {
    fontSize: '1rem',
  },
  '& .MuiInputBase-inputMultiline': {
    fontSize: '1rem',
  }
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1.5),
  padding: theme.spacing(1.5, 4),
  fontSize: '1rem',
  textTransform: 'none',
  fontWeight: 600,
  background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
  boxShadow: '0 4px 12px rgba(26, 35, 126, 0.2)',
  '&:hover': {
    boxShadow: '0 6px 16px rgba(26, 35, 126, 0.3)',
    transform: 'translateY(-1px)'
  }
}));

const ResetButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1.5),
  padding: theme.spacing(1.5, 4),
  fontSize: '1rem',
  textTransform: 'none',
  fontWeight: 600,
  color: '#d32f2f',
  borderColor: '#d32f2f',
  '&:hover': {
    backgroundColor: '#ffebee',
    borderColor: '#d32f2f',
  }
}));

const FeatureItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(4),
  position: 'relative',
  zIndex: 1
}));

const languages = [
  { code: 'en-US', name: 'English' },
  { code: 'hi-IN', name: 'Hindi' },
  { code: 'bn-IN', name: 'Bengali' },
  { code: 'ta-IN', name: 'Tamil' },
  { code: 'te-IN', name: 'Telugu' },
  { code: 'ml-IN', name: 'Malayalam' },
  { code: 'kn-IN', name: 'Kannada' },
  { code: 'mr-IN', name: 'Marathi' },
  { code: 'gu-IN', name: 'Gujarati' },
  { code: 'or-IN', name: 'Odia' },
  { code: 'pa-IN', name: 'Punjabi' }
];

function AddCasePage() {
  const [caseTitle, setCaseTitle] = useState('');
  const [caseDescription, setCaseDescription] = useState('');
  const [caseType, setCaseType] = useState('');
  const [caseAssignee, setCaseAssignee] = useState('');
  const [files, setFiles] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const username = Cookies.get('username');

  const handleFileChange = (e) => {
    const fileList = e.target.files;
    setFiles([...files, ...fileList]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const uploadedFiles = await Promise.all(files.map(async file => {
        const storageRef = ref(storage, `cases/${file.name}`);
        await uploadBytes(storageRef, file);
        return storageRef;
      }));

      const currentDate = new Date();
      const options = { timeZone: 'Asia/Kolkata' };
      const localTimeString = currentDate.toLocaleString('en-US', options);

      await addDoc(collection(db, "cases"), {
        caseTitle,
        caseDescription,
        caseType,
        caseAssignee,
        email: Cookies.get('email'),
        filingDateTime: localTimeString,
        files: uploadedFiles.map(fileRef => fileRef.fullPath),
        username: username,
      });

      resetForm();
      setSnackbarMessage('Case added successfully!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);

      setTimeout(() => {
        setSnackbarMessage("Please proceed to 'My Cases' for verification");
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
      }, 4000);
    } catch (error) {
      console.error("Error adding case: ", error);
      setSnackbarMessage('An error occurred while adding the case. Please try again.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const resetForm = () => {
    setCaseTitle('');
    setCaseDescription('');
    setCaseType('');
    setCaseAssignee('');
    setFiles([]);
    window.location.reload();
  };

  const startRecognition = (field) => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = selectedLanguage;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      switch (field) {
        case 'title':
          setCaseTitle(transcript);
          break;
        case 'description':
          setCaseDescription(transcript);
          break;
        case 'type':
          setCaseType(transcript);
          break;
        case 'assignee':
          setCaseAssignee(transcript);
          break;
        default:
          break;
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setSnackbarMessage('Speech recognition error. Please try again.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    };

    recognition.start();
  };

  return (
    <PageContainer>
      <FormCard>
        <InfoSection>
          <Box sx={{ 
            position: 'relative', 
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            height: 'auto'
          }}>
            <GavelIcon sx={{ fontSize: 48, mb: 3 }} />
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
              Add New Case
            </Typography>
            <Typography variant="body1" sx={{ mb: 6, opacity: 0.9, lineHeight: 1.5 }}>
              Fill out the form with accurate case details. Use voice input for convenience.
            </Typography>

            <Box>
              <FeatureItem>
                <Box sx={{ 
                  width: 48, 
                  height: 48, 
                  borderRadius: 2, 
                  bgcolor: 'rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <MicIcon sx={{ fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Voice Input Support
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Dictate case details in multiple languages
                  </Typography>
                </Box>
              </FeatureItem>

              <FeatureItem>
                <Box sx={{ 
                  width: 48, 
                  height: 48, 
                  borderRadius: 2, 
                  bgcolor: 'rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <UploadFileIcon sx={{ fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Document Upload
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Attach relevant case documents
                  </Typography>
                </Box>
              </FeatureItem>
            </Box>
          </Box>
        </InfoSection>

        <FormSection>
          <Box 
            component="form" 
            onSubmit={handleSubmit} 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 3,
              width: '100%',
              height: 'auto'
            }}
          >
            <InputField
              select
              fullWidth
              label="Select Language"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <TranslateIcon color="primary" sx={{ fontSize: '1.5rem' }} />
                  </InputAdornment>
                ),
              }}
            >
              {languages.map((lang) => (
                <MenuItem key={lang.code} value={lang.code} sx={{ fontSize: '1.1rem' }}>
                  {lang.name}
                </MenuItem>
              ))}
            </InputField>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <InputField
                  fullWidth
                  label="Case Title"
                  value={caseTitle}
                  onChange={(e) => setCaseTitle(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DescriptionIcon color="primary" sx={{ fontSize: '1.5rem' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => startRecognition('title')}
                          sx={{
                            width: 48,
                            height: 48,
                            bgcolor: '#1a237e',
                            color: 'white',
                            '&:hover': { bgcolor: '#283593' }
                          }}
                        >
                          <MicIcon sx={{ fontSize: '1.5rem' }} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <InputField
                  fullWidth
                  label="Case Description"
                  value={caseDescription}
                  onChange={(e) => setCaseDescription(e.target.value)}
                  required
                  multiline
                  rows={5}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 2 }}>
                        <DescriptionIcon color="primary" sx={{ fontSize: '1.5rem' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end" sx={{ alignSelf: 'flex-start', mt: 2 }}>
                        <IconButton
                          onClick={() => startRecognition('description')}
                          sx={{
                            width: 48,
                            height: 48,
                            bgcolor: '#1a237e',
                            color: 'white',
                            '&:hover': { bgcolor: '#283593' }
                          }}
                        >
                          <MicIcon sx={{ fontSize: '1.5rem' }} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <InputField
                  fullWidth
                  label="Case Type"
                  value={caseType}
                  onChange={(e) => setCaseType(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CategoryIcon color="primary" sx={{ fontSize: '1.5rem' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => startRecognition('type')}
                          sx={{
                            width: 48,
                            height: 48,
                            bgcolor: '#1a237e',
                            color: 'white',
                            '&:hover': { bgcolor: '#283593' }
                          }}
                        >
                          <MicIcon sx={{ fontSize: '1.5rem' }} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <InputField
                  fullWidth
                  label="Client Name"
                  value={caseAssignee}
                  onChange={(e) => setCaseAssignee(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="primary" sx={{ fontSize: '1.5rem' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => startRecognition('assignee')}
                          sx={{
                            width: 48,
                            height: 48,
                            bgcolor: '#1a237e',
                            color: 'white',
                            '&:hover': { bgcolor: '#283593' }
                          }}
                        >
                          <MicIcon sx={{ fontSize: '1.5rem' }} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ 
                  border: '2px dashed #1a237e',
                  borderRadius: theme => theme.spacing(1.5),
                  p: 4,
                  textAlign: 'center',
                  backgroundColor: '#F8FAFC',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: '#F1F5F9',
                  }
                }}>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    required
                    style={{ display: 'none' }}
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button
                      component="span"
                      variant="outlined"
                      startIcon={<UploadFileIcon sx={{ fontSize: '1.25rem' }} />}
                      sx={{ 
                        color: '#1a237e',
                        borderColor: '#1a237e',
                        borderRadius: 1.5,
                        padding: '8px 24px',
                        fontSize: '1rem',
                        '&:hover': { 
                          borderColor: '#283593',
                          backgroundColor: 'rgba(26, 35, 126, 0.04)'
                        }
                      }}
                    >
                      Upload Files
                    </Button>
                  </label>
                  {files.length > 0 && (
                    <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
                      {files.length} file(s) selected
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                  <ResetButton
                    variant="outlined"
                    onClick={resetForm}
                    startIcon={<RestartAltIcon sx={{ fontSize: '1.5rem' }} />}
                  >
                    Reset
                  </ResetButton>
                  <SubmitButton
                    type="submit"
                    variant="contained"
                    startIcon={<AddCircleIcon sx={{ fontSize: '1.5rem' }} />}
                  >
                    Add Case
                  </SubmitButton>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </FormSection>
      </FormCard>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ 
          position: 'fixed',
          zIndex: (theme) => theme.zIndex.snackbar
        }}
      >
        <Alert 
          onClose={() => setOpenSnackbar(false)} 
          severity={snackbarSeverity}
          variant="filled"
          sx={{ 
            borderRadius: 1.5,
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            fontSize: '1rem',
            '& .MuiAlert-icon': {
              fontSize: '1.25rem'
            },
            width: 'auto',
            maxWidth: '90vw'
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
}

export default AddCasePage;
