import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import Cookies from 'js-cookie';
import { TextField, Button, Snackbar } from '@mui/material';
import eyeOpen from './Assets/eye_open.png';
import eyeClosed from './Assets/eye_closed.png';
import '../css/Register.css';
import myImage from './Assets/court3.png';
import axios from 'axios';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [experience, setExperience] = useState('');
  const [department, setDepartment] = useState('');
  const [boardOfCouncil, setBoardOfCouncil] = useState('');
  const [llbCertificateNumber, setLlbCertificateNumber] = useState('');
  const [registrationMessage, setRegistrationMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [location, setLocation] = useState(null); // New state for location

  // List of Indian states for the board of council selection
  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  // Function to get the user's location using OpenCage Geocoding API
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            // Use OpenCage API to reverse geocode latitude and longitude
            const apiKey = 'a5ac45accf3a4ee6a8397c5dca5e7fd6'; // Replace with your actual OpenCage API key
            const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json`, {
              params: {
                q: `${lat},${lon}`,
                key: apiKey
              }
            });

            const locationDetails = response.data.results[0]?.components;
            if (locationDetails) {
              setLocation({
                latitude: lat,
                longitude: lon,
                state: locationDetails.state || 'Unknown',
                country: locationDetails.country || 'Unknown',
              });
            } else {
              setRegistrationMessage('Failed to retrieve location details.');
              setOpenSnackbar(true);
            }
          } catch (error) {
            setRegistrationMessage('Error fetching location details.');
            setOpenSnackbar(true);
          }
        },
        (error) => {
          setRegistrationMessage('Failed to retrieve location.');
          setOpenSnackbar(true);
        }
      );
    } else {
      setRegistrationMessage('Geolocation is not supported by this browser.');
      setOpenSnackbar(true);
    }
  };

  useEffect(() => {
    // Automatically fetch location when component mounts or allow the user to fetch manually
    // getLocation(); // Uncomment if you want to get the location immediately
  }, []);

  const handleRegistration = async (e) => {
    e.preventDefault();

    // Check if location is null, if so, show an error and prevent form submission
    if (!location) {
      setRegistrationMessage('Location is required before registration.');
      setOpenSnackbar(true);
      return;
    }

    const usersCollectionRef = collection(db, 'users');
    const lowercaseUsername = username.toLowerCase();
    const q = query(usersCollectionRef, where('username', '==', lowercaseUsername));

    try {
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setRegistrationMessage('Username already exists. Please choose a different one.');
        setOpenSnackbar(true);
        return;
      }

      // Data to be saved in Firestore
      const userData = {
        username: lowercaseUsername,
        email,
        role,
        password,
        location, // Store location in the user data
      };

      // If the role is "Lawyers/Attorneys", add additional fields
      if (role === 'Lawyers/Attorneys') {
        userData.experience = experience;
        userData.department = department;
        userData.boardOfCouncil = boardOfCouncil; // Store state from board of council
        userData.llbCertificateNumber = llbCertificateNumber;
      }

      await addDoc(usersCollectionRef, userData);

      Cookies.set('username', lowercaseUsername);
      const UserRole = role.substring(5);
      Cookies.set('role', UserRole);
      Cookies.set('email', email);

      const body = {
        name: username,
        intro: "Welcome to Justice Portal, your trusted platform for legal assistance and services!",
        action: {
          instructions: 'To start exploring our services, please click the button below:',
          button: {
            color: '#22BC66',
            text: 'Explore!',
            link: 'https://justice-portal.vercel.app/MainPage'
          }
        },
        outro: "Thank you for choosing Justice Portal. We are dedicated to serving you and ensuring your legal needs are met with professionalism and care."
      };

      // Send email after registration
      axios.post('https://justice-portal-server.vercel.app/api/submit/message', { userEmail: email, userName: username, mailBody: body })
        .then(response => {
          console.log('Response:', response.data);
        })
        .catch(error => {
          console.error('Error during registration:', error);
        });

      setRegistrationSuccess(true);
      setRegistrationMessage('Registration successful! Redirecting...');
      setUsername('');
      setPassword('');

      setTimeout(() => {
        window.location.href = '/MainPage';
      }, 1000);
    } catch (error) {
      console.error('Error during registration:', error);
      setRegistrationMessage('An error occurred during registration. Please try again later.');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div className="registration-container">
      <div className="header-container">
        <div className="img-container">
          <img src={myImage} alt="Description" className="img" />
        </div>
        <h1 className="justiceTitleReg">Justice Portal</h1>
        <h1 className="sloganReg">Bridging the Gap between</h1>
        <h1 className="sloganReg1">Law and Fairness</h1>
      </div>

      <div className="outer-container-reg">
        <div className="register-container">
          <h1 className="register-heading">Register</h1>
          <form className="form" onSubmit={handleRegistration}>
            <TextField
              label="Username"
              variant="outlined"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="off"
              className="input-field1"
            />
            <br />
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="off"
              className="input-field2"
            />
            <br />

            {/* Role Selection */}
            <div className="input-field3">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="custom-select"
                required
              >
                <option value="" disabled>Role*</option>
                <option value="Case Owners/Clients">Case Owners/Clients</option>
                <option value="Lawyers/Attorneys">Lawyers/Attorneys</option>
              </select>
            </div>

            {/* Conditionally render experience, department, board of council, and LLB Certificate Number for Lawyers */}
            {role === 'Lawyers/Attorneys' && (
              <>
                <TextField
                  label="Experience (Years)"
                  variant="outlined"
                  required
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  autoComplete="off"
                  className="input-field2"
                />
                <br />
                <div className="input-field3">
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="custom-select"
                    required
                  >
                    <option value="" disabled>Department*</option>
                    <option value="Criminal Law">Criminal Law</option>
                    <option value="Family Law">Family Law</option>
                    <option value="Criminal Law">Criminal Law</option>
                    <option value="Corporate Law">Corporate Law</option>
                    <option value="Family Law">Family Law</option>
                    <option value="Labor Law">Labor Law</option>
                    <option value="Property Law">Property Law</option>
                  </select>
                </div>
                <div className="input-field3">
                  <select
                    value={boardOfCouncil}
                    onChange={(e) => setBoardOfCouncil(e.target.value)}
                    className="custom-select"
                    required
                  >
                    <option value="" disabled>Board of Council*</option>
                    {indianStates.map((state, index) => (
                      <option key={index} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                <TextField
                  label="LLB Certificate Number"
                  variant="outlined"
                  required
                  value={llbCertificateNumber}
                  onChange={(e) => setLlbCertificateNumber(e.target.value)}
                  autoComplete="off"
                  className="input-field2"
                />
                <br />
              </>
            )}

            {/* Password and Visibility */}
            <TextField
              label="Password"
              type={passwordVisible ? "text" : "password"}
              variant="outlined"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="off"
              className="input-field1"
            />
            <img
              src={passwordVisible ? eyeOpen : eyeClosed}
              alt="Toggle Password Visibility"
              className="eye-icon"
              onClick={() => setPasswordVisible(!passwordVisible)}
            />

            {/* Submit Button */}
            <div className="button-container">
              <Button variant="contained" color="primary" type="submit" className="submit-button" disabled={!location}>
                Register
              </Button>
              <Button variant="contained" color="primary" onClick={getLocation} disabled={location}>
                Verify My Location
              </Button>
            </div>
          </form>

          {/* Snackbar Message */}
          <Snackbar
            open={openSnackbar}
            autoHideDuration={3000}
            onClose={handleCloseSnackbar}
            message={registrationMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
