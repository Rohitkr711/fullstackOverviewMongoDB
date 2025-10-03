import mongoose, { Mongoose } from "mongoose";
import dotenv from "dotenv"

dotenv.config()

export const db = ()=>{
 
    mongoose.connect(process.env.DB_URL)
    .then(()=>{
        console.log("Successfully connected to database");
        
    })
    .catch(()=>{
        console.log("Error connecting to momgoDB");
        
    })
    
}