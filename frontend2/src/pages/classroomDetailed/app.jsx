import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import { fetchClassroomDetails } from '../../middleware/classroomDetailSlice';
import BasicTabs from '../../components/classroomDetailElements/BasicTabs';
import { useDispatch } from 'react-redux';

const theme = createTheme();

const ClassroomDetail = () => {
  const { classroomCode } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchClassroomDetails(classroomCode));
  }
    , [classroomCode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <BasicTabs id={classroomCode} />
      </Box>
    </ThemeProvider>
  );
};

export default ClassroomDetail;
