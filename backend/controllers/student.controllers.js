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

const getStudents = asyncHandler(async (req, res) => {
     
       const {id} = req.params;
     const students = await Student.find({
            school: id
     })
     .populate(
        "sClass", 
        "studentClassName"
     )
     .select("-password");

     if(students.length ===0){
          throw new ApiError(404, "students not found");
     }

     return res 
           .status(200)
           .json(new ApiResponse(200, {students}, "Students fetched succesfully"));

})


const getStudentDetails = asyncHandler(async (req, res) => {
      
         const {id} = req.params;
         
         const student = await Student.findById(id)
         .populate("school", "schoolName")
         .populate("sClass", "StudentClass")
         .populate("examResult.subName", "subName")
         .populate("attendance.subName", "subName sessions")
         .select("-password");

         if(!student){
             throw new ApiError(404, "student not found");
         }

         return res 
                .status(200)
                .json(new ApiResponse(200, student, "student details fetched successfully"));
})


const deleteStudent = asyncHandler(async (req, res) => {
       
         const {id} = req.params;
         const deleteStudent = await Student.findByIdAndDelete(id);

         if(!deleteStudent){
              throw new ApiError(404, "Student not found");
         }


         return res
                .status(200)
                .json(new ApiResponse(200, deleteStudent, "Student deleted successfully"));
})

const updateStudent = asyncHandler(async (req, res) => {
          const {id} = req.params;
          const {name, rollNum, password,  sClass}  =req.body;

          let hashedPassword;

          if(password){
              const salt = await bcrypt.genSalt(10);
               hashedPassword = await bcrypt.hash(password, salt);
          }

          const student = await Student.findByIdAndUpdate(
            id, 
            {
                $set: {
                     name: name,
                     rollNum: rollNum,
                     sClass: sClass,
                     ...(hashedPassword && {
                         password: hashedPassword
                     })
                }
            },
            {
                new: true
            }
          )
          .select("-password");

          if(!student){
             throw new ApiError(404, "Student not found");
          }


          return res 
                 .status(200)
                 .json(new ApiResponse(200, student, "Student updated successfully"));
         
})

const deleteStudents = asyncHandler(async (req, res) => {
              const {id} = req.params;

              const deletedStudents = await Student.deleteMany({
                 school: id
              })

            if(deletedStudents.deletedCount ===0){
                  throw new ApiError(404, "no students found");
            }

            return res 
                    .status(200)
                    .json(new ApiResponse(200, deletedStudents, "Students deleted successfully"));

})


const deleteStudentsByClass = asyncHandler(async (req, res) => {
          const {id} = req.params;

          const deletedStudentByClass = await Student.deleteMany(
            {sClass: id}
          );

          if(deletedStudentByClass.deletedCount ===0){
                 throw new ApiError(404, "students not found");
          }

          return res 
                 .status(200)
                 .json(new ApiResponse(200, deleteStudentsByClass, "students deleted successfully"));
})


const updateExamResult = asyncHandler(async (req, res) => {
        
         const {subName, marksObtained} = req.body;
         const {id} = req.params;

          const student = await Student.findById(id);

          if(!student){
             throw new ApiError(404, "student not found");
          }

          const updatedExamResult = await Student.find(
             item => item.subName.toString() === subName
          );

          if(updateExamResult){
               updateExamResult.marksObtained = marksObtained;
          }

          else{
              student.examResult.push({
                 subName, marksObtained
              })
          }
        
          await Student.save();

          return res
                 .status(200)
                 .json(new ApiResponse(200, updateExamResult, "Student marks updated"));

})

//student attendance

// clearallstudents attendance by subject

//clear all students attendance 

// remove student attendance by subject

// remove student attendance



export {
     studentRegister,
     studentLogin,
     getStudents,
     getStudentDetails,
     deleteStudent,
     updateStudent,
     deleteStudents,
     deleteStudentsByClass,
     updateExamResult,
}