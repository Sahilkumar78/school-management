import mongoose from "mogoose";

const complainSchema = new mongoose.Schema({
    
       user:{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Student',
          required: true
       },

       date: {
         type: Date,
         required: true,
       },

       complaint:{
          type: String,
          required: true 
       },

       School:{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'admin',
          required: true,
       },
}, {timeStamps: true})


const Complain = mongoose.model("Complain", complainSchema);

export {Complain}
