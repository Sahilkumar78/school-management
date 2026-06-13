import mongoose from "mongoose";

const studentSchema =new mongoose.Schema({
      
     name: {
           type: String,
           required: true,
     }, 

     rollNum:{
           type: String,
           required: true ,
            unique: true
     },

     password:{
           type: String,
           required: true,
         
     },

     sClass:{
           type: mongoose.Schema.Types.ObjectId,
           ref: 'StudentClass',
           required: true
     },

     school:{
           type: mongoose.Schema.Types.ObjectId,
           ref: 'Admin',
           required: true
     },

     role:{
           type: String,
           default: "Student"
     },

     examResult: [
          {
               subName:{
                     type: mongoose.Schema.Types.ObjectId,
                     ref: 'Subject',
                     required: true,           
               },
               marksObtained: {
                     type: Number,
                     default: 0,
                     required: true
               }
          }
     ],

     attendance: [
          {
               date: {
                     type: Date,
                     required: true
               },

               status:{
                     type: String,
                     enum: ["present", "absent"],
                     required: true
               },

               subName:{
                     type: mongoose.Schema.Types.ObjectId,
                     ref: 'Subject',
                     required: true
                     
               }
          }
     ]

}, {timestamps: true})

const Student = mongoose.model("Student", studentSchema);

export {Student}