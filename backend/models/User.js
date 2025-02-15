import mongoose from "mongoose";
import {hashPasswordMiddleware} from "../middleware/hashPassword.js";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 5
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
    },
    password:{
        type: String,
        required: true,
        minlength: 6
    },
    additionalDetails:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    },
}, {timestamps: true});

export default mongoose.model('User', userSchema);
