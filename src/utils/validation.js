import validator from "validator";
import User from "../models/user.js";
import ConnectionRequest from "../models/connectionRequest.js";


const validateSignUp = (user) => {
    const {firstName,lastName,email,password} = user;  
    
    if(!firstName || !lastName || !email || !password){
        throw new Error("All fields are required");
    }
    if(firstName.length < 3 || firstName.length > 20){
        throw new Error("first name contains min 3 and max 20 characters");
    }
    if(lastName.length < 3 || lastName.length > 20){
        throw new Error("last name contains min 3 and max 20 characters");
    }

    if(!validator.isEmail(email)){
        throw new Error(`Invalid email`);
    }

    if(!validator.isStrongPassword(password)){
        throw new Error(`Password is too weak`);
    }
    
}

export const validateProfileEditData = (req) => {
    const allowedUpdates = [
        "firstName",
        "lastName",
        "photoUrl",
        "aboutMe",
        "skills",
        "gender",
        "age",
    ];

    // Check if at least one field in the request body is allowed
    const isUpdateAllowed = Object.keys(req.body).some((field) =>
        allowedUpdates.includes(field)
    );

    return isUpdateAllowed;
};


export const validateConnectionRequest = async (fromUserId,toUserId,status) => {
    console.log(status,toUserId,fromUserId);

    
    // validate status
    const allowedStatus = ["ignored","intrested"];

    if(!allowedStatus.includes(status)){
        throw new Error("invalid status");
    }

    // check to user existed or not
    const toUser = await User.findById(toUserId);

    if(!toUser){
        throw new Error("toUser not found");
    }

    // already connected or sended request
    // is there any existing connection request
    const existingRequest = await ConnectionRequest.findOne({
        $or:[
            {fromUserId,toUserId},
            {fromUserId:toUserId,toUserId:fromUserId}
        ]
    });
    if(existingRequest){
        throw new Error("request already exist and pending...");    
    }

    // send connection to itself
    if(fromUserId === toUserId){
        throw new Error("cannot send connection to yourself");
    }

    // is mongo id valid

    if(!validator.isMongoId(toUserId)){
        throw new Error(`Invalid toUser url: ${toUserId}`);
    }


};




export default validateSignUp;