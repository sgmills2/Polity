import React from 'react';
import { Box, Typography, Slider } from '@mui/material';

const marks = [
  { value: 0, label: 'Conservative' },
  { value: 50, label: 'Moderate' },
  { value: 100, label: 'Progressive' },
];

const Profile = ({ name, votingScore }) => {
  return (
    <Box sx={{ p: 3, border: '1px solid #ddd', borderRadius: 2 }}>
      <Typography variant="h5">{name}</Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Voting History
      </Typography>
      <Slider
        value={votingScore}
        marks={marks}
        step={1}
        min={0}
        max={100}
        sx={{ mt: 2 }}
      />
    </Box>
  );
};

export default Profile;