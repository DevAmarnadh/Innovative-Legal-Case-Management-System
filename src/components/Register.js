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
  const [location, setLocation] = useState(null);

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            const apiKey = 'a5ac45accf3a4ee6a8397c5dca5e7fd6';
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
              setRegistrationMessage('Location verified!');
            } else {
              setRegistrationMessage('Failed to retrieve location details.');
            }
          } catch (error) {
            setRegistrationMessage('Error fetching location details.');
          } finally {
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

  const handleRegistration = async (e) => {
    e.preventDefault();

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

      const userData = {
        username: lowercaseUsername,
        email,
        role,
        password,
        location,
      };

      if (role === 'Lawyers/Attorneys') {
        userData.experience = experience;
        userData.department = department;
        userData.boardOfCouncil = boardOfCouncil; 
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

      await axios.post('https://justice-portal-server.vercel.app/api/submit/message', { userEmail: email, userName: username, mailBody: body });
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

            {role === 'Lawyers/Attorneys' && (
              <>
                <TextField
                  label="Experience (Years)"
                  variant="outlined"
                  required
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  autoComplete="off"
                  className="input-field4"
                />
                <br />
                <div className="input-field5">
                  <select
                    value={boardOfCouncil}
                    onChange={(e) => setBoardOfCouncil(e.target.value)}
                    className="custom-select"
                    required
                  >
                    <option value="" disabled>Board of Council*</option>
                    {indianStates.map((state) => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                <br />
                <TextField
                  label="LLB Certificate Number"
                  variant="outlined"
                  required
                  value={llbCertificateNumber}
                  onChange={(e) => setLlbCertificateNumber(e.target.value)}
                  autoComplete="off"
                  className="input-field6"
                />
              </>
            )}

            <div className="password-container">
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Password"
                required
                className="password-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="eye-button"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                <img
                  src={passwordVisible ? eyeOpen : eyeClosed}
                  alt="Eye"
                  className="eye-icon"
                />
              </button>
            </div>

            <Button 
              type="button" 
              variant="contained" 
              color="secondary" 
              onClick={getLocation} 
              className="verify-location-button"
            >
              Verify Location
            </Button>
            <br />
            <Button type="submit" variant="contained" color="primary" className="register-button">
              Register
            </Button>
            <br />

            {registrationSuccess && (
              <Button
                variant="contained"
                color="secondary"
                onClick={() => window.location.href = '/login'}
                className="login-button"
              >
                Go to Login
              </Button>
            )}
          </form>
          <div className="login-redirect">
            <p>Already have an account?</p>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => window.location.href = '/login'}
            >
              Login
            </Button>
          </div>
        </div>
      </div>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={registrationMessage}
      />
    </div>
  );
};

export default Register;
