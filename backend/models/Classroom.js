import mongoose from "mongoose";

const classroomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    section:{
        type: String,
        trim: true,
    },
    roomNo: {
        type: String,
        trim: true,
    },
    subject:{
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    students: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    assistants:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    classroomCode:{
        type: String,
        required: true,
        unique: true,
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

export default mongoose.model("Classroom", classroomSchema);