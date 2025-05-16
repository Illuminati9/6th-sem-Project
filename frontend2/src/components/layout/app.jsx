import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Navbar from '../navbar/app';
import Sidebar from '../sidebar/app';

function Layout({ children }) {
  return (
    <Box>
      <Navbar title="Classroom" />
      <Box sx={{ display: 'flex' }}>
        <Sidebar />
        <Box sx={{ flex: 1, p: 2 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}

Layout.propTypes = {
  children: PropTypes.node,
};

export default Layout;