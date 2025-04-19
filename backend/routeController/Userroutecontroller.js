import User from "../Models/usermodule.js"; //this will import the user model from the usermodule.js file
import bcryptjs from "bcryptjs"; //this will import the bcryptjs for hashing the password
import jwtToken from "../utils/jwtWebToken.js"; //this will import the jwtToken function from the jwtWebToken.js file


export const UserRegister=async(req,res)=>{ //this is the function to register the user
    try {
        const {fullname,username,email,gender,password,profilePic}=req.body; //this will take the data from the frontend
        const user = await User.findOne({ username: req.body.username }); //this will check if the user is already registered or not by checking the username
        if(user){
            return res.status(500).send({success:false,message:"Username or email already exists"}); //if the user is already registered then it will send a message
        }

        const hashPassword= bcryptjs.hashSync(password,8);//this will hash the password
        const profileBoy=profilePic||`https://avatar.iran.liara.run/public/boy?username=${username}`; //this will create a profile picture for the unique user as boy
        const profileGirl=profilePic || `https://avatar.iran.liara.run/public/girl?username=${username}`; //this will create a profile picture for the unique user as girl
        
        const newUser=new User({
            fullname,
            username,
            email,
            password:hashPassword, //this will save the hashed password
            gender,
            profilePic: gender=== "male" ? profileBoy:profileGirl //this will check gender and assign the profile picture accordingly
        })

        if(newUser){
            await newUser.save(); //this will save the new user data in the database
            jwtToken(newUser._id,res); //this will generate a token for the user id and send it to the user as a cookie 
        }
        else{
            res.status(500).send({success:false,message:"User not registered or invalid user data "}); //if the user is not registered then it will send a message
        }
        res.status(201).send({
            success:true,
            _id: newUser._id, //this will send the user id
            fullname: newUser.fullname, //this will send the user fullname
            username: newUser.username,//this will send the username
            profilePic: newUser.profilePic, //this will send the profile picture
            email: newUser.email, 
        })
    } catch (error) {
        res.status(500).send({success:false,message:error}); //if there is an error then it will send a message
        console.log(error);
    }
}


export const UserLogin=async(req,res)=>{
    try {
        // console.log("login successfully");
        const {email,password}=req.body; //it will take the email and password from frontend
        if (!email || !password) {
            return res.status(400).send({ success: false, message: "Email and password are required." });
        }
        const user = await User.findOne({ email: req.body.email }); //this will check if the user is already registered or not by checking the username
        if(!user){
            return res.status(500).send({success:false,message:"Username not found "}); //if the user is already registered then it will send a message
        } 
        if (!user.password) {
            return res.status(500).send({ success: false, message: "User has no password stored." });
        }
        const comparepass= bcryptjs.compareSync(password,user.password || ""); //this will compare the password with the user password and if it is not found then it will return an empty string
        if(!comparepass)
            return res.status(500).send({success:false,message:"password doesn't match"}); // if comparepass does'nt match with user password then it will return a message that password doesnt match

        jwtToken(user._id,res);// it will create a webtoken for user

        res.status(200).send({
            _id: user._id, //this will send the user id
            fullname: user.fullname, //this will send the user fullname
            username: user.username,//this will send the username
            profilePic: user.profilePic, //this will send the profile picture
            email: user.email, //this will send the email
            message:"Sucessfully Login"
        })
    } catch (error) {
        res.status(500).send({success:false,message:error}); //if there is an error then it will send a message
        console.log(error);
    }
}

export const UserLogout=async(req,res)=>{
    try {
        res.cookie('jwt','',{
            maxAge:0
        })
        res.status(200).send({success:true,message:"Logout Successfully"}); //if the user is logged out then it will send a message
    } catch (error) {
        res.status(500).send({success:false,message:error}); //if there is an error then it will send a message
        console.log(error);
    }
}
