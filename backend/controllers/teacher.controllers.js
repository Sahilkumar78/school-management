import mongoose from "mongoose";
import {Teacher} from "../models/teacher.model"
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

const teacherRegister = asyncHandler(async (req , res) => {
      
    try {
     
        const {name, email, password, school, teacherSubject} = req.body;

     if(!name || !email || !password || !school){
           throw new ApiError(400, "all fields are required")
     }

     const existingTeacher = await Teacher.findOne({email})

     if(existingTeacher){
          return res
                 .status(409)
                 .json(new ApiResponse(409, "Teacher Already existed"))
     }

     const hashedPassword = await bcrypt.hash(password, 10);

     // create teacher
     const teacher = await Teacher.create({
           name,
           email,
           password: hashedPassword,
           school,
           teacherSubject
     })

     return res 
            .status(201)
            .json(new ApiResponse(201, teacher, "Teacher registered successfully"));

   

    } catch (error) {
         console.log("Error while registering teacher", error);
         throw new ApiError(500, "internal server error");
         process.exit(1);
    }
})


const teacherLogin = asyncHandler(async (req, res) => {
          const {email, password} = req.body;

          if(!email || !password){
                throw new ApiError(400, "All fields are required");
          }

          const teacher = await Teacher.findOne({email});

          if(!teacher){
                throw new ApiError(404, "Teacher not found");
          }

          const isPasswordCorrect = await bcrypt.compare(password, teacher.password)

          if(!isPasswordCorrect){
                throw new ApiError(401, "Invalid credentials");
          }
        
          const token = jwt.sign(
               {
                    _id: teacher._id,
                    role: teacher.role,
               },
               process.env.JWT_SECRET,
               {
                    expiresIn: "7d"
               }
          )

          return res
                .status(200)
                .cookie("token", token, {
                     httpOnly: true,
                     secure: false
                })
                .json(new ApiResponse(200, {token, teacher}, "teacher logged in successfully"))

})

const getTeachers = asyncHandler(async (req, res) => {
   
         try {
            
             const {schoolId} = req.params;

          const teachers = await Teacher.find({
            school: schoolId,
          }).populate("teacherSubject");

      

          return res 
                 .status(200)
                 .json(new ApiResponse(200, teachers, "All teachers fetched successfully"));


         } catch (error) {
               
            console.log("Error while fetching all teachers: ", error);
            throw new ApiError(500, "Internal sever error");
         }
}) 

const getTeacherDetails = asyncHandler(async (req, res) => {
          
                 try {
                  
                     const {id} = req.params;

          const teacher = await Teacher.findById(id)
          .populate("teacherSubject")
          .populate("school");

          if(!teacher){
            throw new ApiError(404, "tracher not found");
          }

          return res 
                 .status(200)
                 .json(new ApiResponse(200, teacher, "techer details fetched"));
           

                 } catch (error) {
                     
                    console.log("Error while fetching teacher details: ", error);
                    throw new ApiError(500, "Internal server error");
                    
                 }

})

const updateTeacherSubject = asyncHandler(async (req, res) => {
       
          try {
            
             const {teacehrId} = req.params;
         const {subjectId} = req.params;

         const teacher = await Teacher.findByIdAndUpdate(
            teacehrId,
            {
                  teacherSubject: subjectId
            },
            {
                  new: true
            }
      ).populate("teacherSubject")

      if(!teacher){
             throw new ApiError(404, "teacher not found");
      }

      return res
             .status(200)
             .json(new ApiResponse(200,teacher,  "teacher subject updated successfully"));


          } catch (error) {
               
             console.log("Error while updating teacher's subject: ", error);
             throw new ApiError(500, "Internal server error");
          } 

})


const deleteTeacher = asyncHandler(async (req, res) => {
           

          try {
            
            const {id} = req.params;

           const teacher = await Teacher.findById(id);
          
           if(!teacher){
             throw new ApiError(404, "teacher not found");
           }

           await Teacher.findByIdAndDelete(id);

           return res
                  .status(200)
                  .json(new ApiResponse(200, "teacher deleted successfully"));


          } catch (error) {
             console.log("Error while deleting teacher", error);
             throw new ApiError(500, "internal server error");
          }
})

const deleteTeachers = asyncHandler(async (req, res) => {
          try {
            
            const {schoolId} = req.params;

      //    console.log(schoolId);
         
      await Teacher.deleteMany({
            school: schoolId
      })

      return res
             .status(200)
             .json(new ApiResponse(200, "All teachers deleted successfully"));
             

          } catch (error) {
             console.log("Error while deleting many teachers: ", error);
             throw new ApiError(500, "internal server error");
          }


})


// delete teacher by class

const deleteTeacherByClass = asyncHandler(async (req, res) => {
           
        try {
            
            const {classId} = req.params;

      await Teacher.deleteMany({
            teachSclass: classId
      })

      return res
            .status(200)
            .json(new ApiResponse(200, "Teacher deleted successfully"));


        } catch (error) {
            
            console.log("Error while deleting teacher's by class: ", error);
            throw new ApiError(500, "Internal server error");   
        }
      })

// teacher attendance

const teacherAttendance= asyncHandler(async (req, res) => {
          const {status, date} = req.body;
          const {id} = req.params;


          const teacher = await Teacher.findById(id);
          if(!teacher){
             throw new ApiError(404, "Teacher not found");
          }

          teacher.attendance.push({
             date, status
          })

          await Teacher.save();

          return res 
                 .status(200)
                 .json(new ApiResponse(200, teacher, "Teacher attendance successfully updated"));
})


export {
        teacherRegister,
        teacherLogin,
        getTeachers,
        getTeacherDetails,
        updateTeacherSubject,
        deleteTeacher,
        deleteTeachers,
        teacherAttendance
}