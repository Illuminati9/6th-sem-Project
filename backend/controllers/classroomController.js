import UserModel from '../models/User.js';
import ClassroomModel from '../models/Classroom.js';
import { Instructor, Student } from '../utils/enums.js';

const classroomCodeGenerator = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < 8; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const checkValidClassroomCode = async () => {
    let classroomCode;
    do{
        classroomCode = classroomCodeGenerator();
    }while(await ClassroomModel.findOne({classroomCode: classroomCode}));

    return classroomCode;
};

export const createClassroom = async (req, res) => {
    try {
        const { name, subject, description } = req.body;
        const {id} = req.user;
        if(
           !name 
        || !subject 
        || !description ) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const instructor = await UserModel.findById(id);
        if(!instructor) {
            return res.status(404).json({ message: "Teacher not found." });
        }

        const classroomCode = await checkValidClassroomCode();
        console.log(classroomCode);
        const newClassroom = new ClassroomModel({ name, description, classroomCode, subject, instructor: instructor.id  });
        await newClassroom.save();

        instructor.classrooms.push(newClassroom.id);
        await instructor.save();

        res.status(201).json({
            success: true,
            message: "Classroom created successfully.",
            classroom: newClassroom
        });

    } catch (error) {
        res.status(500).json({ 
            message: error.message,
            success: false
        });
    }
}

export const joinClassroom = async (req, res) => {
    try {
        const { classroomCode } = req.params;
        const { id } = req.user;
        const student = await UserModel.findById(id);
        if(!student) {
            return res.status(404).json({ message: "Student not found.",success: false });
        }

        const classroom = await ClassroomModel.findOne({ classroomCode :classroomCode});

        if(!classroom) {
            return res.status(404).json({ message: "Classroom not found.",success: false });
        }

        if(classroom.instructor==id){
            return res.status(400).json({
                message: "You are the instructor of this classroom.",
                success: false
            });
        }

        if(classroom.students.includes(id)){
            return res.status(400).json({
                message: "You are already a student of this classroom.",
                success: false
            });
        }

        classroom.students.push(id);
        await classroom.save();

        student.classrooms.push(classroom.id);
        await student.save();

        res.status(200).json({
            success: true,
            message: "You have successfully joined the classroom.",
            classroom: classroom
        });
    } catch (error) {
        res.status(500).json({ 
            message: error.message,
            success: false
        });
    }
};

export const getClassroom = async (req, res) => {
    try {
        const { classroomCode } = req.params;
        const { id } = req.user;
        const classroom = await ClassroomModel.findOne({classroomCode}).populate('instructor', 'username email').populate('students', 'username email');
        // console.log(id+'--');
        if(!classroom) {
            return res.status(404).json({ message: "Classroom not found.",success: false });
        }
        // for(let i=0;i<classroom.students.length;i++){
        //     console.log(classroom.students[i].id);
        // }
        // console.log(classroom.students.some(student => student.id.toString() === id.toString()));
        if(classroom.instructor.id!=id && !classroom.students.some(student => student.id.toString() === id.toString())){
            return res.status(400).json({
                message: "You are not a part of this classroom.",
                success: false
            });
        }

        res.status(200).json({
            success: true,
            classroom: classroom
        });

    }catch (error) {
        res.status(500).json({ 
            message: error.message,
            success: false
        });
    }
}

export const getAllClassrooms =async (req,res)=>{
    try {
        const { id } = req.user;
        const user = await UserModel.findById(id).populate('classrooms');   
        
        // we have to hide the details of students in the classroom and only send the name of the instructor
        // console.log(user.classrooms);

        if(!user){
            return res.status(404).json({
                message: "User not found.",
                success: false
            });
        }
        
        if(!user.classrooms.length){
            return res.status(404).json({
                message: "No classrooms found.",
                success: false
            });
        }
        
        const classrooms = user.classrooms.map(classroom => {
            return {
                id: classroom.id,
                name: classroom.name,
                description: classroom.description,
                classroomCode: classroom.classroomCode,
                subject: classroom.subject,
                instructor: classroom.instructor.toString()
            };
        });
        

        res.status(200).json({
            success: true,
            classrooms: classrooms
        });         

    } catch (error) {
        res.status(500).json({ 
            message: error.message,
            success: false
        });
    }
};

export const getUserDataByClassroomCode = async (req,res)=>{
    try {
        const { classroomCode } = req.params;
        const {id} = req.user;
        const classroom = await ClassroomModel.findOne
        ({classroomCode}).populate('students', 'username email');

        if(!classroom){
            return res.status(404).json({
                message: "Classroom not found.",
                success: false
            });
        }

        if(classroom.instructor.id!=id && !classroom.students.some(student => student.id.toString() === id.toString())){
            return res.status(400).json({
                message: "You are forbidden to view the details of the classroom.",
                success: false
            });
        }


        const allDetails =[];
        for(let i=0;i<classroom.students.length;i++){
            const user = await UserModel.findById(classroom.students[i].id,{password:0});

            const details = {
                name: user.name,
                role: Student
            }

            allDetails.push(details);
        }
        const instructor = await UserModel.findById(classroom.instructor,{password:0});
        const instructorDetail = {
            name: instructor.name,
            role: Instructor
        }
        res.status(200).json({
            success: true,
            students: allDetails,
            instructor: instructorDetail
        });

    } catch (error) {
        res.status(500).json({ 
            message: error.message,
            success: false
        });
    }
}