import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import {io , userSocketMap} from '../server.js'


// get all user except login user 
export const getUsersForSidebar = async (req, res) => {
    try {
        const userId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: userId } }).select("-password");

        // count number of message not seen 
        const unseenMessage = {};
        const promises = filteredUsers.map(async (user) => {
            const message = await Message.find({ senderId: user._id, receiverId: userId, seen: false })
            if (message.length > 0) {
                unseenMessage[user._id] = message.length;
            }
        })

        await Promise.all(promises);
        res.status(200).json({
            success: true,
            users: filteredUsers,
            unseenMessage: unseenMessage
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            msg: "internal server error"
        })
    }
}


// get all message for selected user

export const getMessages = async (req, res) => {
    try {
        const { id: selectedUserId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: selectedUserId },
                { senderId: selectedUserId, receiverId: myId }
            ]
        })

        await Message.updateMany({
            senderId: selectedUserId, receiverId: myId
        }, {
            seen: true
        });

        res.status(200).json({
            success: true,
            messages: messages
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            msg: "internal server error",
            success: false,
            error: error.message
        })
    }
}

// api to mark the message as seen using message id

export const markMessageAsSeen = async (req, res) => {
    try {
        const { id } = req.params;
        await Message.findByIdAndUpdate(id, { seen: true });

        res.status(200).json({
            success: true,
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            msg: 'internal server error',
            error: error.message
        })
    }
}

// send message to selected user 

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.user._id;
        const receiverId = req.params.id;
        const text = req.body.text;
        const image = req.body.image;

        let imageUrl ;
        if (image) {
            const response = await cloudinary.uploader.upload(image);
            imageUrl = response.secure_url;
        }

        const newMessage = await Message.create({
            senderId : senderId ,
            receiverId : receiverId ,
            text : text ,
            image :imageUrl
        })

        // emit the new message to the receiver 's socket
        const receiverSocketId = userSocketMap[receiverId];
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage" , newMessage)
        }
        res.status(200).json({
            success: true,
            newMessage: newMessage
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            msg: 'internal server error',
            error: error.message
        })
    }

}