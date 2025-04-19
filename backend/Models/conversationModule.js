import mongoose from "mongoose"; //importing mongoose

const conversationschema=new mongoose.Schema({
    participants:[{
        type:mongoose.Schema.Types.ObjectId, //this will take the user id
        ref:'User' //this will take the user data
    }], //this will take the participants of the conversation
    messages:[{
        type:mongoose.Schema.Types.ObjectId, //this will take the message id
        ref:'Message', //this will take the message
        default:[] //this will take the default value as empty array if there is no message 
    }]//this will take the messages of the conversation
},{timestamps:true}) //this will automatically create a timestamp for the data

const Conversation =mongoose.model('Conversation',conversationschema); //this will create a model for the conversation data

export default Conversation;