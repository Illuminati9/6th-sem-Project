import CommentModel from '../models/Comment.js';
import ClassroomModel from '../models/Classroom';
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

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false,
        });
    }
}

