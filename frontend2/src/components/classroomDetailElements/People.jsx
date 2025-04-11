//// filepath: /Users/sridhar/Sridhar/Personal/Acads/6th-sen-frontend-new/src/components/classroomDetailElements/People.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Avatar, List, ListItem, ListItemAvatar, ListItemText, Divider } from '@mui/material';

const People = ({ classroomCode }) => {
  const [data, setData] = useState({ students: [], instructor: null, assistants: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/classroom/getUserDataByCode/${classroomCode}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        if (res.data.success) {
          setData({
            students: res.data.students,
            instructor: res.data.instructor,
            assistants: res.data.assistants
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPeople();
  }, [classroomCode]);

  if (loading) {
    return <Typography>Loading People...</Typography>;
  }

  return (
    <Box sx={{ maxWidth: '800px', margin: '0 auto', p: 2 }}>
      <Typography variant="h5" sx={{ mb: 1 }}>Teacher</Typography>
      {data.instructor && (
        <>
        <ListItem>
          <ListItemAvatar>
            <Avatar>{data.instructor.name?.charAt(0)}</Avatar>
          </ListItemAvatar>
          <ListItemText primary={data.instructor.name} secondary="Instructor" primaryTypographyProps={{fontWeight: 'bold'}} />
        </ListItem>
          <Divider sx={{ my: 1 }} />
        </>
      )}
      {data.assistants && data.assistants.length > 0 && (
        <>
          <Typography variant="h5" sx={{ mb: 1 }}>Assistants</Typography>
          <List>
            {data.assistants.map((assistant) => (
                <>
              <ListItem key={assistant.id}>
                <ListItemAvatar>
                  <Avatar>{assistant.name?.charAt(0)}</Avatar>
                </ListItemAvatar>
                <ListItemText primary={assistant.name} secondary="Assistant" primaryTypographyProps={{fontWeight: 'bold'}}/>
              </ListItem>
                <Divider sx={{ my: 1 }} />
                </>
            ))}
          </List>
        </>
      )}
      <Typography variant="h5" sx={{ mt: 4 }}>Classmates</Typography>
      <List>
        {data.students.map((student) => (
            <>
          <ListItem key={student.id}>
            <ListItemAvatar>
              <Avatar>{student.name?.charAt(0)}</Avatar>
            </ListItemAvatar>
            <ListItemText primary={student.name} secondary="Student" primaryTypographyProps={{fontWeight: 'bold'}} />
          </ListItem>
          <Divider sx={{ my: 1 }} />
          </>
        ))}
      </List>
    </Box>
  );
};

export default People;