import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Link,
  Divider,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import GavelIcon from '@mui/icons-material/Gavel';

const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Quick Links',
      links: [
        { text: 'Home', href: '/MainPage' },
        { text: 'About', href: '/about' },
        { text: 'Contact', href: '/contact' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { text: 'Privacy Policy', href: '/privacy' },
        { text: 'Terms of Service', href: '/terms' },
        { text: 'Disclaimer', href: '/disclaimer' },
      ],
    },
    {
      title: 'Support',
      links: [
        { text: 'FAQ', href: '/faq' },
        { text: 'Help Center', href: '/help' },
        { text: 'Resources', href: '/resources' },
      ],
    },
  ];

  const socialLinks = [
    { icon: <FacebookIcon sx={{ fontSize: 20 }} />, href: 'https://facebook.com' },
    { icon: <TwitterIcon sx={{ fontSize: 20 }} />, href: 'https://twitter.com' },
    { icon: <LinkedInIcon sx={{ fontSize: 20 }} />, href: 'https://linkedin.com' },
    { icon: <InstagramIcon sx={{ fontSize: 20 }} />, href: 'https://instagram.com' },
  ];

  const contactInfo = [
    { icon: <EmailIcon sx={{ fontSize: 18 }} />, text: 'contact@justiceportal.com' },
    { icon: <PhoneIcon sx={{ fontSize: 18 }} />, text: '+1 (555) 123-4567' },
    { icon: <LocationOnIcon sx={{ fontSize: 18 }} />, text: 'New York, NY 10001' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        color: 'text.primary',
        py: 3,
        borderTop: '1px solid',
        borderColor: 'divider',
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* Logo and Description */}
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <GavelIcon sx={{ fontSize: 24, color: 'primary.main', mr: 1 }} />
              <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>
                Justice Portal
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.875rem' }}>
              Bridging the gap between justice seekers and legal professionals.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {socialLinks.map((social, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <IconButton
                    size="small"
                    component="a"
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: 'primary.main',
                      '&:hover': { bgcolor: 'primary.main', color: 'white' },
                    }}
                  >
                    {social.icon}
                  </IconButton>
                </motion.div>
              ))}
            </Box>
          </Grid>

          {/* Quick Links Sections */}
          {footerSections.map((section, index) => (
            <Grid item xs={6} sm={4} md={2} key={section.title}>
              <Typography
                variant="subtitle2"
                color="primary.main"
                sx={{ fontWeight: 600, mb: 1 }}
              >
                {section.title}
              </Typography>
              <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                {section.links.map((link) => (
                  <motion.li
                    key={link.text}
                    whileHover={{ x: 3 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Link
                      href={link.href}
                      underline="none"
                      color="text.secondary"
                      sx={{
                        display: 'block',
                        mb: 0.5,
                        fontSize: '0.875rem',
                        '&:hover': { color: 'primary.main' },
                      }}
                    >
                      {link.text}
                    </Link>
                  </motion.li>
                ))}
              </Box>
            </Grid>
          ))}

          {/* Contact Information */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="subtitle2"
              color="primary.main"
              sx={{ fontWeight: 600, mb: 1 }}
            >
              Contact Us
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {contactInfo.map((info, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    color: 'text.secondary',
                    gap: 1,
                  }}
                >
                  {info.icon}
                  <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                    {info.text}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Copyright Section */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            © {currentYear} Justice Portal. All rights reserved.
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Made with ❤️ for better legal access
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 