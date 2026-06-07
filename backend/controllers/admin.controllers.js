
import express from "express"
import { Admin } from "../models/admin.model";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import jwt from "jsonwebtoken"



const adminRegister = asyncHandler(async (req, res) => {
       
          try {

            const {name, email, password, schoolName} = req.body;

         if(!name || !email|| !password ||  !schoolName){
             throw new ApiError(400, "All fields are required");
         }

         // check

   const existingAdmin = await Admin.findOne({
            $or: [{email}, {schoolName}]
         })

       if(existingAdmin){
         return res
                .status(409)
                .json(new ApiResponse(409, {existingAdmin}, "admin already existed"))
       }
      
      const hashedPassword = await bcrypt.hash(password, 10);

      const admin = Admin.create({
         name,
         email,
         password: hashedPassword,
         schoolName,
      })

      return res
             .status(201)
             .json(new ApiResponse(201, {admin}, "admin created Successfully"));
            
          } catch (error) {
              
            console.log("Error while creating Admin: ", error);
            throw new ApiError(500, "server error");
            
          }
})


const adminLogin = asyncHandler(async (req, res) => {
         try {
            
             const {email, password} = req.body;

          if(!email || !password){
             throw new ApiError(400, "all fields are required");
          }

        const admin= await Admin.findOne({email});

        if(!admin){
             throw new ApiError(404, "Admin not found");
        }
        
      const isPasswordCorrect= await bcrypt.compare(password, admin.password);

      if(!isPasswordCorrect){
         throw new ApiError(401, "invalid credentials")
      }
     
      // generate token
      const token = jwt.sign(
         {
             id: admin._id,
          role:admin.role
         },
         process.env.JWT_SECRET,
         {
            expiresIn: "7d"
         }
      )

      return res
             .status(200)
             .json(new ApiResponse(200, {token, admin}, "admin login successfully"));

         } catch (error) {
             console.log("Error while logging admin: ", error);
             throw new ApiError(500, "internal server erorr");
             process.exit(1); 
         }

})


const getAdminDetails = asyncHandler(async (req, res) => {
         
         try {
            
            const admin = await Admin.findById(req.user.id).select("-password");

        if(!admin){
             throw new ApiError(404, "Admin not found");
        }

        return res 
               .status(200)
               .json(new ApiResponse(200, admin, "fetched admin's details successfully"))

         } catch (error) {
             console.log("Erorr while fetching admin details: ", error);
             throw new ApiError(500, "internal server error");   
         }
})

export {
       adminRegister,
       adminLogin,
       getAdminDetails
}