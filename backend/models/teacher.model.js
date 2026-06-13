
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

       password:{
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
         ref: 'Subject'
       },

       teachSclass:{
         type: mongoose.Schema.Types.ObjectId,
         ref: 'StudentClass',
         required: true
       },

       attendance: [{
         date: {
           type: Date,
           required: true
         },
         presentCount:{
           type: String,
           required: true
         },
         absentCount:{
           type: String,
           required: true
         }}]

}, {timestamps: true})


const Teacher = mongoose.model("Teacher", teacherSchema);

export {Teacher}