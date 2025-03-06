import express from 'express';
import { createAssignment, deleteAssignment, getAllAssignments, getAssignment, updateAssignment } from '../controllers/Assignment.js';
import authenticateUser from '../middleware/authMiddleware.js';

const router = express.Router();

//! POST
router.post('/create/:classroomCode', authenticateUser, createAssignment);

//! GET
router.get('/get/:assignmentId', authenticateUser, getAssignment);
router.get('/getAll/:classroomCode', authenticateUser, getAllAssignments);

//! PUT
router.put('/update/:assignmentId', authenticateUser, updateAssignment);

//! DELETE
router.delete('/delete/:assignmentId', authenticateUser, deleteAssignment);

export default router;