import express from 'express'
import userAuth from "../middlewares/auth.js";
import crypto from 'crypto'
import Otp from '../models/otp.model.js'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv';
dotenv.config();
import User from '../models/user.js';
import tempUser from '../models/tempUser.model.js';

console.log(process.env.NODEMAILER_PASS)

const otpRouter = express.Router();

const transporter = nodemailer.createTransport({
    service: 'gmail', // Use 'gmail' as the service
    auth: {
        user: 'sivaprasad.vitta@gmail.com', // Your Gmail address
        pass: process.env.NODEMAILER_PASS,  // App password from Gmail
    },
});

export const sendOtpToEmail = async (email) => {
    if (!email) {
        return 'Email is required';
    }

    const otp = crypto.randomInt(100000, 999999); // Generate 6-digit OTP

    try {
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP expiry time (5 minutes)

        // Store OTP in the database
        await Otp.create({ email, otp, expiresAt });

        // Send OTP via email
        await transporter.sendMail({
            from: "devTinder",
            to: email,
            subject: "Your OTP Code",
            text: `For verification purposes, your OTP is ${otp}. It is valid for 5 minutes.`,
            html: `<p>Your OTP code is <b>${otp}</b>. It is valid for 5 minutes.</p>`,
        });

        return "OTP sent successfully";
    } catch (error) {
        console.error(error);
        return 'Failed to send OTP';
    }
};

// otpRouter.post('/send-otp', async (req, res) => {
//     const { email } = req.body;
//     // const email = "itsmesiva001@gmail.com";

//     if (!email) {
//         return res.status(400).json({ error: 'Email is required' });
//     }

//     const otp = crypto.randomInt(100000, 999999);

//     try {
//         const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
//         // store otp in database
//         await Otp.create({ email, otp, expiresAt });

//         // sending mail to user
//         await transporter.sendMail({
//             from: "devTinder",
//             to: email,
//             text: `For verification purpose sended otp ${otp}. It is valid for 5 minutes.`,
//             html: `<p>Your OTP code is <b>${otp}</b>. It is valid for 5 minutes.</p>`,
//         })

//         return res.status(200).json({ message: "OTP sent successfully" });
//     } catch (error) {
//         console.log(error)
//         return res.status(500).json({ error: 'Failed to send OTP' });
//     }
// })

otpRouter.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    console.log("Request Email:", email);
    console.log("Request OTP:", otp);


    // Validate input
    if (!email || !otp) {
        console.log("Email or OTP missing");
        return res.status(400).json({ error: 'Email and OTP are required' });
    }

    try {
        // Find the OTP record for the given email and OTP
        const record = await Otp.findOne({ email:email, otp:otp }).sort({ createdAt: -1 });
        console.log("OTP Database:"+record);
        if (!record) {
            console.log("No matching OTP record found");
            return res.status(400).json({ error: 'Invalid OTP or email' });
        }

        // Check OTP expiration
        // if (new Date() > new Date(record.expiresAt)) {
        //     console.log("OTP expired");
        //     return res.status(400).json({ error: 'OTP has expired' });
        // }

        // Check if the email already exists in the permanent users collection
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("Email already registered");
            return res.status(400).json({ error: 'Email is already registered' });
        }

        // Retrieve the temporary user associated with this email
        const tempUserRecord = await tempUser.findOne({ email });
        if (!tempUserRecord) {
            console.log("No temporary user found for this email");
            return res.status(400).json({ error: 'No temporary user found' });
        }

        // Create the permanent user
        const newUser = new User({
            firstName: tempUserRecord.firstName,
            lastName: tempUserRecord.lastName,
            email: tempUserRecord.email,
            password: tempUserRecord.password,
        });
        await newUser.save();

        // Delete OTP and temporary user records
        await Promise.all([
            Otp.deleteMany({ email }),
            tempUser.deleteOne({ email }),
        ]);

        console.log("OTP verified and user created successfully");
        return res.status(200).json({ message: 'OTP verified successfully and user registered' });
    } catch (error) {
        console.error("Error verifying OTP:", error);
        return res.status(500).json({ error: 'Failed to verify OTP' });
    }
});







export default otpRouter;

