import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Box,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Divider,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import axios from "axios";
import "../styles.css";
import { Link } from "react-router-dom";

const Classwork = ({ id }) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const userId = localStorage.getItem("id");
  const instructorId = localStorage.getItem("classroomInstructor");

  // Create assignment form state
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [assignmentDueDate, setAssignmentDueDate] = useState(""); // expected format: YYYY-MM-DD from input type "date"
  const [assignmentDueTime, setAssignmentDueTime] = useState(""); // expected format: "hh:mm" in 12-hour format (text input)
  const [dueMeridian, setDueMeridian] = useState("AM"); // AM or PM selection
  const [assignmentDescription, setAssignmentDescription] = useState("");
  const [questions, setQuestions] = useState([{ content: "" }]);

  // Fetch assignments from backend
  const fetchAssignments = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/assignment/getAll/" + id, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log(res.data);
      setAssignments(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch assignments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [id]);

  // Handlers for dynamic question fields
  const handleAddQuestion = () => {
    setQuestions([...questions, { content: "" }]);
  };

  const handleRemoveQuestion = (index) => {
    const newQuestions = questions.filter((q, i) => i !== index);
    setQuestions(newQuestions);
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].content = value;
    setQuestions(newQuestions);
  };

  // Helper to convert 12-hour time (hh:mm with AM/PM) to 24-hour format
  const convertTo24Hour = (time, meridian) => {
    // expecting time in "hh:mm" format, e.g. "09:30"
    if (!time) return "";
    const [hourStr, minute] = time.split(":");
    let hour = parseInt(hourStr, 10);
    if (meridian === "AM") {
      if (hour === 12) hour = 0;
    } else {
      if (hour !== 12) hour += 12;
    }
    const hourFormatted = hour < 10 ? "0" + hour : hour.toString();
    return `${hourFormatted}:${minute}`;
  };

  // Create assignment handler with combined due date timestamp (date + converted time)
  const handleCreateAssignment = async () => {
    const convertedTime = convertTo24Hour(assignmentDueTime, dueMeridian);
    const dueDateTime = `${assignmentDueDate}T${convertedTime}`; // e.g. "2025-03-31T09:30"
    
    // Verify that the dueDateTime is valid before sending
    if (isNaN(new Date(dueDateTime).getTime())) {
      alert("Invalid due date/time provided. Please check your inputs.");
      return;
    }

    if(questions[0].content === "") {
      alert("Please add at least one question.");
      return;
    }

    const payload = {
      title: assignmentTitle,
      dueDate: dueDateTime, // contains both date and time
      description: assignmentDescription,
      questions: questions,
      classroomId: id,
    };

    try {
      const res = await axios.post("http://localhost:8000/api/assignment/create/" + id, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log(res.data);
      fetchAssignments(); // Refresh assignments list after creation
      setOpenCreate(false); // Close the dialog

      // Reset form fields
      setAssignmentTitle("");
      setAssignmentDueDate("");
      setAssignmentDueTime("");
      setDueMeridian("AM");
      setAssignmentDescription("");
      setQuestions([{ content: "" }]);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <Typography>Loading assignments...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>
        Classwork Assignments
      </Typography>
      {userId === instructorId && (
        <div>
          <Fab
            variant="extended"
            color="primary"
            aria-label="add"
            onClick={() => setOpenCreate(true)}
            sx={{ mb: 2 }}
          >
            <AddIcon />
            Create
          </Fab>
        </div>
      )}
      <Divider sx={{my:4}}/>

      {assignments.length !== 0 ? (
        <Grid container spacing={2}>
          {assignments.map((assignment) => (
            <Grid item xs={12} sm={6} md={4} key={assignment._id}>
              <Card variant="outlined">
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Avatar>{assignment.title.charAt(0)}</Avatar>
                    <Typography variant="h6" ml={2}>
                      {assignment.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    Due: {new Date(assignment.dueDate).toLocaleDateString()}{" "}
                    {new Date(assignment.dueDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </Typography>
                  <Typography variant="body2" mt={1}>
                    {assignment.description}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    component={Link}
                    to={`/assignment/${assignment._id}`}
                    sx={{ mt: 2 }}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box>
          <Typography
            variant="h6"
            color="textSecondary"
            sx={{ textAlign: "center", mt: 4 }}
          >
            No assignments available
          </Typography>
        </Box>
      )}

      {/* Dialog for Creating Assignment */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} fullWidth maxWidth="sm">
        <DialogTitle>Create New Assignment</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Assignment Title"
            type="text"
            fullWidth
            value={assignmentTitle}
            onChange={(e) => setAssignmentTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Due Date"
            type="date"
            fullWidth
            value={assignmentDueDate}
            onChange={(e) => setAssignmentDueDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
            {/* Use type "text" here so user can enter time as 12-hr (hh:mm) */}
            <TextField
              margin="dense"
              label="Due Time (hh:mm)"
              type="text"
              fullWidth
              value={assignmentDueTime}
              onChange={(e) => setAssignmentDueTime(e.target.value)}
              placeholder="09:30"
            />
            <FormControl sx={{ minWidth: 80 }}>
              <InputLabel id="meridian-label" shrink>
                AM/PM
              </InputLabel>
              <Select
                labelId="meridian-label"
                value={dueMeridian}
                onChange={(e) => setDueMeridian(e.target.value)}
                label="AM/PM"
              >
                <MenuItem value="AM">AM</MenuItem>
                <MenuItem value="PM">PM</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={3}
            value={assignmentDescription}
            onChange={(e) => setAssignmentDescription(e.target.value)}
          />
          <Typography variant="subtitle1" mt={2}>
            Questions
          </Typography>
          {questions.map((ques, index) => (
            <Box key={index} display="flex" alignItems="center" mt={1}>
              <TextField
                margin="dense"
                label={`Question ${index + 1}`}
                type="text"
                fullWidth
                value={ques.content}
                onChange={(e) => handleQuestionChange(index, e.target.value)}
              />
              <IconButton onClick={() => handleRemoveQuestion(index)}>
                <RemoveCircleIcon color="error" />
              </IconButton>
            </Box>
          ))}
          <Button onClick={handleAddQuestion} variant="outlined" sx={{ mt: 1 }}>
            Add Question
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)}>Cancel</Button>
          <Button onClick={handleCreateAssignment} variant="contained" color="primary">
            Create Assignment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Classwork;