import UserModel from '../models/User.js';
import ClassroomModel from '../models/Classroom.js';
import { Assistant, Instructor, Student } from '../utils/enums.js';

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

        if(classroom.students.some(student => student.id.toString() === id.toString())) {
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
      
        if(!classroom) {
            return res.status(404).json({ message: "Classroom not found.",success: false });
        }
       
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
        

        for(let i=0;i<classrooms.length;i++){
            const instructor = await UserModel.findById(classrooms[i].instructor,{password:0});
            classrooms[i].instructor = instructor.name;
        }

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
                id: user._id.toString(),
                name: user.name,
                role: Student
            }

            allDetails.push(details);
        }
        const instructor = await UserModel.findById(classroom.instructor,{password:0});
        const instructorDetail = {
            id: instructor._id.toString(),
            name: instructor.name,
            role: Instructor
        }

        const assistantDetails = [];
        for(let i=0;i<classroom.assistants.length;i++){
            const assistant = await UserModel.findById(classroom.assistants[i].id,{password:0});
            const details = {
                id: assistant._id.toString(),
                name: assistant.name,
                role: Assistant
            }
            assistantDetails.push(details);
        }

        res.status(200).json({
            success: true,
            students: allDetails,
            instructor: instructorDetail,
            assistants: assistantDetails
        });

    } catch (error) {
        res.status(500).json({ 
            message: error.message,
            success: false
        });
    }
}

export const updateClassroom = async (req,res)=>{
    try {
        const { classroomCode } = req.params;
        const { id } = req.user;
        const { name, subject, description } = req.body;

        if(!name || !subject || !description){
            return res.status(400).json({
                message: "All fields are required.",
                success: false
            });
        }

        const classroom = await ClassroomModel.findOne({classroomCode});
        if(!classroom){
            return res.status(404).json({
                message: "Classroom not found.",
                success: false
            });
        }

        if(classroom.instructor.toString()!=id){
            return res.status(400).json({
                message: "You are not the instructor of this classroom.",
                success: false
            });
        }

        classroom.name = name;
        classroom.subject = subject;
        classroom.description = description;
        await classroom.save();

        res.status(200).json({
            success: true,
            message: "Classroom updated successfully.",
            classroom: classroom
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
}

export const updateAssistants = async (req, res) => {
    try {
        const { classroomCode } = req.params;
        const { id } = req.user;
        const { assistants } = req.body;

        if (!assistants || !Array.isArray(assistants) || assistants.length === 0) {
            return res.status(400).json({
                message: "Assistants field is required and must be a non-empty array.",
                success: false
            });
        }

        const classroom = await ClassroomModel.findOne({ classroomCode });
        if (!classroom) {
            return res.status(404).json({
                message: "Classroom not found.",
                success: false
            });
        }

        if (classroom.instructor.toString() !== id.toString()) {
            return res.status(400).json({
                message: "You are not the instructor of this classroom.",
                success: false
            });
        }

        const assistantsArray = [];
        for (let i = 0; i < assistants.length; i++) {
            const assistant = await UserModel.findOne({ username: assistants[i] });
            if (!assistant) {
                return res.status(404).json({
                    message: `Assistant with username ${assistants[i]} not found.`,
                    success: false
                });
            }
            assistantsArray.push(assistant._id);
        }

        classroom.students = classroom.students.filter(studentId => !assistantsArray.includes(studentId.toString()));

        classroom.assistants = assistantsArray;
        await classroom.save();

        res.status(200).json({
            success: true,
            message: "Assistants updated successfully.",
            classroom: classroom
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

export const deleteClassroom = async (req,res)=>{
    try {
        const { classroomCode } = req.params;
        const { id } = req.user;

        const classroom = await ClassroomModel.findOne({classroomCode});

        if(!classroom){
            return res.status(404).json({
                message: "Classroom not found.",
                success: false
            });
        }

        if(classroom.instructor.toString()!=id){
            return res.status(400).json({
                message: "You are not the instructor of this classroom.",
                success: false
            });
        }
        
        for(let i=0;i<classroom.students.length;i++){
            const student = await UserModel.findById(classroom.students[i].id);
            student.classrooms = student.classrooms.filter(cls => cls.toString() !== classroom._id.toString());
            await student.save();
        }

        const instructor = await UserModel.findById(id);
        instructor.classrooms = instructor.classrooms.filter(cls => cls.toString() !== classroom._id.toString());
        await instructor.save();

        await ClassroomModel.findByIdAndDelete(classroom.id);

        res.status(200).json({
            success: true,
            message: "Classroom deleted successfully."
        });
    }catch(error){
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

export const exitClassroom = async (req,res)=>{
    try {
        const { classroomCode } = req.params;
        const { id } = req.user;

        const classroom = await ClassroomModel.findOne({classroomCode});

        if(!classroom){
            return res.status(404).json({
                message: "Classroom not found.",
                success: false
            });
        }

        if(classroom.instructor.toString()===id){
            return res.status(400).json({
                message: "You are the instructor of this classroom.",
                success: false
            });
        }

        const student = await UserModel.findById(id);
        student.classrooms = student.classrooms.filter(cls => cls.toString() !== classroom._id.toString());
        await student.save();

        console.log(student);

        classroom.students = classroom.students.filter(student => student.toString() !== id);

        classroom.assistants = classroom.assistants.filter(assistant => assistant.toString() !== id);
        await classroom.save();
        
        res.status(200).json({
            success: true,
            message: "You have successfully exited the classroom."
        }); 

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

