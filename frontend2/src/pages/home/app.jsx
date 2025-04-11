import * as React from 'react';
import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useSelector, useDispatch } from 'react-redux';
import { fetchClassrooms } from '../../middleware/classroomThunk';
import ClassroomCard from '../../components/classroomCard/app';
import { Grid } from '@mui/material';

const Home = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchClassrooms());
  }, [dispatch]);

  const { classrooms, loading, error } = useSelector((state) => state.classrooms);

  console.log('Classrooms:', classrooms);

  return (
    <Box sx={{ py: 4, px: 2 }}>
      {loading ? (
        <Typography>Loading classrooms...</Typography>
      ) : error ? (
        <Typography color="error">Error: {error}</Typography>
      ) : classrooms && classrooms.length > 0 ? (
        <Grid
          // sx={{
          //   display: 'grid',
          //   gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          //   // gap: 2,
          // }}
          sx={
            {
              gap: 3,
            }
          }
          container
        >
          {classrooms.map((classroom) => (
            <ClassroomCard
              key={classroom.id}
              classroom={classroom}
              onClick={() => {
                console.log(`Navigating to classroom ${classroom.id}`);
              }}
            />
          ))}
        </Grid>
      ) : (
        <Typography>No classrooms available.</Typography>
      )}
    </Box>
  );
}

export default Home;