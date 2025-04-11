import React, { useEffect, useState } from "react";
import { Grid, Card, CardContent, Typography, Avatar, Button, Box, Fab, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Divider, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAssignmentsForClassroom } from "../../middleware/assignmentSlice";

const Classwork = ({ id }) => {
  const dispatch = useDispatch();
  const { assignments, loading, error } = useSelector((state) => state.assignment);
  console.log("Assignment Data:", assignments)
  const userId = localStorage.getItem("id");
  const instructorId = localStorage.getItem("classroomInstructor");

  const [openCreate, setOpenCreate] = useState(false);
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [assignmentDueDate, setAssignmentDueDate] = useState("");
  const [assignmentDueTime, setAssignmentDueTime] = useState("");
  const [dueMeridian, setDueMeridian] = useState("AM");
  const [assignmentDescription, setAssignmentDescription] = useState("");
  const [questions, setQuestions] = useState([{ content: "" }]);

  useEffect(() => {
    dispatch(fetchAssignmentsForClassroom(id));
  }, [dispatch, id]);

  const handleAddQuestion = () => {
    setQuestions([...questions, { content: "" }]);
  };

  const handleRemoveQuestion = (index) => {
    setQuestions(questions.filter((q, i) => i !== index));
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].content = value;
    setQuestions(newQuestions);
  };

  const convertTo24Hour = (time, meridian) => {
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

  const handleCreateAssignment = async () => {
    const convertedTime = convertTo24Hour(assignmentDueTime, dueMeridian);
    const dueDateTime = `${assignmentDueDate}T${convertedTime}`;

    if (isNaN(new Date(dueDateTime).getTime())) {
      alert("Invalid due date/time provided. Please check your inputs.");
      return;
    }
    if (questions[0].content === "") {
      alert("Please add at least one question.");
      return;
    }

    dispatch(fetchAssignmentsForClassroom(id));

    setOpenCreate(false);
    setAssignmentTitle("");
    setAssignmentDueDate("");
    setAssignmentDueTime("");
    setDueMeridian("AM");
    setAssignmentDescription("");
    setQuestions([{ content: "" }]);
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
      <Divider sx={{ my: 4 }} />
      {assignments && assignments.length !== 0 ? (
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
                    {new Date(assignment.dueDate).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
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
            InputLabelProps={{ shrink: true }}
          />
          <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
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