import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        // required: true,
        trim: true,
    },
    dueDate: {
        type: Date,
        // required: true,
    },
    totalMarks: {
        type: Number,
        // required: true,
    },
    classroomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Classroom",
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    questions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Question",
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

export default mongoose.model("Assignment", assignmentSchema);