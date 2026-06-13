import mongoose from "mongoose";
import { Student } from "../models/student.model";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";



// register

const studentRegister = asyncHandler(async (req, res) => {
       
    const {name, rollNum, password, sClass, school} = req.body;

    if(!name || !rollNum || !password || !sClass || !school){
         throw new ApiError(400, "All fields are required");
    }

    const existingStudent = await Student.find({rollNum})

    if(existingStudent){
         throw new ApiError(409, "student already exists");
    }

    const hasedPassword = await bcrypt.hash(password, 10);

    const student=   await Student.create({
         name, 
         rollNum,
         password: hashedPassword,
         sClass,
         school
      })

    console.log(student.password);
      student.password = undefined
    
      return res
            .status(201)
            .json(new ApiResponse(201, "Student created successfully"));
})


// login

const studentLogin = asyncHandler(async (req, res) => {

         // get data from frontend
         const {rollNum, password} = req.body;


           // check for data
         if(!rollNum || !password){
             throw new ApiError(400, "All fields are required");
         }
        

         //check student in db
        const student = await Student.findOne({rollNum});

        if(!student){
             throw new ApiError(404, "Student not found");
        }


        // check for password
        const isPasswordCorrect = bcrypt.compare(password, student.password)
            
        if(!isPasswordCorrect){
             throw new ApiError(401, "Invalid credentials");
        }

        // generate token

        const token = jwt.sign(
            {
                _id: student._id,
                role: student.role
            }, 
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        )

        student.password = undefined

        return res
              .status(200)
              .cookie("token", token, {
                httpOnly: true,
                secure: false
              })
              .json(new ApiResponse(200, {token, student}, "Student logged in successfully"));

})


// get all students

const getStudents= asyncHandler(async(req, res) => {
         const {schoolId} = req.params;

       const students = await Student.find({
            school: schoolId
         })
         .populate("sClass")
         .populate("school")

         return res
                .status(200)
                .json(new ApiResponse(200, students, "Students fetched successfully"));

})

// get student details

const getStudentDetails = asyncHandler(async (req, res) => {
         
          const {id} = req.params;

        const student = await Student.findById(id)
        .populate("sClass")
        .populate("school")
        .populate("attendance.subName")
        .populate("examResult.subName");

         if(!student){
             throw new ApiError(404, "Student not found");
         }              
        
         student.password = undefined;

         return res 
                .status(200)
                .json(new ApiResponse(200, student, "Student fetched Successfully"));
          
})


export {
     studentRegister,
     studentLogin,
     getStudents,
     getStudentDetails
}