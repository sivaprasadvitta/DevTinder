import express from "express";
import userAuth from "../middlewares/auth.js";
import ConnectionRequest from "../models/connectionRequest.js";
import User from "../models/user.js";
import { validateConnectionRequest } from "../utils/validation.js";



const requestRouter = express.Router();

// connection request
requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id.toString(); 
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignored", "intrested"];

        if (!allowedStatus.includes(status)) {
            throw new Error("Invalid status");
        }

        // Prevent sending a connection request to oneself
        if (fromUserId === toUserId) {
            throw new Error("You can't send a connection request to yourself");
        }

        // Check if there is an existing connection request
        const existingRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId },
            ],
        });

        if (existingRequest) {
            throw new Error("Request already exists and is pending...");
        }

        // Check if the target user exists
        const toUser = await User.findById(toUserId);

        if (!toUser) {
            throw new Error("User not found");
        }

        // Create a new connection request
        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });

        const data = await connectionRequest.save();

        res.json({
            message: `${req.user.firstName} sent a connection request to ${toUser.firstName}`,
            data,
        });
    } catch (error) {
        res.status(500).send(`ERROR: ${error.message}`);
    }
});


// review connection request  675ea162943e16075744449f-siva
requestRouter.post('/request/review/:status/:requestId', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const { status, requestId } = req.params;

        const allowedStatus = ["accepted", "rejected"]; 

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        // Check if connection request exists
        const connectionRequest = await ConnectionRequest.findOne({
            fromUserId: requestId,
            toUserId: loggedInUser._id,
            status: "intrested" 
        });

        if (!connectionRequest) {
            return res.status(404).json({ message: "Connection request not found" });
        }

        // Update the status
        connectionRequest.status = status;

        const data = await connectionRequest.save();

        // Send a success response
        res.status(200).json({
            message: "Request reviewed successfully",
            data,
        });

    } catch (error) {
        res.status(500).send(`ERROR: ${error.message}`);
    }
});





export default requestRouter;
