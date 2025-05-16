import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Button,
  TextField,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import axios from "axios";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import Drawer from "../../Drawer/drawer";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const AssignmentDetail = () => {
  const { assignmentId } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const userId = localStorage.getItem("id");
  const classroomInstructor = localStorage.getItem("classroomInstructor");
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [editDueHour, setEditDueHour] = useState("07");
  const [editDueMinute, setEditDueMinute] = useState("00");
  const [editDueMeridian, setEditDueMeridian] = useState("AM");
  const [editQuestions, setEditQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [isPastDueDate, setIsPastDueDate] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  const fetchAssignment = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/assignment/get/${assignmentId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const assignmentData = res.data.data;
      setAssignment(assignmentData);
      setEditTitle(assignmentData.title);
      setEditDescription(assignmentData.description);
      const due = new Date(assignmentData.dueDate);
      const dateStr = due.toISOString().split("T")[0];
      let hours = due.getHours();
      const minutes = due.getMinutes().toString().padStart(2, "0");
      const meridian = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      if (hours === 0) hours = 12;
      setEditDueDate(dateStr);
      setEditDueHour(hours.toString().padStart(2, "0"));
      setEditDueMinute(minutes);
      setEditDueMeridian(meridian);
      setEditQuestions(assignmentData.questions || []);
      setAnswers((assignmentData.questions || []).map((q) => ({ questionId: q._id, content: "", image: null })));
      const now = new Date();
      setIsPastDueDate(now > due);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch assignment");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignment();
  }, [assignmentId]);

  const convertTo24Hour = (hourStr, minute, meridian) => {
    if (!hourStr || !minute) return "";
    let hour = parseInt(hourStr, 10);
    if (meridian === "AM") {
      if (hour === 12) hour = 0;
    } else {
      if (hour !== 12) hour += 12;
    }
    return `${hour.toString().padStart(2, "0")}:${minute}`;
  };

  const handleUpdateAssignment = async () => {
    const time24 = convertTo24Hour(editDueHour, editDueMinute, editDueMeridian);
    const dueDateTime = `${editDueDate}T${time24}`;
    const payload = {
      title: editTitle,
      description: editDescription,
      dueDate: dueDateTime,
      questions: editQuestions,
    };
    try {
      await axios.put(`http://localhost:8000/api/assignment/update/${assignmentId}`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setSnackbar({ open: true, message: "Assignment updated successfully", severity: "success" });
      setIsEditing(false);
      fetchAssignment();
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.message || "Update failed", severity: "error" });
    }
  };

  const handleAddEditQuestion = () => {
    setEditQuestions([...editQuestions, { content: "" }]);
  };

  const handleRemoveEditQuestion = (index) => {
    const qs = editQuestions.filter((_, i) => i !== index);
    setEditQuestions(qs);
  };

  const handleEditQuestionChange = (index, value) => {
    const qs = [...editQuestions];
    qs[index].content = value;
    setEditQuestions(qs);
  };

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
    if (isPastDueDate) {
      setSnackbar({ open: true, message: "This assignment is past its due date and cannot be submitted.", severity: "warning" });
      return;
    }
    const anyEmpty = answers.some(a => !a.content.trim());
    if (anyEmpty) {
      setSnackbar({ open: true, message: "Please fill out all answers before submitting.", severity: "error" });
      return;
    }
    const formData = new FormData();
    formData.append("classroomId", assignment.classroomId);
    formData.append("assignmentId", assignment._id);
    formData.append("studentId", userId);
    answers.forEach((ans, i) => {
      formData.append(`answers[${i}][questionId]`, ans.questionId);
      formData.append(`answers[${i}][content]`, ans.content);
      if (ans.image) formData.append(`answers[${i}][image]`, ans.image);
    });
    try {
      await axios.post("http://localhost:8000/api/submission/create", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setSnackbar({ open: true, message: "Submission successful!", severity: "success" });
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.message || "Submission failed", severity: "error" });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={5}><CircularProgress /></Box>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!assignment) return <Typography>No assignment found</Typography>;

  const isInstructor = userId === classroomInstructor;
  const hourOptions = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, "0"));
  const minuteOptions = ["00", "15", "30", "45"];

  return (
    <div>
      <Drawer />
      <Box p={2}>
        <Card>
          <CardContent>
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
                  minRows={8} // made description box bigger here
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
                <Box
                  sx={{ display: "flex", gap: 1, mt: 1, alignItems: "center" }}
                >
                  <FormControl sx={{ minWidth: 80 }}>
                    <InputLabel id="edit-hour-label" shrink>
                      Hour
                    </InputLabel>
                    <Select
                      labelId="edit-hour-label"
                      value={editDueHour}
                      onChange={(e) => setEditDueHour(e.target.value)}
                      label="Hour"
                    >
                      {hourOptions.map((h) => (
                        <MenuItem key={h} value={h}>
                          {h}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl sx={{ minWidth: 80 }}>
                    <InputLabel id="edit-minute-label" shrink>
                      Minute
                    </InputLabel>
                    <Select
                      labelId="edit-minute-label"
                      value={editDueMinute}
                      onChange={(e) => setEditDueMinute(e.target.value)}
                      label="Minute"
                    >
                      {minuteOptions.map((m) => (
                        <MenuItem key={m} value={m}>
                          {m}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl sx={{ minWidth: 80 }}>
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
                        onChange={(e) =>
                          handleEditQuestionChange(index, e.target.value)
                        }
                        margin="dense"
                      />
                      <IconButton
                        onClick={() => handleRemoveEditQuestion(index)}
                      >
                        <RemoveCircleIcon color="error" />
                      </IconButton>
                    </Box>
                  ))}
                  <Button
                    variant="outlined"
                    sx={{ mt: 1 }}
                    onClick={handleAddEditQuestion}
                  >
                    Add Question
                  </Button>
                </Box>
              </>
            ) : (
              <>
                <Typography variant="h4" gutterBottom>
                  {assignment.title}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  Due: {new Date(assignment.dueDate).toLocaleDateString()}{" "}
                  {new Date(assignment.dueDate).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body1" mb={2}>
                  {assignment.description}
                </Typography>
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
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpdateAssignment}
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{ ml: 2 }}
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Assignment
                </Button>
              )}
            </>
          ) : (
            <Box>
              <Typography variant="h6" mt={2}>
                Your Submission
              </Typography>
              {answers.map((ans, index) => (
                <Box key={index} mt={2}>
                  <Typography>
                    Question {index + 1}: {assignment.questions[index].content}
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    minRows={6}
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
                      onChange={(e) =>
                        handleImageChange(index, e.target.files[0])
                      }
                    />
                  </Button>
                  {ans.image && (
                    <Typography variant="body2" color="textSecondary">
                      Selected file: {ans.image.name}
                    </Typography>
                  )}
                </Box>
              ))}
              <Button
                variant="contained"
                sx={{ mt: 3 }}
                onClick={handleSubmitAssignment}
              >
                Submit Assignment
              </Button>
            </Box>
          )}
        </Box>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AssignmentDetail;
