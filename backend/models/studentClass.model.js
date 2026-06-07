import mongoose from "mongoose";

const studenClassSchema = new mongoose.Schema({
     
       studentClassName:{
            type: String,
            required: true
       },
       school:{
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Admin',
         required: true,
       }
}, {timestamps: true})


const StudentClass = mongoose.model("StudentClass", studenClassSchema);

export {studenClass};

