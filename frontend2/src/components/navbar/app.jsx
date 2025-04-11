import React from 'react';
import { Box, Typography } from '@mui/material';

const customNavbar = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
      }}
      className="flex items-center justify-between gap-2"
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/5/59/Google_Classroom_Logo.png"
          alt="Google Classroom"
          className='h-6 w-8'
        />
        <Typography variant="h6">Classroom</Typography>
      </Box>
    </Box>
  );
}

export default customNavbar;