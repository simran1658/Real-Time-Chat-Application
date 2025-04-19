import dotenv from "dotenv";
dotenv.config({ path: "./backend/.env" });

import path from "path";
import express from "express";
import dbconnect from "./DB/dbconnect.js";
import authRouter from "./route/authUser.js";
import messageRouter from "./route/messageRout.js"; 
import cookieParser from "cookie-parser";
import userRoute from "./route/userroute.js";
import {app,server} from'./Socket/socket.js'; // import the app and server from socket.js

const __dirname = path.resolve(); // this will give the current directory name

app.use(express.json()); //this will convert the data into json format
app.use(cookieParser()); //this will parse the cookie data into json format 

app.use('/api/auth',authRouter) // from this we can access the register or authRouter from the authUser.js file
app.use('/api/message',messageRouter) // from this we can access the messageRouter from the messageRout.js file
app.use('/api/user',userRoute) // from this we can access the userRoute from the userRoute.js file

app.use(express.static(path.join(__dirname, "/frontend/dist"))); // this will give the path of the build folder of the frontend

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend/dist/index.html")); // this will give the path of the index.html file of the frontend
}); 


//instead of writing multiple request response function( for login, register, logout, data receiving) we can just create a router and use it in the index.js file
app.get("/", (req, res) => {
    res.send("Hello World");
});

const PORT = process.env.PORT || 3000; // if the port is not available then it will run on 3000
server.listen(PORT, () => {
  dbconnect();
  console.log(`Server is running on port ${PORT}`); 
});
