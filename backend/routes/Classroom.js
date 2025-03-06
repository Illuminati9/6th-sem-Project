import express from 'express';
import { createClassroom,deleteClassroom,exitClassroom,getAllClassrooms,getClassroom,getUserDataByClassroomCode,joinClassroom, updateAssistants, updateClassroom } from '../controllers/Classroom.js';
import authenticateUser from '../middleware/authMiddleware.js';

const router = express.Router();

//! POST
router.post('/create', authenticateUser, createClassroom);
router.post('/join/:classroomCode', authenticateUser, joinClassroom);

//! GET
router.get('/info/:classroomCode',authenticateUser,getClassroom);
router.get('/getAll',authenticateUser,getAllClassrooms);
router.get('/get/:classroomCode',authenticateUser,getClassroom);
router.get('/getUserDataByCode/:classroomCode',authenticateUser,getUserDataByClassroomCode);

//! PUT 
router.put('/updateClassroom/:classroomCode',authenticateUser,updateClassroom);    

//! DELETE
router.delete('/deleteClassroom/:classroomCode',authenticateUser,deleteClassroom);
router.delete('/exitClassroom/:classroomCode',authenticateUser,exitClassroom);

//! Assistants
router.put('/addAssistant/:classroomCode',authenticateUser,updateAssistants);

export default router;