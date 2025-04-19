import Conversation from "../Models/conversationModule.js";
import User from "../Models/usermodule.js";

export const getUserBySearch=async(req,res)=>{
    try {
        const search =req.query.search || ""; //this will take the search query from the frontend
        const currentuserID=req.user._id; //this will take the user id from the user
        const user=await User.find({
            $and:[{ //this will check the username and fullname of the user
                $or:[
                    {username:{$regex:'.*'+search+'.*',$options:"i"}}, //this will check the username of the user and if it is not found then it will return an empty string
                    {fullname:{$regex:'.*'+search+'.*',$options:"i"}} //this will check the fullname of the user and if it is not found then it will return an empty string
                ]
            },
                {_id:{$ne:currentuserID}} //this will check the user id and if it is not found then it will return an empty string
        ]
        }).select("-password").select("email")

        res.status(200).send(user); //this will send the user data to the frontend


    } catch (error) {
        res.status(500).send //if there is an error then it will send a message
        ({
            success:false,
            message:error
        }); 
        console.log(error);
    }
}

export const getCurrentChatters = async (req, res) => {
    try {
        const currentuserID = req.user._id; // Get current user's ID from the request
        const currentchatters = await Conversation.find({
            participants: currentuserID
        }).sort({
            updatedAt: -1
        });

        // If there are no current chatters, return an empty array
        if (!currentchatters || currentchatters.length === 0) {
            return res.status(200).send([]);
        }

        // Get an array of all participants IDs, excluding the current user
        const participantsids = currentchatters.reduce((ids, conversation) => {
            const otherParticipants = conversation.participants.filter(id => id.toString() !== currentuserID.toString());
            return [...ids, ...otherParticipants];
        }, []);

        // Remove any duplicate IDs
        const uniqueParticipantsIDS = [...new Set(participantsids)];

        // Fetch users corresponding to the participant IDs
        const users = await User.find({
            _id: { $in: uniqueParticipantsIDS }
        }).select("-password -email");

        // Create a map of users by their _id for efficient lookup
        const usersMap = users.reduce((map, user) => {
            map[user._id.toString()] = user;
            return map;
        }, {});

        // Map the participant IDs to their corresponding user details
        const usersWithDetails = uniqueParticipantsIDS.map(id => usersMap[id.toString()]);

        // Send the user details in the response
        res.status(200).send(usersWithDetails);
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
        console.log(error);
    }
};
