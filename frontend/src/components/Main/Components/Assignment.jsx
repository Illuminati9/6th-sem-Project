import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Card, CardContent, Typography, Divider, Button, TextField, IconButton, Grid, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import axios from "axios";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import Drawer from "../../Drawer/drawer";

const AssignmentDetail = () => {
  const { assignmentId } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const userId = localStorage.getItem("id");
  const classroomInstructor = localStorage.getItem("classroomInstructor");

  // State for edit mode (instructor) and submission (student)
  const [isEditing, setIsEditing] = useState(false);
  
  // Edit form state
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [editDueTime, setEditDueTime] = useState("");
  const [editDueMeridian, setEditDueMeridian] = useState("AM");
  const [editQuestions, setEditQuestions] = useState([]);
  
  // Submission state for student answers
  // Each answer: { questionId, content, image }
  const [answers, setAnswers] = useState([]);

  const fetchAssignment = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/assignment/get/${assignmentId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAssignment(res.data.data);
      
      // Initialize edit form values from fetched assignment
      setEditTitle(res.data.data.title);
      setEditDescription(res.data.data.description);
      // Split the dueDate into date and time components
      const due = new Date(res.data.data.dueDate);
      const dateStr = due.toISOString().split("T")[0];
      let hours = due.getHours();
      const minutes = due.getMinutes().toString().padStart(2, "0");
      const meridian = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      if (hours === 0) hours = 12;
      const timeStr = `${hours.toString().padStart(2, "0")}:${minutes}`;
      setEditDueDate(dateStr);
      setEditDueTime(timeStr);
      setEditDueMeridian(meridian);
      
      // Assume assignment.questions is an array of question objects { _id, content }
      setEditQuestions(res.data.data.questions || []);
      
      // Initialize the submission answers for student mode
      setAnswers((res.data.data.questions || []).map(q => ({ questionId: q._id, content: "", image: null })));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch assignment");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignment();
  }, [assignmentId]);

  // Helper: convert 12-hour time (e.g. "09:30" with AM/PM) to 24-hour format
  const convertTo24Hour = (time, meridian) => {
    if (!time) return "";
    const [hourStr, minute] = time.split(":");
    let hour = parseInt(hourStr, 10);
    if (meridian === "AM") {
      if (hour === 12) hour = 0;
    } else {
      if (hour !== 12) hour += 12;
    }
    return `${hour.toString().padStart(2, "0")}:${minute}`;
  };

  // ----- Instructor: Edit Assignment Handlers -----
  const handleUpdateAssignment = async () => {
    const time24 = convertTo24Hour(editDueTime, editDueMeridian);
    const dueDateTime = `${editDueDate}T${time24}`;
    const payload = {
      title: editTitle,
      description: editDescription,
      dueDate: dueDateTime,
      questions: editQuestions, // Expecting an array of objects with at least a "content" field
    };

    try {
      const res = await axios.put(`http://localhost:8000/api/assignment/update/${assignmentId}`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("Assignment updated successfully");
      setIsEditing(false);
      fetchAssignment();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  // Handlers for dynamic question fields in edit mode
  const handleAddEditQuestion = () => {
    setEditQuestions([...editQuestions, { content: "" }]);
  };

  const handleRemoveEditQuestion = (index) => {
    const qs = editQuestions.filter((q, i) => i !== index);
    setEditQuestions(qs);
  };

  const handleEditQuestionChange = (index, value) => {
    const qs = [...editQuestions];
    qs[index].content = value;
    setEditQuestions(qs);
  };

  // ----- Student: Submission Handlers -----
  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index].content = value;
    setAnswers(newAnswers);
  };

  const handleImageChange = (index, file) => {
    const newAnswers = [...answers];
    newAnswers[index].image = file;
    setAnswers(newAnswers);
  };

  const handleSubmitAssignment = async () => {
    const payload = {
      classroomId: assignment.classroomId,
      assignmentId: assignment._id,
      studentId: userId,
      answers: answers, // Each answer should include questionId, content, and optional image (file object)
    };

    try {
      const res = await axios.post("http://localhost:8000/api/submission/create", payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("Submission successful!");
    } catch (err) {
      alert(err.response?.data?.message || "Submission failed");
    }
  };

  if (loading) return <Typography>Loading assignment...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!assignment) return <Typography>No assignment found</Typography>;

  // Determine if the user is the instructor (or has instructor role)
  // Here we check against the classroom instructor saved in localStorage.
  const isInstructor = userId === classroomInstructor;

  return (
    <div>
    <Drawer />
    <Box p={2}>
      <Card>
        <CardContent>
          {/* Display mode: if editing (instructor) show edit form; otherwise, display detail */}
          {isInstructor && isEditing ? (
              <>
              <TextField
                fullWidth
                label="Assignment Title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                margin="dense"
                />
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                margin="dense"
                />
              <TextField
                fullWidth
                type="date"
                label="Due Date"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
                margin="dense"
                InputLabelProps={{ shrink: true }}
                />
              <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                <TextField
                  fullWidth
                  type="time"
                  label="Due Time"
                  value={editDueTime}
                  onChange={(e) => setEditDueTime(e.target.value)}
                  margin="dense"
                  InputLabelProps={{ shrink: true }}
                  />
                <FormControl sx={{ minWidth: 80 }} margin="dense">
                  <InputLabel id="edit-meridian-label" shrink>
                    AM/PM
                  </InputLabel>
                  <Select
                    labelId="edit-meridian-label"
                    value={editDueMeridian}
                    onChange={(e) => setEditDueMeridian(e.target.value)}
                    label="AM/PM"
                    >
                    <MenuItem value="AM">AM</MenuItem>
                    <MenuItem value="PM">PM</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box mt={2}>
                <Typography variant="h6">Questions</Typography>
                {editQuestions.map((q, index) => (
                    <Box key={index} display="flex" alignItems="center" mt={1}>
                    <TextField
                      fullWidth
                      label={`Question ${index + 1}`}
                      value={q.content}
                      onChange={(e) => handleEditQuestionChange(index, e.target.value)}
                      margin="dense"
                      />
                    <IconButton onClick={() => handleRemoveEditQuestion(index)}>
                      <RemoveCircleIcon color="error" />
                    </IconButton>
                  </Box>
                ))}
                <Button variant="outlined" sx={{ mt: 1 }} onClick={handleAddEditQuestion}>
                  Add Question
                </Button>
              </Box>
            </>
          ) : (
              <>
              <Typography variant="h4" gutterBottom>{assignment.title}</Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Due: {new Date(assignment.dueDate).toLocaleDateString()}{" "}
                {new Date(assignment.dueDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body1" mb={2}>{assignment.description}</Typography>
              {assignment.questions && assignment.questions.length > 0 && (
                  <Box mb={2}>
                  <Typography variant="h6">Questions</Typography>
                  {assignment.questions.map((q, index) => (
                      <Box key={q._id} mt={1}>
                      <Typography variant="body1">
                        {index + 1}. {q.content}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </>
          )}
        </CardContent>
      </Card>
      <Box mt={2}>
        {isInstructor ? (
            <>
            {isEditing ? (
                <>
                <Button variant="contained" color="primary" onClick={handleUpdateAssignment}>
                  Save Changes
                </Button>
                <Button variant="outlined" sx={{ ml: 2 }} onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </>
            ) : (
                <Button variant="contained" color="secondary" onClick={() => setIsEditing(true)}>
                Edit Assignment
              </Button>
            )}
          </>
        ) : (
            // Student Submission Form
            <Box>
            <Typography variant="h6" mt={2}>Your Submission</Typography>
            {answers.map((ans, index) => (
                <Box key={index} mt={2}>
                <Typography>
                  Question {index + 1}: {assignment.questions[index].content}
                </Typography>
                <TextField
                  fullWidth
                  label="Your Answer"
                  value={ans.content}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  margin="dense"
                  />
                <Button variant="outlined" component="label" sx={{ mt: 1 }}>
                  Upload Image
                  <input
                    type="file"
                    hidden
                    onChange={(e) => handleImageChange(index, e.target.files[0])}
                    />
                </Button>
                {ans.image && (
                    <Typography variant="caption">
                    Image selected: {ans.image.name}
                  </Typography>
                )}
              </Box>
            ))}
            <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleSubmitAssignment}>
              Submit Assignment
            </Button>
          </Box>
        )}
      </Box>
    </Box>
        </div>
  );
};

export default AssignmentDetail;