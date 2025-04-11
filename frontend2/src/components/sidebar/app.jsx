import React from 'react';
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

function Sidebar() {
  const { classrooms, loading, error } = useSelector((state) => state.classrooms);

  const profile = {
    name: 'John Doe',
    avatarUrl: 'https://via.placeholder.com/150',
  };

  return (
    <Box sx={{ width: 250, bgcolor: 'background.paper', height: '100vh', p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar src={profile.avatarUrl}>
          {profile.name.charAt(0)}
        </Avatar>
        <Typography variant="subtitle1" sx={{ ml: 1 }}>
          {profile.name}
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6">Joined Classrooms</Typography>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : error ? (
          <Typography color="error">Error: {error}</Typography>
        ) : classrooms && classrooms.length > 0 ? (
          <List>
            {classrooms.map((classroom) => (
              <ListItem key={classroom.id} button>
                <ListItemText primary={classroom.name} />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography>No classrooms joined.</Typography>
        )}
      </Box>
    </Box>
  );
}

export default Sidebar;
