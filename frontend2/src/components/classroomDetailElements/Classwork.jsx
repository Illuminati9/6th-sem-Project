import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  createAssignment,
  fetchAssignmentsForClassroom,
} from "../../middleware/assignmentSlice";
import { fetchClassroomDetails } from "../../middleware/classroomDetailSlice";

const Classwork = ({ id }) => {
  const dispatch = useDispatch();
  const { assignments, loading, error } = useSelector(
    (state) => state.assignment
  );
  const userId = localStorage.getItem("id");
  const instructorId = localStorage.getItem("classroomInstructor");

  const [openCreate, setOpenCreate] = useState(false);
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [assignmentDueDate, setAssignmentDueDate] = useState("");
  const [assignmentDueTime, setAssignmentDueTime] = useState("");
  const [assignmentDescription, setAssignmentDescription] = useState("");
  const [questions, setQuestions] = useState([
    { content: "", image: null, imagePreview: null },
  ]);

  useEffect(() => {
    dispatch(fetchAssignmentsForClassroom(id));
  }, [dispatch, id]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { content: "", image: null, imagePreview: null },
    ]);
  };

  const handleRemoveQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].content = value;
    setQuestions(newQuestions);
  };

  const handleImageUpload = (index, file) => {
    const newQuestions = [...questions];
    newQuestions[index].image = file;
    newQuestions[index].imagePreview = URL.createObjectURL(file);
    setQuestions(newQuestions);
  };

  const handleRemoveImage = (index) => {
    const newQuestions = [...questions];
    newQuestions[index].image = null;
    if (newQuestions[index].imagePreview) {
      URL.revokeObjectURL(newQuestions[index].imagePreview);
    }
    newQuestions[index].imagePreview = null;
    setQuestions(newQuestions);
  };

  const handleCreateAssignment = async () => {
    const dueDateTime = `${assignmentDueDate}T${assignmentDueTime}`;

    if (isNaN(new Date(dueDateTime).getTime())) {
      alert("Invalid due date/time provided. Please check your inputs.");
      return;
    }
    if (questions[0].content.trim() === "") {
      alert("Please add at least one Question content.");
      return;
    }
    await dispatch(
      createAssignment({
        classroomCode: id,
        assignmentData: {
          title: assignmentTitle,
          dueDate: dueDateTime,
          description: assignmentDescription,
          questions: questions.map(({ content, image }) => ({
            content,
            image,
          })),
        },
      })
    );
    await dispatch(fetchAssignmentsForClassroom(id));
    await dispatch(fetchClassroomDetails(id));

    setOpenCreate(false);
    setAssignmentTitle("");
    setAssignmentDueDate("");
    setAssignmentDueTime("");
    setAssignmentDescription("");
    questions.forEach((q) => {
      if (q.imagePreview) URL.revokeObjectURL(q.imagePreview);
    });
    setQuestions([{ content: "", image: null, imagePreview: null }]);
  };

  if (loading) return <Typography>Loading assignments...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>
        Classwork Assignments
      </Typography>
      {userId === instructorId && (
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

      <Dialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        fullWidth
        maxWidth="sm"
      >
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
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Due Date"
            type="date"
            fullWidth
            value={assignmentDueDate}
            onChange={(e) => setAssignmentDueDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Due Time"
            type="time"
            fullWidth
            value={assignmentDueTime}
            onChange={(e) => setAssignmentDueTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={10}
            value={assignmentDescription}
            onChange={(e) => setAssignmentDescription(e.target.value)}
            sx={{ mb: 3 }}
          />
          <Typography variant="subtitle1" mb={2}>
            Questions
          </Typography>
          {questions.map((ques, index) => (
            <Box key={index} width="100%" mb={3}>
              <TextField
                label={`Question ${index + 1}`}
                type="text"
                fullWidth
                multiline
                rows={8}
                value={ques.content}
                onChange={(e) => handleQuestionChange(index, e.target.value)}
                margin="dense"
              />
              <Button
                variant="outlined"
                component="label"
                size="small"
                sx={{ mt: 1 }}
              >
                {ques.image ? "Change Image" : "Upload Image"}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => handleImageUpload(index, e.target.files[0])}
                />
              </Button>
              {ques.imagePreview && (
                <Box
                  mt={1}
                  display="flex"
                  alignItems="center"
                  gap={1}
                  sx={{ position: "relative" }}
                >
                  <img
                    src={ques.imagePreview}
                    alt={`Question ${index + 1}`}
                    style={{
                      maxWidth: "100px",
                      maxHeight: "100px",
                      borderRadius: 4,
                      border: "1px solid #ccc",
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveImage(index)}
                    sx={{ color: "red" }}
                  >
                    <RemoveCircleIcon />
                  </IconButton>
                </Box>
              )}
              <IconButton
                onClick={() => handleRemoveQuestion(index)}
                sx={{ mt: 1 }}
                aria-label="remove question"
              >
                <RemoveCircleIcon color="error" />
              </IconButton>
            </Box>
          ))}
          <Button onClick={handleAddQuestion} variant="outlined" sx={{ mb: 2 }}>
            Add Question
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)}>Cancel</Button>
          <Button
            onClick={handleCreateAssignment}
            variant="contained"
            color="primary"
          >
            Create Assignment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Classwork;
