import express from 'express';
import authenticateUser from '../middleware/authMiddleware.js';
import { createSubmission, getSubmission, getSubmissionById, updateSubmission } from '../controllers/Submission.js';

const router = express.Router();

router.post('/createSubmission', authenticateUser, createSubmission);
router.get('/getSubmissions/:assignmentId', authenticateUser, getSubmission);
router.get('/getSubmission/:id', authenticateUser, getSubmissionById);
router.put('/updateSubmission/:id', authenticateUser, updateSubmission);

export default router;