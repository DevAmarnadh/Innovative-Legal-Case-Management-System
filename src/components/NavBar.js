import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Joyride, { STATUS } from 'react-joyride'; // Import Joyride for tour functionality
import styles from '../css/NavBar.module.css'; // CSS for styling
import Cookies from 'js-cookie'; // Cookie handling
import logo from '../components/Assets/court3.png'; // Logo import

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(Cookies.get('username') !== undefined);
  const username = Cookies.get('username');
  const userRole = Cookies.get('role');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [runTour, setRunTour] = useState(false); // Control the tour run state
  const navRef = useRef(null);

  // Define the steps for the tour, targeting each menu item
  const tourSteps = [
    {
      target: '.home-nav',
      content: 'Start your journey from the Home page.',
      placement: 'bottom',
    },
    {
      target: '.add-case-nav',
      content: 'Add a new case from here.',
      placement: 'bottom',
    },
    {
      target: '.all-cases-nav',
      content: 'View all cases in the system.',
      placement: 'bottom',
    },
    {
      target: '.lawyers-nav',
      content: 'Browse available lawyers here.',
      placement: 'bottom',
    },
    {
      target: '.my-cases-nav',
      content: 'Track your cases in this section.',
      placement: 'bottom',
    },
    {
      target: '.inbox-nav',
      content: 'Check your messages in the Inbox.',
      placement: 'bottom',
    },
    {
      target: '.profile-nav',
      content: 'Manage your profile here.',
      placement: 'bottom',
    },
    {
      target: '.contact-nav',
      content: 'Get in touch through the Contact page.',
      placement: 'bottom',
    },
  ];

  // Start the tour when user lands on Add Case page
  useEffect(() => {
    if (location.pathname === '/add-case') {
      setRunTour(true);
    }
  }, [location]);

  // Logout handlers
  const handleLogout = () => {
    setShowLogoutModal(true);
    setIsMenuOpen(false);
  };

  const confirmLogout = () => {
    Cookies.remove('username');
    Cookies.remove('role');
    Cookies.remove('email');
    setIsLoggedIn(false);
    navigate('/login');
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuItemClick = () => {
    setIsMenuOpen(false);
  };

  // Joyride callback to handle tour lifecycle events
  const handleTourCallback = (data) => {
    const { status } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];
    if (finishedStatuses.includes(status)) {
      setRunTour(false); // Stop the tour when finished or skipped
    }
  };

  return (
    isLoggedIn && (
      <>
        <Joyride
          steps={tourSteps}
          run={runTour}
          continuous={true}
          showProgress={true}
          showSkipButton={true}
          callback={handleTourCallback} // Callback for tour events
          styles={{
            options: {
              arrowColor: '#fff',
              backgroundColor: '#5e72e4',
              overlayColor: 'rgba(0, 0, 0, 0.5)',
              primaryColor: '#5e72e4',
              textColor: '#fff',
              width: 300,
              zIndex: 1000,
            },
            buttonClose: {
              color: '#fff',
            },
            buttonBack: {
              marginRight: 10,
              color: '#fff',
            },
          }}
        />

        <nav className={styles.nav} ref={navRef}>
          <div className={styles.logoContainer}>
            <a href="/MainPage" className={styles.logoLink}>
              <img src={logo} alt="Logo" className={styles.logo} />
              <span className={styles.logoText}>Justice Portal</span>
            </a>
          </div>
          <div className={styles.menuToggle} onClick={toggleMenu}>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
          </div>
          <ul className={`${styles.menu} ${isMenuOpen ? styles.active : ''}`}>
            <li className="home-nav">
              <Link to="/MainPage" onClick={handleMenuItemClick}>Home</Link>
            </li>
            <li className="add-case-nav">
              <Link to="/add-case" onClick={handleMenuItemClick}>Add Case</Link>
            </li>
            {userRole !== 'Owners/Clients' && (
              <li className="all-cases-nav">
                <Link to="/all-cases" onClick={handleMenuItemClick}>All Cases</Link>
              </li>
            )}
            <li className="lawyers-nav">
              <Link to="/lawyers" onClick={handleMenuItemClick}>Lawyers</Link>
            </li>
            <li className="my-cases-nav">
              <Link to="/my-cases" onClick={handleMenuItemClick}>My Cases</Link>
            </li>
            <li className="inbox-nav">
              <Link to="/inbox" onClick={handleMenuItemClick}>Inbox</Link>
            </li>
            <li className="profile-nav">
              <Link to="/profile" onClick={handleMenuItemClick}>Profile</Link>
            </li>
            <li className="contact-nav">
              <Link to="/contact" onClick={handleMenuItemClick}>Contact</Link>
            </li>
            <li className={styles.userSection}>
              <span>{username}</span>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </nav>

        {/* Logout Confirmation Modal */}
        {showLogoutModal && (
          <div className={styles.confirmLogoutModal}>
            <div className={styles.modalContent}>
              <h3>Confirm Logout</h3>
              <p>Are you sure you want to log out?</p>
              <button className={styles.btnConfirm} onClick={confirmLogout}>Yes</button>
              <button className={styles.btnCancel} onClick={cancelLogout}>Cancel</button>
            </div>
          </div>
        )}
      </>
    )
  );
}

export default NavBar;
