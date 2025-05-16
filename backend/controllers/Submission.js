import AssignmentModel from "../models/Assignment.js";
import QuestionModel from "../models/Question.js";
import AnswerModel from "../models/Answer.js";
import SubmissionModel from "../models/Submission.js";
import { Submitted } from "../utils/enums.js";
import ClassroomModel from "../models/Classroom.js";

export const createSubmission = async (req, res) => {
    try{
        const { classroomCode, assignmentId, studentId, answers } = req.body;
        console.log(classroomCode, assignmentId, studentId, answers);
        const {id}= req.user;
        const assignment = await AssignmentModel
            .findById(assignmentId)
            .populate('questions');
        if(!classroomCode||!assignmentId || !studentId || !answers){
            return res.status(400).json({message: "All fields are required",success:false});
        }

        const classroom = await ClassroomModel.findOne({classroomCode});
        if(!classroom){
            return res.status(404).json({message: "Classroom not found",success:false});
        }
        console.log(classroom);
        if(!classroom.students.some(studentId => studentId.toString() === id.toString())||id.toString()===classroom.instructor.toString()){
            return res.status(403).json({message: "You are not allowed to submit assignment",success:false});
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

export const getSubmission = async(req,res)=>{
    try {
        const {assignmentId} = req.params;
        const {id} = req.user;

        if(!assignmentId|| !id){
            return res.status(400).json({message: "All fields are required",success:false});
        }

        const submission = await SubmissionModel.findOne({assignmentId,studentId:id}).populate('answers');
        console.log(submission);
        if(!submission){
            return res.status(404).json({message: "Submission not found",success:false});
        }
    
        return res.status(200).json({submission,success:true});
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Internal server error",success: false});
    }
}

export const getSubmissionById = async(req,res)=>{
    try {
        const {id} = req.params;
        if(!id){
            return res.status(400).json({message: "All fields are required",success:false});
        }

        const submission = await SubmissionModel.findById(id).populate('answers');
        if(!submission){
            return res.status(404).json({message: "Submission not found",success:false});
        }
        return res.status(200).json({submission,success:true});
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Internal server error",success: false});
    }
}

export const updateSubmission = async(req,res)=>{
    try {
        const {id} = req.params;
        const { classroomId, assignmentId, studentId, answers, status } = req.body;
        if(!id || !classroomId||!assignmentId || !studentId || !answers || !status){
            return res.status(400).json({message: "All fields are required",success:false});
        }
        
        const submission = await SubmissionModel.findById(id).populate('answers');

        if(!submission){
            return res.status(404).json({message: "Submission not found",success:false});
        }

        const classroom = await ClassroomModel.findById(classroomId);
        if(!classroom){
            return res.status(404).json({message: "Classroom not found",success:false});
        }

        if(!classroom.students.includes(id)){
            return res.status(403).json({message: "You are not allowed to submit assignment",success:false});
        }

        const questions = await AssignmentModel.findById(assignmentId).populate('questions');
        if(questions.length !== answers.length){
            return res.status(400).json({message: "Answers count does not match questions count",success:false});
        }

        for(let i = 0; i < questions.length; i++){
            const question = questions[i]._id;
            const questionModel = await QuestionModel
                .findById(question);
            if(!questionModel){
                return res.status(404).json({message: "Question not found",success:false});
            }
        }


        let new_answer=[];
        for(let i = 0; i < answers.length; i++){
            // update the previous document
            const answer = answers[i];
            const answerModel = await AnswerModel
                .find({questionId: answer.questionId, createdBy: studentId});
            if(answerModel){
                answerModel.content = answer.content;
                answerModel.images = answer.images;
                answerModel.marksObtained = answer.marksObtained;
                await answerModel.save();
                new_answer.push(answerModel._id);
            }else{
                const newAnswer = new AnswerModel({
                    questionId: answer.questionId,
                    content: answer.content,
                    images: answer.images,
                    marksObtained: answer.marksObtained,
                    createdBy: studentId
                });
                await newAnswer.save();
                new_answer.push(newAnswer._id);
            }
        }

        submission.answers = new_answer;

        submission.status = status;
        await submission.save();

        return res.status(200).json({message: "Submission updated successfully",success:true});
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Internal server error",success: false});
    }
}