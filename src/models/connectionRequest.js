import mongoose from "mongoose";

// define connection between two users

const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    status:{
        type:String,
        required:true,
        enum:{
            values:["pending","ignored","intrested","accepted","rejected"],
            message:"{VALUE} is invalid status"
        },
        default:"pending"
    }
},{timestamps:true});

// compound index
connectionRequestSchema.index({fromUserId:1,toUserId:1});

const ConnectionRequest = mongoose.model("ConnectionRequest",connectionRequestSchema);

export default ConnectionRequest; 