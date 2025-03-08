import AssignmentModel from "../models/Assignment";
import QuestionModel from "../models/Question";
import AnswerModel from "../models/Answer";
import SubmissionModel from "../models/Submission";
import { Submitted } from "../utils/enums";

export const createSubmission = async (req, res) => {
    try{
        const { assignmentId, studentId, answers } = req.body;
        const assignment = await AssignmentModel
            .findById(assignmentId)
            .populate('questions');

        if(!assignmentId && !studentId && !answers){
            return res.status(400).json({message: "All fields are required",success:false});
        }

        if(!assignment){
            return res.status(404).json({message: "Assignment not found",success:false});
        }

        const questions = assignment.questions;
        if(questions.length !== answers.length){
            return res.status(400).json({message: "Answers count does not match questions count",success:false});
        }

        for(let i = 0; i < questions.length; i++){
            const question = questions[i];
            const questionModel = await QuestionModel
                .findById(question);
            if(!questionModel){
                return res.status(404).json({message: "Question not found",success:false});
            }
        }
        let new_answer=[];
        for(let i = 0; i < answers.length; i++){
            const answer = answers[i];
            const answerModel = new AnswerModel({
                questionId: answer.questionId,
                content: answer.content,
                images: answer.images,
                marksObtained: answer.marksObtained,
                createdBy: studentId
            });
            await answerModel.save();
            new_answer.push(answerModel._id);
        }

        const submission = new SubmissionModel({
            assignmentId: assignmentId,
            studentId: studentId,
            answers: new_answer,
            status: Submitted,
            submittedAt: Date.now()
        });

        await submission.save();
        return res.status(201).json({
            message: true,
            submission
        });

    }catch(error){
        console.log(error);
        return res.status(500).json({message: "Internal server error"});
    }
}

