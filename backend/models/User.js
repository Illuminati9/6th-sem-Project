import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
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
    classrooms:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Classroom'
        }
    ],
    additionalDetails:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    },
}, {timestamps: true});

export default mongoose.model('User', userSchema);
