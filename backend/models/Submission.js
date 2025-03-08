import mongoose from "mongoose";
import { Late, Pending, Submitted } from "../utils/enums";

const submissionSchema = new mongoose.Schema({
    assignmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Assignment",
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    marksObtained: {
        type: Number,
    },
    answers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Answer",
        },
    ],
    resubmissionCount:{
        type: Number,
        default: 0,
    },
    status:{
        type: String,
        enum: [Pending, Submitted, Late],
        default: Late,
    },
    submittedAt: {
        type: Date,
        default: Date.now(),
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

export default mongoose.model("Submission", submissionSchema);