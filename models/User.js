const { default: mongoose } = require("mongoose");
const hashPasswordMiddleware = require("../middleware/hashPassword");
const bcrypt = require("bcryptjs");

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
    otp:{
        type:String,
        default: null,
    },
    otpExpires:{
        type: Date,
        default:null
    }
}, {timestamps: true});

// userSchema.pre("save", hashPasswordMiddleware);

module.exports = mongoose.model('User', userSchema);