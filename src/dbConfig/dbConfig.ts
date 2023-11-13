import mongoose from "mongoose";

export async function connect() {
    try{
        // connection to db
        mongoose.connect(process.env.MONGO_URI!);
        const connection = mongoose.connection;
        connection.on('connected', ()=>{
            console.log("MongoDB connected successfully");
        })

        // what if error occurs while connecting to DB
        connection.on('error', (err)=>{
            console.log("MongoDB connection error !! Make sure url is correct & mongodb is running", err);
            process.exit();
        })
    }catch(error){
        console.log("something went wrong !");
        console.log(error);
    }
}