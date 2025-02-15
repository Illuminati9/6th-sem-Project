import express from 'express';
import { signup, login, resetPassword, forgotPassword } from '../controllers/authController.js';
import authenticateUser from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/resetPassword',authenticateUser,resetPassword);
router.post('/forgotPassword',forgotPassword);
// router.get('/me',authenticateUser,getUserDetails)

export default router;
// module.exports = router;