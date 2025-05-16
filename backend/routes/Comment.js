import express from 'express';
import authenticateUser from '../middleware/authMiddleware.js';
import { createComment, getComments } from '../controllers/Comment.js';

const router = express.Router();

router.post('/create',authenticateUser,createComment);

router.post('/get',authenticateUser,getComments);

export default router;