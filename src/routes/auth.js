import express from "express";
import User from "../models/user.js";
import validateSignUp from "../utils/validation.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import tempUser from'../models/tempUser.model.js'
import { sendOtpToEmail } from "./otp.route.js";
import Otp from "../models/otp.model.js";



const authRouter = express.Router();

// signup
authRouter.post("/signup", async (req, res) => {
    try {
        // Step 1: Validate input
        validateSignUp(req.body);

        const { firstName, lastName, email, password } = req.body;

        // Step 2: Encrypt the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Step 3: Check if the user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).send("User already exists");
        }
        await Promise.all([
            Otp.deleteMany({}),
            tempUser.deleteMany({}),
        ]);

        // Step 4: Save the user details in the tempUser collection
        const newUser = new tempUser({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });
        await newUser.save();

        // Step 5: Send OTP to the user's email
        const otpResponse = await sendOtpToEmail(email);
        console.log(otpResponse);

        // Respond to the client
        return res.send("Signup successful. OTP sent to your email for verification.");
    } catch (err) {
        
        return res.status(500).send(`SIGNUP FAILED: ${err.message}`);
    }
});

// authRouter.post("/signup", async (req, res) => {
//     try {
//         // step 1 validation
//         validateSignUp(req.body);

//         const { firstName, lastName, email, password } = req.body;

//         // step 2 encypt the password
//         const hasedPassword = await bcrypt.hash(password, 10);

//         // check existense of user in database
//         const result = await User.findOne({ email: email });

//         if (result) {
//             return res.status(409).send("user already exist");
//         }

//         const newUser = new tempUser({
//             firstName,
//             lastName,
//             email,
//             password:hasedPassword
//         })
//         await newUser.save();
//         const respose = await sendOtpToEmail(email);
//         console.log(respose)
//         // creating new user
//         // const newUser = new User({
//         //     firstName,
//         //     lastName,
//         //     email,
//         //     password: hasedPassword
//         // });
//         // await newUser.save();
//         res.send("in signup");  
//     }
//     catch (err) {
//         return res.status(500).send(`SIGNUP FAILED :${err.message}`);
//     }

// });

// login
authRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password)


    try {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            return res.status(400).send('LOGIN FAILED: Invalid email format');
        }

        const user = await User.find({ email: email });
        console.log(user)
        if (!user) {
            throw new Error("Invalid Credentials");
        }

        const isPasswordCoorect = await bcrypt.compare(password, user[0].password);
        console.log(isPasswordCoorect)
        if (isPasswordCoorect) {
            // crate a token
            console.log(user[0]._id);
            const token = jwt.sign({ _id: user[0]._id }, "secretKey", { expiresIn: "7d" });

            // add token to the coockie and send the respose to user
            res.cookie('token', token);

            return res.status(200).send(user);

        } else {

            throw new Error("Invalid Credentials");
        }

    } catch (error) {
        return res.status(500).send(`LOGIN FAILED :${error.message}`);
    }

});

authRouter.post('/logout', async (req, res) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
    })

    return res.status(200).send("user is logout");
});



export default authRouter;