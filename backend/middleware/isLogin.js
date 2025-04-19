import jwt from "jsonwebtoken"; // Importing jwt to generate token
import User from "../Models/usermodule.js";

const isLogin=async(req,res,next)=>{
    try {
        console.log(req.cookies.jwt);
        const token=req.cookies.jwt; //this will take the token from the cookie 
        console.log(token);
        if(!token){
            return res.status(500).send({success:false,message:"User unauthorize "}); //if the user is not authorized then it will send a message
        }
        const decode=jwt.verify(token,process.env.JWT_SECRET); //this will verify the token with the jwt secret
        if(!decode){
            return res.status(500).send({success:false,message:"User unauthorize:Invalid Token "}); //if the token is invalid then it will send a message
        }
        const user = await User.findById(decode.userId).select("-password"); //this will find the user by the user id
        if(!user) return res.status(500).send({success:false,message:"User not found"}); //if the user is not found then it will send a message
        req.user=user; //this will set the user as a request user
        next(); //this will move to the next function
        
    } catch (error){
        console.log(`error is isLogin middleware ${error.message}`);
        res.status(500).send({success:false,message:error}); //if there is an error then it will send a message 
    }
}

export default isLogin;