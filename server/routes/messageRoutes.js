import express from 'express'
import { auth } from '../middleware/auth';
import { getMessages, getUsersForSidebar, markMessageAsSeen, sendMessage } from '../controllers/messageController';

const messageRouter = express.Router();

messageRouter.get("/users" , auth , getUsersForSidebar);
messageRouter.get("/:id" , auth , getMessages);
messageRouter.put("mark/:id" , auth , markMessageAsSeen);
messageRouter.post("/send/:id" , auth , sendMessage);

export default messageRouter;