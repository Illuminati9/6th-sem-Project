import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
    },
    assignmentId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Assignment",
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },
    images:[
        {
            type: String,
        },
    ],
    marksObtained: {
        type: Number,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

export default mongoose.model("Answer", answerSchema);