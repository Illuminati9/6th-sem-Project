import express from 'express';
import { createClassroom,getAllClassrooms,getClassroom,getUserDataByClassroomCode,joinClassroom } from '../controllers/classroomController.js';
import authenticateUser from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create', authenticateUser, createClassroom);
router.post('/join/:classroomCode', authenticateUser, joinClassroom);
router.get('/info/:classroomCode',authenticateUser,getClassroom);

router.get('/getAll',authenticateUser,getAllClassrooms);
router.get('/get/:classroomCode',authenticateUser,getClassroom);
router.get('/getUserDataByCode/:classroomCode',authenticateUser,getUserDataByClassroomCode);

export default router;