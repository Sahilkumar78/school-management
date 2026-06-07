import jwt from "jsonwebtoken"
import { ApiResponse } from "../utils/ApiResponse"
import { ApiError } from "../utils/ApiError"
import {asyncHandler} from "../utils/asyncHandler"

const verifyToken = asyncHandler(async (req, res) => {
     
    try {
        
      const token = req.header("Authorization")?.replace("Bearer ", "")

     if(!token){
         return res
                .status(401)
                .json(new ApiResponse(401, "Unauthorized acces"))
     }


     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
        req.user=decoded;

        next();

    } catch (error) {
          console.log("Error while verifying Admin: ", error);
          throw new ApiError(401, "invalid token") 
    }
})

export {verifyToken}