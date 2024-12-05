import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, getDocs, where, query, addDoc } from "firebase/firestore";
import Cookies from "js-cookie";
import "../css/ClientRequests.css";
import LawyerProfile from "./LawyerProfile/LawyerProfile";

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

function ClientRequests() {
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
  const [showRecommendedLawyers, setShowRecommendedLawyers] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [showLawyerProfile, setShowLawyerProfile] = useState(false);
  const [selectedLawyerProfile, setSelectedLawyerProfile] = useState(null);

  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        const lawyersCollection = collection(db, "users");
        const querySnapshot = await getDocs(lawyersCollection);
        if (!querySnapshot.empty) {
          const lawyersData = [];
          querySnapshot.forEach((doc) => {
            const userData = doc.data();
            if (userData.role === "Lawyers/Attorneys") {
              lawyersData.push({
                username: userData.username,
                department: userData.department,
                email: userData.email,
                experience: userData.experience,
                rating: userData.rating,
              });
            }
          });
          setLawyersList(lawyersData);
        } else {
          console.log("No lawyers found.");
        }
      } catch (error) {
        console.error("Error fetching lawyers:", error);
      }
    };

    const username = Cookies.get("username");
    if (username) {
      setIsLoggedIn(true);
      setLoggedInUsername(username);
      fetchClientCases(username);
    }

    fetchLawyers();
  }, []);

  const fetchClientCases = async (username) => {
    try {
      const casesCollection = collection(db, "cases");
      const q = query(casesCollection, where("username", "==", username));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const casesData = [];
        querySnapshot.forEach((doc) => {
          const caseData = doc.data();
          casesData.push({ id: doc.id, ...caseData });
        });
        setClientCases(casesData);
      } else {
        console.log("No cases found for the client.");
      }
    } catch (error) {
      console.error("Error fetching client cases:", error);
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
      console.log("Request sent successfully:", request);

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

  const fetchRecommendedLawyers = async () => {
    try {
      if (!showRecommendedLawyers) {
        const lawyersCollection = collection(db, "recommendedLawyers");
        const querySnapshot = await getDocs(lawyersCollection);
        if (!querySnapshot.empty) {
          const lawyersData = [];
          querySnapshot.forEach((doc) => {
            const lawyer = doc.data();
            lawyersData.push({
              department: lawyer.department,
              experience: lawyer.experience,
              rating: lawyer.rating,
              username: lawyer.username,
            });
          });
          setRecommendedLawyers(lawyersData);
        } else {
          console.log("No recommended lawyers found.");
        }
      }
      setShowRecommendedLawyers(!showRecommendedLawyers);
    } catch (error) {
      console.error("Error fetching recommended lawyers:", error);
    }
  };

  const renderStars = (rating) => {
    const numStars = Math.round(Number(rating));
    if (isNaN(numStars) || numStars < 0) return null;

    return Array.from({ length: numStars }, (_, index) => (
      <span key={index}>⭐</span>
    ));
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

  const handleLawyerProfile = (lawyer) => {
    setSelectedLawyerProfile(lawyer);
    setShowLawyerProfile(true);
  };

  return (
    <div className="client-requests-container">
      <h2 style={{ color: "#fff" }}>REQUEST LAWYER AND COMMUNICATE WITH THEM...</h2>
      {isLoggedIn ? (
        <div className="request-form">
          <div className="input-field">
            <label htmlFor="language-dropdown">Select Language:</label>
            <select
              id="language-dropdown"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              <option value="">Select a Language</option>
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <div className="input-field">
            <label htmlFor="case-dropdown">Choose Case:</label>
            <select
              id="case-dropdown"
              value={selectedCase}
              onChange={(e) => {
                setSelectedCase(e.target.value);
                const selectedTitle = clientCases.find(
                  (caseItem) => caseItem.id === e.target.value
                )?.caseTitle;
                setSelectedCaseTitle(selectedTitle || "");
              }}
            >
              <option value="">Select a Case</option>
              {clientCases.map((caseItem) => (
                <option key={caseItem.id} value={caseItem.id}>
                  {caseItem.caseTitle}
                </option>
              ))}
            </select>
          </div>

          <div className="input-field">
            <label htmlFor="request-message">Message:</label>
            <textarea
              id="request-message"
              value={requestMessage}
              onChange={(e) => setRequestMessage(e.target.value)}
              style={{ width: "93%" }}
            />
            <button onClick={startVoiceInput} style={{ marginTop: "10px" }}>
              🎤 Speak
            </button>
          </div>

          <div className="input-field">
            <label htmlFor="lawyers-list">Select Lawyer:</label>
            <select
              id="lawyers-list"
              value={selectedLawyer}
              onChange={(e) => setSelectedLawyer(e.target.value)}
            >
              <option value="">Select a Lawyer</option>
              {lawyersList.map((lawyer, index) => (
                <option key={index} value={lawyer.username}>
                  {lawyer.username} - {lawyer.department}
                </option>
              ))}
            </select>
          </div>

          <button onClick={handleSendRequest}>Send Request</button>
        </div>
      ) : (
        <p>Please log in to request a lawyer.</p>
      )}

      {snackbarOpen && <div className="snackbar">{snackbarMessage}</div>}
      <div className="recommended-lawyers">
        <button onClick={fetchRecommendedLawyers}>
          {showRecommendedLawyers
            ? "Hide Recommended Lawyers"
            : "Show Recommended Lawyers"}
        </button>
        {showRecommendedLawyers && recommendedLawyers.length > 0 && (
          <div className="lawyers-list">
            {recommendedLawyers.map((lawyer, index) => (
              <div className="lawyer-card" key={index}>
                <h4>
                  <strong>Lawyer Name: </strong>
                  {lawyer.username}
                </h4>
                <p>Rating: {renderStars(lawyer.rating)}</p>
                <hr />
                <center>
                  <button onClick={() => handleLawyerProfile(lawyer)}>
                    Show Lawyer Profile
                  </button>
                </center>
              </div>
            ))}
          </div>
        )}
      </div>
      {showLawyerProfile && (
        <div className="popup-overlay">
          <LawyerProfile
            lawyer={selectedLawyerProfile}
            onClose={() => setShowLawyerProfile(false)}
          />
        </div>
      )}
    </div>
  );
}

export default ClientRequests;
