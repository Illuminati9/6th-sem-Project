const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

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

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ msg: "User Not Found" });
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
        res.status(200).json({ msg: 'OTP sent to email' });

    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
    
};


exports.resetPassword= async (req,res) => {
    try {
        const {email, otp, password}= req.body;
        const user = await User.findOne({email});

        if(!user || user.otp!= otp){
            return res.status(400).json({ msg: "invalid or expired opt" });
        }

        const salt = await bcrypt.genSalt(10);
        user.password= await bcrypt.hash(password,salt);

        user.otp=null;
        user.otpExpires=null;
        await user.save();

        res.status(200).json({ msg: 'success' });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
    
}

exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({ username, email, password });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

        res.status(201).json({
            message: 'User created successfully',
            token
        });

    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
    
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ msg: 'Please enter all fields' });
        }

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'User does not exist' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

        res.status(200).json({
            message: 'User logged in successfully',
            token
        });

    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
