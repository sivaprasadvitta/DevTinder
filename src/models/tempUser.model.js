import mongoose from "mongoose";

const tempUserSchema = mongoose.Schema({
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
})

const tempUser = mongoose.model("tempUser",tempUserSchema);

export default tempUser;