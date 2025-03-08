import dotenv from 'dotenv';
import express from 'express';
import dbConnect from './config/database.js';
import authRoutes from './routes/Auth.js';
import classroomRoutes from './routes/Classroom.js';
import assignmentRoutes from './routes/Assignment.js';
import commentRoutes from './routes/Comment.js';
import submissionRoutes from './routes/Submission.js';
import cors from 'cors';

dotenv.config();
dbConnect();
const PORT = process.env.PORT || 8000;
const app = express();

app.use(cors({
    origin: "http://localhost:5173", 
    methods: "GET, POST, PUT, DELETE", 
    credentials: true,
  }));
  
app.use(express.json());

// const authRoutes = require('./routes/authRoutes');  
app.use('/api/auth/', authRoutes);
app.use('/api/classroom/', classroomRoutes);
app.use('/api/assignment/', assignmentRoutes);
app.use('/api/comment/', commentRoutes);
app.use('/api/submission/', submissionRoutes);

app.listen(PORT, () => {
    console.log(`App is running at ${PORT}`);
});
