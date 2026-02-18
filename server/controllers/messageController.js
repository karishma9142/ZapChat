import Message from "../models/Message";
import User from "../models/User";


// get all user except login user 
export const getUsersForSidebar = async (req,res) => {
    try {
        const userId = req.user._id;
        const filteredUsers = await User.find({_id : {$ne : userId}}).select("-password");

        // count number of message not seen 
        const unseenMessage = {};
        const promises =filteredUsers.map(async (user) => {
            const message = await Message.find({senderId : user._id , receiverId : userId , seen : false})
            if(message.length>0){
                unseenMessage[user._id] = message.length;
            }
        })

        await Promise.all(promises);
        res.status(200).json({
            success : true ,
            users : filteredUsers,
            unseenMessage : unseenMessage
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success : false,
            msg : "internal server error"
        })
    }
}


// get all message for selected user