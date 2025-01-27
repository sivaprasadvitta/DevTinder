import express from "express";
import userAuth from "./middlewares/auth.js";
import connectDB from "./config/database.js";
import  validateSignUp  from "./utils/validation.js";
import dotenv from "dotenv";
import validator from "validator";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import cors from 'cors'

import User from "./models/user.js";
// routes
import authRouter from "./routes/auth.js";
import profileRouter from "./routes/profile.js";
import requestRouter from "./routes/request.js";
import userRouter from "./routes/user.js";

dotenv.config();

const port = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
    'https://devtinder-kroy.onrender.com',
    'http://localhost:5173' // Keep for local development
  ];
  
  app.use(cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  }));


app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',requestRouter);
app.use('/',userRouter);











// get user
app.get('/user',async (req,res)=>{

    const email = req.body.email;
    console.log(email);

    try{
        const result = await  User.find({email:email});

        if(result.length === 0){
            res.status(404).send("user not found");
        }
        else{
            res.status(200).send(result);
        }


    }catch(error){
        res.status(500).send("some thing went wrong");
    }

})

// get all users 
app.get('/fetch',async (req,res)=>{
    
    try{
        const result = await User.find({});

        if(result.length === 0){
            res.status(404).send("user not found");
        }
        else{
            res.status(200).send(result);
        }

    }catch(error){
        res.status(500).send("some thing went wrong");
    }
})

// find any one
app.get('/fetchOne', async(req,res)=>{
    const email = req.body.email;
    console.log(email);

    try{
        const result = await User.findOne({email:email});

        if(result.length == 0){
            res.status(404).send("user not found");
        }else{
            res.status(200).send(result);
        }

    }catch(error){  
        res.status(500).send("somthing went wrong");

    }
})

// update
app.patch('/update', async (req,res)=>{
    const id = req.body._id;
    const {photoUrl,aboutMe,skills,gender} = req.body;

    try{
        const ALLOWED_UPDATES = ["_id","photoUrl","aboutMe","skills","gender"];

        const isUpdadeAllowed = Object.keys(req.body).every((k)=>{
            ALLOWED_UPDATES.includes(k);
        })

        if(!isUpdadeAllowed){
            return res.status(400).send("invalid updates");
        }
        if(req.body.skills.length >10){
            throw new Error("skills should be less than 10");
        }
        
        if(!validator.isURL(photoUrl)){
            throw new Error(`Invalid photo url: ${value}`);
        }
        

        
        const result = await User.findByIdAndUpdate({_id:id},req.body,{
            runValidators:true,
            returnDocument:"after",
        });

        res.status(200).send(result);       


    }catch(error){
        res.status(500).send(`UPDATE FAILED :${error.message}`);
    }
})

// delete 
app.delete('/delete',async(req,res)=>{
    const id = req.body._id;

    try{
        const result = await User.findByIdAndDelete({_id:id});

        res.status(200).send(result);

    }catch(error){  
        res.status(500).send("somthing went wrong");

    }
})

// delete all
app.delete('/deleteAll',async(req,res)=>{
    try{
        const result = await User.deleteMany({});

        res.status(200).send(result);

    }catch(error){  
        res.status(500).send("somthing went wrong");    

    }
});





connectDB()
    .then(() => {
        console.log("DB connected");
        app.listen(port, () => {
            console.log(`Server started at http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.error("Failed to connect to DB:", err);
    });
