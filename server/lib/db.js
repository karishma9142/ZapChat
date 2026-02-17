import mongoose from "mongoose";

// function to conncet to db

export const conncetDb = async () => {
    try {
        mongoose.connection.on('connected' , ()=> console.log('Database connected'))
        await mongoose.connect(process.env.MONOGODB_URL)
    } catch (error) {
        console.log(error)
    }
}