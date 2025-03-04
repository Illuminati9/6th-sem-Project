import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }

        const otp = generateOTP();
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000;
        await user.save();

        const mailOptions = {
            from: 'Roopesh@gmail.com',
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset is: ${otp}. It expires in 10 minutes.`
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'OTP sent to email',success: true });

    } catch (error) {
        res.status(500).json({ message: error.message, success: false});
    }
    
};


export const resetPassword= async (req,res) => {
    try {
        const {email, otp, password}= req.body;
        const user = await User.findOne({email});

        if(!user || user.otp!= otp){
            return res.status(400).json({ message: "invalid or expired opt",success: false });
        }

        const salt = await bcrypt.genSalt(10);
        user.password= await bcrypt.hash(password,salt);

        user.otp=null;
        user.otpExpires=null;
        await user.save();

        res.status(200).json({ message: 'success',success: true });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false});
    }
    
}

export const signup = async (req, res) => {
    try {
        let { username, name, email, password } = req.body;

        if(!username || !name || !email || !password){
            return res.status(400).json({ message: 'Please enter all fields',success: false });
        }

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' , success: false});
        }

        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);

        user = new User({ username, name, email, password });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

        res.status(201).json({
            message: 'User created successfully',
            token,
            success: true
        });

    } catch (error) {
        res.status(500).json({ message: error.message, success: false});
    }
    
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please enter all fields', success: false });
        }

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User does not exist' , success: false});
        }

        const isMatch = await bcrypt.compare(password,user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' , success: false});
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

        res.status(200).json({
            message: 'User logged in successfully',
            token,
            success: true
        });

    } catch (error) {
        res.status(500).json({ message: error.message , success: false});
    }
};


