import express from 'express';
import { signup, login, resetPassword, forgotPassword } from '../controllers/Auth.js';
import authenticateUser from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/resetPassword',authenticateUser,resetPassword);
router.post('/forgotPassword',forgotPassword);
router.get('/verify',authenticateUser,async(req,res)=>{
    res.status(200).json({
        success:true,
        user:req.user
    })
});

export default router;