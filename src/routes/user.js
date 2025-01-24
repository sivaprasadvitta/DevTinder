import express from "express";
import ConnectionRequest from "../models/connectionRequest.js";
import userAuth from "../middlewares/auth.js";
import User from "../models/user.js";


const userRouter = express.Router();
const SAFE_DATA = ["firstName","lastName","photoUrl","age","gender","aboutMe","skills"];

// get all the pending connection requests of the logged in user
userRouter.get('/user/requests/received', userAuth, async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        console.log(loggedInUserId);

        const result = await ConnectionRequest.find({
            toUserId: loggedInUserId, 
            status: "intrested" 
        }).populate("fromUserId",SAFE_DATA); //without query get all the data of the user

        res.status(200).json({
            success: true,
            message: "Connection requests",
            result,
        });
    } catch (error) {
        res.status(500).send(`ERROR: ${error.message}`);
    }
});

// get who are connected with the logged in user
userRouter.get('/user/connections', userAuth, async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        // Fetch all accepted connections for the logged-in user
        const result = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUserId, status: "accepted" },
                { fromUserId: loggedInUserId, status: "accepted" }
            ]
        })
            .populate("fromUserId", SAFE_DATA) // Populate sender details
            .populate("toUserId", SAFE_DATA); // Populate recipient details

        // Map the result to get the other user's details in each connection
        const data = result.map((row) => {
            if (row.fromUserId._id.toString() === loggedInUserId.toString()) {
                // If the logged-in user is the sender, return the recipient
                return row.toUserId;
            } else {
                // If the logged-in user is the recipient, return the sender
                return row.fromUserId;
            }
        });

        res.status(200).json({
            success: true,
            message: "Connections retrieved successfully",
            data,
        });
    } catch (error) {
        res.status(500).send(`ERROR: ${error.message}`);
    }
});

// feed
userRouter.get('/feed',userAuth,async(req,res)=>{
    try{
        // user see all cards expcepr
        // 0. own card
        // 1. his connections
        // 2. people already ignore
        // 3. already send the request

        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ?50 :limit;
        
        const skip = (page-1)*limit;

        const connectionRequests = await ConnectionRequest.find({
            $or:[{fromUserId:loggedInUser._id},{toUserId:loggedInUser._id}]
        }).select("fromUserId toUserId");

        const hideUserFromFeed = new Set();

        connectionRequests.forEach((req)=>{
            hideUserFromFeed.add(req.fromUserId.toString());
            hideUserFromFeed.add(req.toUserId.toString());
        });

        console.log(hideUserFromFeed);

        const users = await User.find({
            $and:[
                {_id:{$nin: Array.from(hideUserFromFeed)}},
                {_id:{$ne:loggedInUser._id}},
            ]
        }).select(SAFE_DATA).skip(skip).limit(limit)

        res.send(users);

    }catch(error){
        res.send(401).json({message:error.message})
    }
})





export default userRouter;
