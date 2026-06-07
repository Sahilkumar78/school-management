import dotenv from "dotenv"


import { app} from "./app.js"
import {connectDB} from "./db/index.js"

dotenv.config({
    path:'./.env',
    quiet: true,

})



app.get("/", (req, res) => {
        res.send("<h1>Your student managament database is ready now</h1>")
})

connectDB()
.then(() => {
     app.listen(process.env.PORT || 8080, () => {
           console.log(`server is running at port: ${process.env.PORT}`);
           
     })
})
.catch((error) => {
      console.log("mongoDB connection failed!!", error);
      
})