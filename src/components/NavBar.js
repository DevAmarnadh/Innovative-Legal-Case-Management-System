import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Popper,
  Paper,
  ClickAwayListener,
  Grow,
  Tooltip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import GavelIcon from '@mui/icons-material/Gavel';
import InboxIcon from '@mui/icons-material/Inbox';
import PersonIcon from '@mui/icons-material/Person';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { motion } from 'framer-motion';
import Cookies from 'js-cookie';
import '../css/NavBar.css';

const NavBar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const isMobile = window.matchMedia('(max-width:960px)').matches;
  const navigate = useNavigate();
  const username = Cookies.get('username');
  const userRole = Cookies.get('role');
  const email = Cookies.get('email');

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    setDropdownOpen(false);
    Cookies.remove('username');
    Cookies.remove('role');
    Cookies.remove('email');
    navigate('/login');
  };

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
    setDropdownOpen(!dropdownOpen);
  };

  const handleClickAway = () => {
    setDropdownOpen(false);
  };

  const getMenuItems = () => {
    const commonItems = [
      { text: 'Home', icon: <HomeIcon />, path: '/MainPage' },
      { text: 'Inbox', icon: <InboxIcon />, path: '/inbox' },
      { text: 'Request Lawyer', icon: <PeopleIcon />, path: '/lawyers' },
      { text: 'Contact', icon: <ContactMailIcon />, path: '/contact' },
    ];

    const clientItems = [
      { text: 'Add Case', icon: <AddCircleOutlineIcon />, path: '/add-case' },
      { text: 'My Cases', icon: <GavelIcon />, path: '/my-cases' },
    ];

    const lawyerItems = [
      { text: 'View All Cases', icon: <AssignmentIcon />, path: '/all-cases' },
      { text: 'My Cases', icon: <GavelIcon />, path: '/my-cases' },
    ];

    const isLawyer = userRole === 'rs/Attorneys';
    if (isLawyer) {
      return [...commonItems, ...lawyerItems];
    } else if (userRole === 'Owners/Clients') {
      return [...commonItems, ...clientItems];
    }
    return commonItems;
  };

  const menuItems = getMenuItems();

  const drawer = (
    <Box sx={{ width: 250, bgcolor: '#fff', height: '100%' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar className="user-avatar" sx={{ bgcolor: 'primary.main' }}>
          {username?.charAt(0)?.toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="subtitle1" noWrap>
            {username}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {userRole}
          </Typography>
        </Box>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => {
              navigate(item.path);
              if (isMobile) handleDrawerToggle();
            }}
            className="drawer-list-item"
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
    >
      <AppBar position="fixed" className="navbar">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
              className="menu-icon"
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              component="div"
              className="navbar-logo"
              onClick={() => navigate('/MainPage')}
              sx={{
                fontWeight: 'bold',
                letterSpacing: 1,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <GavelIcon /> JUSTICE PORTAL
            </Typography>
          </Box>

          <Box 
            sx={{ 
              display: { xs: 'none', md: 'flex' }, 
              gap: 1, 
              alignItems: 'center',
              justifyContent: 'center',
              flex: '1 1 auto',
              maxWidth: '800px',
              mx: 4
            }}
          >
            {menuItems.map((item) => (
              <Tooltip key={item.text} title={item.text}>
                <Button
                  color="inherit"
                  startIcon={item.icon}
                  onClick={() => navigate(item.path)}
                  className="nav-button"
                >
                  {item.text}
                </Button>
              </Tooltip>
            ))}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Account settings">
              <Avatar
                className="nav-avatar"
                onClick={handleAvatarClick}
                sx={{ width: 40, height: 40 }}
              >
                {username?.charAt(0)?.toUpperCase()}
              </Avatar>
            </Tooltip>
            <Popper
              open={dropdownOpen}
              anchorEl={anchorEl}
              placement="bottom-end"
              transition
              disablePortal
            >
              {({ TransitionProps }) => (
                <ClickAwayListener onClickAway={handleClickAway}>
                  <Grow {...TransitionProps}>
                    <Paper className="avatar-dropdown">
                      <Box className="dropdown-user-info">
                        <Typography className="dropdown-username">
                          {username}
                        </Typography>
                        <Typography className="dropdown-email">
                          {email}
                        </Typography>
                      </Box>
                      <div className="dropdown-divider" />
                      <Box 
                        className="dropdown-item"
                        onClick={() => {
                          navigate('/profile');
                          setDropdownOpen(false);
                        }}
                        sx={{ cursor: 'pointer' }}
                      >
                        <AccountCircleIcon className="icon" />
                        View Profile
                      </Box>
                      <div className="dropdown-divider" />
                      <Box 
                        className="dropdown-item logout"
                        onClick={handleLogout}
                        sx={{ cursor: 'pointer' }}
                      >
                        <LogoutIcon className="icon" />
                        Logout
                      </Box>
                    </Paper>
                  </Grow>
                </ClickAwayListener>
              )}
            </Popper>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 250,
            bgcolor: '#fff',
          },
        }}
      >
        {drawer}
      </Drawer>
    </motion.div>
  );
};

export default NavBar;