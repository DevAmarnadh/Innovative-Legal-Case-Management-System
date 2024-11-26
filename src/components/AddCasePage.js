import React, { useState } from 'react';
import { db, storage } from './firebase'; // Import the Firestore database instance and Firebase storage instance
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import '../css/AddCasePage.css';
import Cookies from 'js-cookie';
import { Snackbar } from '@mui/material';

function AddCasePage() {
  const [caseTitle, setCaseTitle] = useState('');
  const [caseDescription, setCaseDescription] = useState('');
  const [caseType, setCaseType] = useState('');
  const [caseAssignee, setCaseAssignee] = useState('');
  const [filingDate, setFilingDate] = useState('');
  const [files, setFiles] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('en-US'); // Default language
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // To control the severity of the snackbar (success, error, warning, info)

  const username = Cookies.get('username');

  const handleFileChange = (e) => {
    const fileList = e.target.files;
    setFiles([...files, ...fileList]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Upload files to Firebase Storage
      const uploadedFiles = await Promise.all(files.map(async file => {
        const storageRef = ref(storage, `cases/${file.name}`);
        await uploadBytes(storageRef, file);
        return storageRef;
      }));

      // Store text details in Firestore along with file references
      const currentDate = new Date();
      const options = { timeZone: 'Asia/Kolkata' }; // IST time zone identifier
      const localTimeString = currentDate.toLocaleString('en-US', options);

      await addDoc(collection(db, "cases"), {
        caseTitle,
        caseDescription,
        caseType,
        caseAssignee,
        email: Cookies.get('email'),
        filingDateTime: localTimeString,
        files: uploadedFiles.map(fileRef => fileRef.fullPath), // Store file references
        username: username,
      });

      // Reset form fields
      resetForm();
      setSnackbarMessage('Case added successfully!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);

      // Set a timeout to display the second Snackbar after 4 seconds
      setTimeout(() => {
        setSnackbarMessage("Please proceed to 'My Cases' for verification");
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
      }, 4000); // Delay the execution of the second Snackbar update by 4000 milliseconds (4 seconds)
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
    setFilingDate('');
    setFiles([]);
    window.location.reload(); // Refresh the page
  };

  // Speech recognition
  const startRecognition = (field) => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = selectedLanguage; // Set language based on user selection
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
    <>
      <h2 className='heads'>ADD CASE</h2>
      <div className="add-case-page">
        <form onSubmit={handleSubmit}>
          <label>
            <b>Select Language:</b>
            <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)}>
              <option value="en-US">English</option>
              <option value="hi-IN">Hindi</option>
              <option value="bn-IN">Bengali</option>
              <option value="ta-IN">Tamil</option>
              <option value="te-IN">Telugu</option>
              <option value="ml-IN">Malayalam</option>
              <option value="kn-IN">Kannada</option>
              <option value="mr-IN">Marathi</option>
              <option value="gu-IN">Gujarati</option>
              <option value="or-IN">Odia</option>
              <option value="pa-IN">Punjabi</option>
              {/* Add more languages as needed */}
            </select>
          </label>
          <label>
            <b>Case Title:</b>
            <input type="text" value={caseTitle} onChange={(e) => setCaseTitle(e.target.value)} required />
            <button type="button" onClick={() => startRecognition('title')}>🎤</button>
          </label>
          <label>
            <b>Case Description:</b>
            <textarea value={caseDescription} onChange={(e) => setCaseDescription(e.target.value)} required />
            <button type="button" onClick={() => startRecognition('description')}>🎤</button>
          </label>
          <label>
            <b>Case Type:</b>
            <input type="text" value={caseType} onChange={(e) => setCaseType(e.target.value)} required />
            <button type="button" onClick={() => startRecognition('type')}>🎤</button>
          </label>
          <label>
            <b>Client Name:</b>
            <input type="text" value={caseAssignee} onChange={(e) => setCaseAssignee(e.target.value)} required />
            <button type="button" onClick={() => startRecognition('assignee')}>🎤</button>
          </label>
          <label>
            <b>Upload File(s):</b>
            <input type="file" multiple onChange={handleFileChange} required />
          </label>
          <div className="buttons">
            <button type="submit">Add Case</button>
            <button type="button" onClick={resetForm}>Reset</button>
          </div>
        </form>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
          message={snackbarMessage}
          severity={snackbarSeverity}
        />
      </div>
      <div className="page-footer" style={{ backgroundColor: '#000000' }}>
        <h7 className="msg">"Fill out the form accurately!"</h7>
      </div>
    </>
  );
}

export default AddCasePage;
