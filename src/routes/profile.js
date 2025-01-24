import express from "express";
import userAuth from "../middlewares/auth.js";
import  {validateProfileEditData}  from "../utils/validation.js";
import bcrypt from "bcryptjs";
import validator from "validator";
import { data } from "react-router-dom";


const profileRouter = express.Router();

// get profile
profileRouter.get('/profile',userAuth,async (req,res)=>{

    try{
        const user = req.user;
        res.send(user);
    }catch(error){
        res.status(500).send("some thing went wrong");
    } 
});

// update profile
profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
    const allowedUpdates = [
        "firstName",
        "lastName",
        "photoUrl",
        "aboutMe",
        "skills",
        "gender",
        "age",
    ];
    
    try {
        // Validate profile data
        const isUpdateAllowed = validateProfileEditData(req);

        if (!isUpdateAllowed) {
            return res.status(400).send({ message: "Invalid updates. No valid fields provided." });
        }

        const loginUser = req.user;

        // Update only allowed fields
        Object.keys(req.body).forEach((key) => {
            if (allowedUpdates.includes(key)) {
                loginUser[key] = req.body[key];
            }
        });

        await loginUser.save();

        res.status(200).json({ message: "Profile updated successfully", data: loginUser });
    } catch (error) {
        res.status(500).send({ error: `ERROR: ${error.message}` });
    }
});


// update password
profileRouter.patch('/profile/password', userAuth, async (req, res) => {
    try {
        const  newPassword  = req.body.password;  
        
        // console.log(newPassword);

        if(!validator.isStrongPassword(newPassword)){
            throw new Error(`Password is too weak`);
        }


        const loginUser = req.user;

        const isPasswordMatch = await bcrypt.compare(newPassword, loginUser.password);

        if(isPasswordMatch){
            throw new Error("new password is similar to old password");
        }

        // console.log(loginUser)
        const hasedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        loginUser.password = hasedPassword;
        await loginUser.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(500).send({ error: `ERROR: ${error.message}` });
    }
}); 






export default profileRouter;

