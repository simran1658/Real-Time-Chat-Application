import mongoose, { trusted } from "mongoose";
// this is the Schema for the user data(details of user)
const userSchema = new mongoose.Schema({
    fullname:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:8
    },
    gender:{
        type:String,
        required:true
    },
    profilePic:{
        type:String,
        required:true,
        default:""
    }
},{timestamps:true}); //this will automatically create a timestamp for the data

const User=mongoose.model('User',userSchema); //this will create a model for the user data

export default User; //this will export the user model