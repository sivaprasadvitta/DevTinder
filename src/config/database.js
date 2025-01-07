import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); 

// console.log(process.env.MONGO_URL);

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://siva:siva03@users.1ob9p.mongodb.net/devTinder");
    
};

export default connectDB;
