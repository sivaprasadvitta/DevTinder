import jwt from "jsonwebtoken";
import User from "../models/user.js";
import dotenv from "dotenv";
dotenv.config();

const userAuth = async (req, res, next) => {
    const token = req.cookies.token;  
    // console.log(token);

    try {
        // Check if token exists
        if (!token) {
            return res.status(401).send("Please login")
            // throw new Error("Token not found");
        }

        // Get the user id based on the token
        const _id = await jwt.verify(token, "secretKey"); 

        // Get the user
        const user = await User.findById(_id);

        if (!user) {
            throw new Error("User not found");
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).send(`Unauthorized :${error.message}`);
    }
};

export default userAuth;
