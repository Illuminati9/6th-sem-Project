import express from 'express';
import authenticateUser from '../middleware/authMiddleware';
import { createSubmission } from '../controllers/Submission';

const router = express.Router();

router.post('/submit', authenticateUser, createSubmission);

export default router;