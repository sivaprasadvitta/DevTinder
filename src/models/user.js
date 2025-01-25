import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        unique:false,
        trim:true,
        minLength:3,
        maxLength:20
    },
    lastName:{
        type:String,
        trim:true,
        unique:false,
        minLength:3,
        maxLength:20
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        // validate(value){
        //     if(!validator.isEmail(value)){
        //         throw new Error(`Invalid email: ${value}`);
        //     }
        // }
    },
    password:{
        type:String,
        required:true,
    },
    age:{
        type:Number,
        min:16
    },
    gender:{
        type:String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Invalid gender");
            }
        }
    },
    photoUrl:{
        type:String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH0xuC8da1DdVU94AEl9PXOXWnAeRilZEpiw&s",
    },
    aboutMe:{
        type:String,
        default:"write about yourself",
    },
    skills:{
        type:String,
        default:"Coding,Programming"
    },
    
},{timestamps:true});

const User = mongoose.model("User",userSchema);

export default User;