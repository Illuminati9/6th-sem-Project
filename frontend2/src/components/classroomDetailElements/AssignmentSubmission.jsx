//// filepath: /Users/sridhar/Sridhar/Personal/Acads/6th-sen-frontend-new/src/components/classroomDetailElements/AssignmentSubmission.jsx
import React, { useEffect, useState } from "react";
import { Box, Typography, Button, TextField } from "@mui/material";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { Editor } from "@monaco-editor/react";
import axios from "axios";
import dayjs from "dayjs";
import { useSelector } from "react-redux";

const AssignmentSubmission = ({ assignmentId, dueDate, assignment, classroomId }) => {
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Local state for the submission form
  const [studentAnswers, setStudentAnswers] = useState({});
  const [studentAnswerType, setStudentAnswerType] = useState({});

  // Get current user from redux (for studentId)
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchSubmissionStatus = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/submission/getSubmissions/${assignmentId}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        console.log(res.data);
        if (res.data.success) {
          setSubmission(res.data.submission); // submission is null if not yet submitted
        } else {
          setError(res.data.message);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching submission status");
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissionStatus();
  }, [assignmentId]);

  // Initialize answer types for each question when assignment data is available
  useEffect(() => {
    if (assignment && assignment.questions) {
      const answerTypeData = {};
      assignment.questions.forEach((q) => {
        answerTypeData[q._id] = "paragraph";
      });
      setStudentAnswerType(answerTypeData);
    }
  }, [assignment]);

  const handleAnswerChange = (questionId, answer) => {
    setStudentAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleToggleAnswerType = (questionId, newType) => {
    if (newType !== null) {
      setStudentAnswerType((prev) => ({ ...prev, [questionId]: newType }));
    }
  };

  const handleFormSubmit = async () => {
    // Create an array of answer objects from studentAnswers
    const formattedAnswers = Object.keys(studentAnswers).map((qId) => ({
      questionId: qId,
      content: studentAnswers[qId],
      images: [],
      marksObtained: 0
    }));

    try {
      const payload = {
        classroomCode: classroomId,
        assignmentId,
        studentId: user.id,
        answers: formattedAnswers
      };
      const res = await axios.post(
        `http://localhost:8000/api/submission/createSubmission`,
        payload,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      if (res.data.success) {
        alert("Assignment submitted successfully.");
        setSubmission(res.data.submission);
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  if (loading) {
    return <Typography>Loading submission status...</Typography>;
  }

  const deadlinePassed = dayjs().isAfter(dayjs(dueDate));

  if (submission) {
    return (
      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>Submission Details</Typography>
        <Typography variant="body1">
          Submitted on: {dayjs(submission.submissionTime).format("DD MMM YYYY, HH:mm")}
        </Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>Your Answers:</Typography>
        {submission.answers &&
          submission.answers.map((ans, idx) => (
            <Box key={idx} sx={{ border: "1px solid #ccc", p: 1, my: 1 }}>
              <Typography variant="subtitle1">Question {idx + 1}:</Typography>
              <Typography variant="body2">{ans.content}</Typography>
            </Box>
          ))}
      </Box>
    );
  } else if (deadlinePassed) {
    return (
      <Typography variant="h6" color="error">
        The submission deadline has passed. You no longer have access to submit the assignment.
      </Typography>
    );
  } else {
   
    return (
      <Box>
        <Typography variant="h6" sx={{ my: 2 }}>
          Submit Your Assignment
        </Typography>
        {assignment && assignment.questions && assignment.questions.map((q, index) => (
          <Box key={q._id} sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              {`Question ${index + 1}:`}
            </Typography>
            <Typography variant="subtitle1">{q.content}</Typography>
            <ToggleButtonGroup
              color="primary"
              value={studentAnswerType[q._id]}
              exclusive
              onChange={(e, newType) => handleToggleAnswerType(q._id, newType)}
              size="small"
              sx={{ my: 1 }}
            >
              <ToggleButton value="paragraph">Paragraph</ToggleButton>
              <ToggleButton value="code">Code</ToggleButton>
            </ToggleButtonGroup>
            {studentAnswerType[q._id] === "code" ? (
              <Editor
                height="40vh"
                defaultLanguage="cpp"
                defaultValue="//Your Code goes here"
                value={studentAnswers[q._id] || ""}
                onChange={(value) => handleAnswerChange(q._id, value)}
              />
            ) : (
              <TextField
                label="Your Paragraph Answer"
                value={studentAnswers[q._id] || ""}
                onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                multiline
                fullWidth
              />
            )}
          </Box>
        ))}
        <Button variant="contained" color="primary" onClick={handleFormSubmit}>
          Submit Answers
        </Button>
      </Box>
    );
  }
};

export default AssignmentSubmission;