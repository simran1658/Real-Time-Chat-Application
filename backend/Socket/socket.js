import {Server} from "socket.io";
import http from "http";
import  express from "express";
import e from "express";

const app=express();
const server=http.createServer(app); // create a server using express 
const io=new Server(server,{
    cors:{
          origin:['http://localhost:5173'],
          methods:["GET","POST"],
    }
})

export const getReceiverSocketId=(ReceiverId)=>{
    return userSocketmap[ReceiverId];
};

const userSocketmap = {}; // {userId, socketId}

io.on('connection',(socket)=>{
    const userId=socket.handshake.query.userId; // get userId from client side

    if(userId!=="undefine"){
        userSocketmap[userId]=socket.id; // store the socket id in the map
    }
    io.emit("getOnlineUsers",Object.keys(userSocketmap)); // emit the online users to all clients

    socket.on('disconnect',()=>{
        delete userSocketmap[userId]; // remove the socket id from the map when user disconnects
        io.emit("getOnlineUsers",Object.keys(userSocketmap)); // emit the online users to all clients
    });
});

export {app,io,server}; // export the app, io and server for use in other files
