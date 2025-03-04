/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { Box, CircularProgress, IconButton, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import './style.css';

const ClassroomGrid = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const fetchClassrooms = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/classroom/getAll", {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setClassrooms(data.classrooms);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to fetch classrooms");
    } finally {
      setLoading(false);
    }
  };

  const copyClassCode = (code) => {
    navigator.clipboard.writeText(code);
  };

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
      <CircularProgress />
    </Box>
  );

  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="classroom-grid">
      {classrooms.map((classroom) => (
        <div key={classroom._id} className="classroom-card">
          <div className="classroom-header">
            <h3 className="classroom-title">{classroom.name}</h3>
            <div className="classroom-subject">{classroom.subject}</div>
          </div>
          <div className="classroom-content">
            <p className="classroom-description">{classroom.description}</p>
          </div>
          <div className="classroom-footer">
            <span className="classroom-code">
              Code: {classroom.classCode}
            </span>
            <Tooltip title="Copy Code">
              <IconButton 
                size="small"
                onClick={() => copyClassCode(classroom.classCode)}
              >
                <ContentCopyIcon />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClassroomGrid;