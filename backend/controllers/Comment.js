import CommentModel from '../models/Comment.js';
import ClassroomModel from '../models/Classroom.js';
import UserModel from '../models/User.js';
import AssignmentModel from '../models/Assignment.js';

export const createComment = async (req, res) => {
    try {
        const {content, classroomId, assignmentId, parentCommentId} = req.body;
        const {id} = req.user;

        if(!content){
            return res.status(400).json({
                message: "Please provide content",
                success: false,
            });
        }

        if(!classroomId && !assignmentId && !parentCommentId){
            return res.status(400).json({
                message: "Please provide classroomId",
                success: false,
            });
        }

        if(classroomId){
            const classroom = await ClassroomModel.findById(classroomId);
            if(!classroom){
                return res.status(404).json({
                    message: "Classroom not found",
                    success: false,
                });
            }
        }

        if(assignmentId){
            const assignment = await AssignmentModel.findById(assignmentId);
            if(!assignment){
                return res.status(404).json({
                    message: "Assignment not found",
                    success: false,
                });
            }
        }

        if(parentCommentId){
            const parentComment = await CommentModel.findById(parentCommentId);
            if(!parentComment){
                return res.status(404).json({
                    message: "Parent comment not found",
                    success: false,
                });
            }
        }

        const user = await UserModel.findById(id);
        if(!user){
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        const comment = new CommentModel({
            content,
            classroomId,
            assignmentId,
            parentCommentId,
            createdBy: id,
        });
        await comment.save();

        return res.status(201).json({
            message: "Comment created successfully",
            success: true,
            data: comment,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false,
        });
    }
}


export const getComments = async (req, res) => {
    try {
        const {classroomId, assignmentId, parentCommentId} = req.body;

        if(!classroomId && !assignmentId && !parentCommentId){
            return res.status(400).json({
                message: "Please provide classroomId",
                success: false,
            });
        }

        if(classroomId){
            const classroom = await ClassroomModel.findById(classroomId);
            if(!classroom){
                return res.status(404).json({
                    message: "Classroom not found",
                    success: false,
                });
            }
        }

        if(assignmentId){
            const assignment = await AssignmentModel.findById(assignmentId);
            if(!assignment){
                return res.status(404).json({
                    message: "Assignment not found",
                    success: false,
                });
            }
        }

        if(parentCommentId){
            const parentComment = await CommentModel.findById(parentCommentId);
            if(!parentComment){
                return res.status(404).json({
                    message: "Parent comment not found",
                    success: false,
                });
            }
        }

        let comments = [];
        if(classroomId){
            comments = await CommentModel.find({classroomId}).populate('createdBy', 'name email');
            // console.log(comments)
        }

        if(assignmentId){
            comments = await CommentModel.find({assignmentId}).populate('createdBy', 'name email');
        }

        if(parentCommentId){
            comments = await CommentModel.find({parentCommentId}).populate('createdBy', 'name email');
        }

        return res.status(200).json({
            message: "Comments fetched successfully",
            success: true,
            data: comments,
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false,
        });
    }
}

