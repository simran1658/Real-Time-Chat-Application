import Message from "../Models/messageSchema.js";
import Conversation from "../Models/conversationModule.js";
import { getReceiverSocketId,io } from "../Socket/socket.js";

export const sendMessage = async(req,res)=>{
    try {
        const {message}=req.body;
        const {id:ReceiverId}=req.params; //this will take the receiver id from the parameter 
        const SenderId=req.user._id; // this will take the sender id from the user;
        

        if (!SenderId) {
            return res.status(401).json({ success: false, message: "Unauthorized: Sender ID missing" });
        }

        if (!message || message.trim() === "") {
            return res.status(400).json({ success: false, message: "Message content is required" });
          }

        let chats=await Conversation.findOne({
            participants:{$all:[SenderId,ReceiverId]} //this will find the conversation by the participants id 
        })
        


        if(!chats){
            chats=await Conversation.create({
                participants:[SenderId,ReceiverId] //this will create a conversation by the participants id
            });
        }

        const newMessages= new Message({
            SenderId,
            ReceiverId,
            message,
            conversationId:chats._id //this will take the conversation id from the chats 
        })

        if(newMessages){
            chats.messages.push(newMessages._id)
        }

        await Promise.all([chats.save(),newMessages.save()]); //this will save the chats and newMessages in the database together


        //Socket.IO function to send message
        const receiverSocketId = getReceiverSocketId(ReceiverId); //this will get the receiver socket id from the socket.js file
        if(receiverSocketId){ //this will check if the receiver socket id is available or not
            io.to(receiverSocketId).emit("newMessage",newMessages); //this will emit the new message to the receiver socket id
        }

        res.status(200).send(newMessages)
    } catch (error) {
        console.error("Error in sendMessage:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
    
}
export const getMessage = async(req,res)=>{
    try {
        const {id:ReceiverId}=req.params; //this will take the receiver id from the parameter 
        const SenderId=req.user._id; 

        const chats =await Conversation.findOne({
            participants:{$all:[SenderId,ReceiverId]}
        }).populate("messages")

        if(!chats) return res.status(200).send([]);
        const messages=chats.messages;
        res.status(200).send(messages)

    } catch (error) {
        console.error("Error in sendMessage:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}