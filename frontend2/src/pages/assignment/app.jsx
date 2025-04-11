//// filepath: /Users/sridhar/Sridhar/Personal/Acads/6th-sen-frontend-new/src/pages/assignment/app.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  TextField,
  Button,
  Typography,
  IconButton
} from "@mui/material";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { fetchClassroomDetails } from "../../middleware/classroomDetailSlice";
import { fetchAssignmentDetailById } from "../../middleware/assignmentSlice";
import dayjs from "dayjs"; // for date formatting
import { Editor } from "@monaco-editor/react";
import axios from "axios";
import AssignmentSubmission from "../../components/classroomDetailElements/AssignmentSubmission";

const Assignment = () => {
  // Get classroom details and assignment detail from their slices
  const { classroom } = useSelector((state) => state.classroomDetail);
  const { assignment } = useSelector((state) => state.assignment);
  // Retrieve user details from redux store
  const { user } = useSelector((state) => state.user);
  const { assignmentId } = useParams();
  const dispatch = useDispatch();
  const theme = createTheme();

  // Local state for instructor fields
  const [editableDueDate, setEditableDueDate] = useState(assignment?.dueDate || "");
  const [editableQuestions, setEditableQuestions] = useState({});
  const [editDueMeridian, setEditDueMeridian] = useState("AM");
  // Local state for student answers is used only in instructor view if needed; student submission is handled in AssignmentSubmission
  const [studentAnswers, setStudentAnswers] = useState({});
  const [studentAnswerType, setStudentAnswerType] = useState({});
  const [isEditing, setIsEditing] = useState(true);

  useEffect(() => {
    dispatch(fetchAssignmentDetailById(assignmentId));
  }, [assignmentId, dispatch]);

  // Initialize editable state when assignment loads
  useEffect(() => {
    if (assignment) {
      if (assignment.dueDate) {
        setEditableDueDate(dayjs(assignment.dueDate).format("YYYY-MM-DDTHH:mm"));
      }
      if (assignment.questions && assignment.questions.length > 0) {
        const questionsData = {};
        const answerTypeData = {};
        assignment.questions.forEach((q) => {
          questionsData[q._id] = q.content;
          answerTypeData[q._id] = "paragraph";
        });
        setEditableQuestions(questionsData);
        setStudentAnswerType(answerTypeData);
      }
    }
  }, [assignment]);

  const isInstructor =
    classroom && user && classroom.instructor && (classroom.instructor._id === user.id);

  // Handlers for instructor updating assignment
  const handleDueDateChange = (e) => {
    setEditableDueDate(e.target.value);
  };

  const handleQuestionChange = (questionId, newContent) => {
    setEditableQuestions((prev) => ({ ...prev, [questionId]: newContent }));
  };

  const handleRemoveQuestion = (questionId) => {
    setEditableQuestions((prev) => {
      const newState = { ...prev };
      delete newState[questionId];
      return newState;
    });
    setStudentAnswerType((prev) => {
      const newState = { ...prev };
      delete newState[questionId];
      return newState;
    });
  };

  const handleAddQuestion = () => {
    const newKey = `new-${Date.now()}`;
    setEditableQuestions((prev) => ({
      ...prev,
      [newKey]: ""
    }));
    setStudentAnswerType((prev) => ({
      ...prev,
      [newKey]: "paragraph"
    }));
  };

  const handleSave = async () => {
    if (dayjs(editableDueDate).isBefore(dayjs())) {
      alert("Please select a due date and time that is in the future.");
      return;
    }
    const dueDateTime = `${editableDueDate}:00.000Z`;
    const payload = {
      title: assignment.title,
      description: assignment.description,
      dueDate: dueDateTime,
      totalMarks: assignment.totalMarks || 0,
      questions: Object.keys(editableQuestions).map((key) => ({
        content: editableQuestions[key],
        marks: 0
      })),
    };

    try {
      const res = await axios.put(
        `http://localhost:8000/api/assignment/update/${assignmentId}`,
        payload,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      console.log(res.data);
      alert("Assignment updated successfully");
      setIsEditing(false);
      dispatch(fetchAssignmentDetailById(assignmentId));
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  // Handlers for student answering questions in instructor view (if needed)
  const handleAnswerChange = (questionId, answer) => {
    setStudentAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmitAnswers = () => {
    console.log("Student submitted answers:", studentAnswers);
  };

  const handleToggleAnswerType = (questionId, newType) => {
    if (newType !== null) {
      setStudentAnswerType((prev) => ({ ...prev, [questionId]: newType }));
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", flexDirection: "column", p: 4, m: 4 }}>
        {assignment ? (
          <>
            <Box
              sx={{
                backgroundImage: "url('https://gstatic.com/classroom/themes/img_backtoschool.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                p: 2,
                borderRadius: 2,
                mb: 2
              }}
            >
              <Typography variant="h4" sx={{ mb: 2, color: "white" }}>
                {assignment.title}
              </Typography>
              <Typography variant="subtitle1" sx={{ mb: 2, color: "white" }}>
                {assignment.description}
              </Typography>
            </Box>
            {isInstructor ? (
              <Box>
                <Typography variant="h6" sx={{ my: 2 }}>
                  Edit Due Date:
                </Typography>
                <TextField
                  type="datetime-local"
                  value={editableDueDate}
                  onChange={handleDueDateChange}
                  sx={{ mb: 2 }}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: dayjs().format("YYYY-MM-DDTHH:mm") }}
                />
                <Typography variant="h6" sx={{ my: 2 }}>
                  Edit Questions:
                </Typography>
                {Object.keys(editableQuestions).map((key, index) => (
                  <Box key={key} sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                    <TextField
                      label={`Question ${index + 1}`}
                      value={editableQuestions[key] || ""}
                      onChange={(e) => handleQuestionChange(key, e.target.value)}
                      multiline
                      fullWidth
                    />
                    <IconButton onClick={() => handleRemoveQuestion(key)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Box>
                ))}
                <div>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleAddQuestion}
                    sx={{ mx: 2 }}
                  >
                    Add Question
                  </Button>
                  <Button variant="contained" color="primary" onClick={handleSave}>
                    Save Changes
                  </Button>
                </div>
              </Box>
            ) : (
              <Box>
                <Typography variant="h6" sx={{ my: 2 }}>
                  Due Date: {dayjs(assignment.dueDate).format("DD MMM YYYY, HH:mm")}
                </Typography>
                <AssignmentSubmission 
                  assignmentId={assignmentId} 
                  dueDate={assignment.dueDate} 
                  assignment={assignment} 
                  classroomId={classroom.classroomCode}
                />
              </Box>
            )}
          </>
        ) : (
          <Typography>Loading assignment...</Typography>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default Assignment;