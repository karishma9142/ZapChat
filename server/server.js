import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import http from 'http';
import { conncetDb } from './lib/db.js';
import userRouter from './routes/userRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import { Server } from 'socket.io';

// Create express app and http server
const app = express();
const server = http.createServer(app);

// initialize socket.io server
export const io = new Server (server , {
    cors : {origin : "*"}
})

// store online users 
export const userSocketMap = {};

// socket.io connection handler
io.on("connection" , (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("user connected " , userId);

    if(userId){
        userSocketMap[userId] = socket.id;
    }

    // emit online user to all connected clints
    io.emit("getOnlineUsers" , Object.keys(userSocketMap));

    socket.on("disconnect" , ()=> {
        console.log("User disconnected" , userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers" , Object.keys(userSocketMap));
    })
})

// Middleware setup
app.use(express.json({limit : "4mb"}));
app.use(cors());

app.use("/api/status" , (req,res)=>{
    res.send("server is alive")
})

app.use("/api/auth" , userRouter);
app.use("/api/message" , messageRouter);  

// connect to db
await conncetDb();
if(process.env.NODE_ENV != "production"){
    const PORT = process.env.PORT || 5001;
    server.listen(PORT , ()=> console.log("server running on port " + PORT)); 
}
// export server for vercel
export default server;