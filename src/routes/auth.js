import express from "express";
import User from "../models/user.js";
import validateSignUp from "../utils/validation.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";





const authRouter = express.Router();

// signup
authRouter.post("/signup", async (req, res) => {
    try {
        // step 1 validation
        validateSignUp(req.body);

        const { firstName, lastName, email, password } = req.body;

        // step 2 encypt the password
        const hasedPassword = await bcrypt.hash(password, 10);

        // check existense of user in database
        const result = await User.findOne({ email: email });

        if (result) {
            res.status(409).send("user already exist");
        }



        // creating new user
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hasedPassword
        });
        await newUser.save();
        res.send("user added successfully");
    }
    catch (err) {
        res.status(500).send(`SIGNUP FAILED :${err.message}`);
    }

});

// login
authRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    // console.log(email, password)


    try {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            return res.status(400).send('LOGIN FAILED: Invalid email format');
        }

        const user = await User.find({ email: email });

        if (!user) {
            throw new Error("Invalid Credentials");
        }

        const isPasswordCoorect = await bcrypt.compare(password, user[0].password);

        if (isPasswordCoorect) {
            // crate a token
            console.log(user[0]._id);
            const token = jwt.sign({ _id: user[0]._id }, "secretKey", { expiresIn: "7d" });

            // add token to the coockie and send the respose to user
            res.cookie('token', token);

            res.status(200).send(user);

        } else {

            throw new Error("Invalid Credentials");
        }

    } catch (error) {
        res.status(500).send(`LOGIN FAILED :${error.message}`);
    }

});

authRouter.post('/logout', async (req, res) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
    })

    res.status(200).send("user is logout");
});



export default authRouter;