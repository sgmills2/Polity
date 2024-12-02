import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const Hero = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        height: '70vh',
        background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
        color: '#fff',
        clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)',
      }}
    >
      <Typography variant="h2" sx={{ mb: 2 }}>
        Welcome to Polity
      </Typography>
      <Typography variant="h6" sx={{ mb: 4 }}>
        Aggregating Political Views and Insights
      </Typography>
      <Button variant="contained" color="secondary">
        Learn More
      </Button>
    </Box>
  );
};

export default Hero;