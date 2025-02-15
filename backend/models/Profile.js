import mongoose from 'mongoose'
import { Female, Male, Other } from '../utils/enums'

const profileSchema = new mongoose.Schema({
    gender:{
        type: String,
        required: true,
        trim: true,
        enum: [Male,Female,Other]
    },
    dob:{
        type: Date,
        required: true,
    },
    about:{
        type: String,
        trim: true,
        maxlength: 200
    },
    contactNumber:{
        type: String,
        trim: true,
        minlength: 10,
        maxlength: 10
    }
}, {timestamps: true});

export default mongoose.model('Profile', profileSchema);