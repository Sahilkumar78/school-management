
import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
      
       name:{
         type: String,
         required: true
       },

       email:{
         type: String,
         required: true,
       },

       passsword:{
         type: String,
         required: true,
       },

       role:{
         type: String,
         default: "Teacher"
       },
      
       school:{
         type: mongoose.Schema.Types.ObjectId,
         ref: "Admin",
         required: true
       },

       teacherSubject:{
         type: mongoose.Schema.Types.ObjectId,
         
       },


})


const Teacher = mongoose.model("Teacher", teacherSchema);

export {Teacher}