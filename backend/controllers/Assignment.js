import AssignmentModel from '../models/Assignment.js';
import QuestionModel from '../models/Question.js';
import ClassroomModel from '../models/Classroom.js';
import Assignment from '../models/Assignment.js';

export const createAssignment = async (req, res) => {
    try {
        const { title, description, dueDate, dueTime, totalMarks, questions } = req.body;
        const {id} = req.user;
        const {classroomCode} = req.params;

        if(!title || !description ){
            console.log(title,description)
            return res.status(400).json({message: "Please fill in all fields",success: false});
        }
        if(!questions || questions.length === 0){
            return res.status(400).json({message: "Please add at least one question",success: false});
        }
        
        console.log(questions);
        for(let i=0;i<questions.length;i++){
            if(!questions[i].content){
                return res.status(400).json({message: "Please fill in all fields",success: false});
            }
        }

        const classroom = await ClassroomModel.findOne({classroomCode});

        if(!classroom){
            return res.status(404).json({
                message: "Classroom not found",
                success: false,
            })
        }

        if(classroom.instructor.toString() !== id.toString() && !classroom.assistants.some((assistant) => assistant.toString() === id.toString())){
            return res.status(403).json({
                message: "You are not authorized to create assignment in this classroom",
                success: false,
            });
        }

        // const dueDateTime = new Date(`${dueDate}T${dueTime}`);

        const newAssignment = new AssignmentModel({
            title,
            description,
            dueDate,
            dueTime,
            totalMarks,
            classroomId: classroom._id,
            createdBy: id,
        });

        const savedAssignment = await newAssignment.save();
        const questionDetails = [];
        for (let i = 0; i < questions.length; i++) {
            const { content, marks } = questions[i];
            const newQuestion = new QuestionModel({
                content,
                marks,
                assignmentId: savedAssignment._id,
                createdBy: id,
            });
            await newQuestion.save();
            questionDetails.push(newQuestion._id);
        }
        savedAssignment.questions = questionDetails;
        await savedAssignment.save();
    
        res.status(201).json({
            message: "Assignment created successfully",
            success: true,
            data: savedAssignment,
        });
    } catch (error) {
        res.status(500).json({ message: error.message,success: false });
    }
}

export const getAssignment = async (req, res) => {
    try {
        const {assignmentId} = req.params;

        if(!assignmentId){
            return res.status(400).json({
                message: "Please provide assignment ID",
                success: false,
            });
        }

        const assignment = await Assignment.findById(assignmentId);
        if(!assignment){
            return res.status(404).json({
                message: "Assignment not found",
                success: false,
            });
        }

        const answer = assignment;
        const questionArray = [];
        for(let i=0;i<answer.questions.length;i++){
            const question = await QuestionModel.findById(answer.questions[i]);
            questionArray.push(question);
        }
        
        answer.questions = questionArray;

        return res.status(200).json({
            message: "Assignment fetched successfully",
            success: true,
            data: answer,
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false,
        })
    }
};

export const getAllAssignments = async (req, res) =>{
    try {
        const {classroomCode} = req.params;
        if(!classroomCode){
            return res.status(400).json({
                message: "Please provide classroom code",
                success: false,
            });
        }

        const classroom = await ClassroomModel.findOne({classroomCode});
        if(!classroom){
            return res.status(404).json({
                message: "Classroom not found",
                success: false,
            });
        }

        const assignments = await AssignmentModel.find({classroomId: classroom._id});
        if(!assignments){
            return res.status(404).json({
                message: "No assignments found",
                success: false,
            });
        }

        console.log(assignments)


        return res.status(200).json({
            message: "Assignments fetched successfully",
            success: true,
            data: assignments,
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false,
        });
    }
};

export const getAllAssignmentsById = async (req, res) =>{
    try {
        const {classroomId} = req.params;
        if(!classroomId){
            return res.status(400).json({
                message: "Please provide classroom code",
                success: false,
            });
        }

        const classroom = await ClassroomModel.findById(classroomId);
        if(!classroom){
            return res.status(404).json({
                message: "Classroom not found",
                success: false,
            });
        }

        const assignments = await AssignmentModel.find({classroomId: classroom._id});
        if(!assignments){
            return res.status(404).json({
                message: "No assignments found",
                success: false,
            });
        }


        return res.status(200).json({
            message: "Assignments fetched successfully",
            success: true,
            data: assignments,
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false,
        });
    }
};

export const updateAssignment = async (req, res) => {
    try{
        const {title, description, dueDate, totalMarks, questions} = req.body;
        const {id} = req.user;
        const {assignmentId} = req.params;

        if(!title || !description || !questions ){
            return res.status(400).json({
                message: "Please fill in all fields",
                success: false,
            });
        }

        const assignment = await AssignmentModel.findById(assignmentId);
        if(!assignment){
            return res.status(404).json({
                message: "Assignment not found",
                success: false,
            });
        }

        const classroom = await ClassroomModel.findById(assignment.classroomId);
        if(!classroom){
            return res.status(404).json({
                message: "Classroom not found",
                success: false,
            });
        }

        if(classroom.instructor.toString() !== id.toString() && !classroom.assistants.some((assistant) => assistant.toString() === id.toString())){
            return res.status(403).json({
                message: "You are not authorized to update assignment in this classroom",
                success: false,
            });
        }

        for(let i=0;i<assignment.questions.length;i++){
            await QuestionModel.findByIdAndDelete(assignment.questions[i]);
        }

        assignment.title = title;
        assignment.description = description;
        assignment.dueDate = dueDate;
        assignment.totalMarks = totalMarks;

        const questionDetails = [];
        for(let i=0;i<questions.length;i++){
            const {content, marks} = questions[i];
            const newQuestion = new QuestionModel({
                content,
                marks,
                assignmentId: assignment._id,
                createdBy: id,
            });
            await newQuestion.save();
            questionDetails.push(newQuestion._id);
        }

        assignment.questions = questionDetails;
        await assignment.save();

        return res.status(200).json({
            message: "Assignment updated successfully",
            success: true,
            data: assignment,
        });
    }catch(error){
        return res.status(500).json({
            message: error.message,
            success: false,
        });
    }
};

export const deleteAssignment = async (req, res) => {
    try {
        const { id } = req.user;
        const { assignmentId } = req.params;

        if (!assignmentId) {
            return res.status(400).json({
                message: "Please provide assignment ID",
                success: false,
            });
        }

        const assignment = await AssignmentModel.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({
                message: "Assignment not found",
                success: false,
            });
        }

        const classroom = await ClassroomModel.findById(assignment.classroomId);
        if (!classroom) {
            return res.status(404).json({
                message: "Classroom not found",
                success: false,
            });
        }

        if (classroom.instructor.toString() !== id.toString() && !classroom.assistants.some((assistant) => assistant.toString() === id.toString())) {
            return res.status(403).json({
                message: "You are not authorized to delete assignment in this classroom",
                success: false,
            });
        }

        for (let i = 0; i < assignment.questions.length; i++) {
            await QuestionModel.findByIdAndDelete(assignment.questions[i]);
        }
    
        await AssignmentModel.findByIdAndDelete(assignmentId);

        return res.status(200).json({
            message: "Assignment deleted successfully",
            success: true,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false,
        });
    }
};

