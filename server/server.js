import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import http from 'http';
import { conncetDb } from './lib/db.js';
import userRouter from './routes/userRoutes.js';

// Create express app and http server
const app = express();
const server = http.createServer(app);

// Middleware setup
app.use(express.json({limit : "4mb"}));
app.use(cors());

app.use("/api/status" , (req,res)=>{
    res.send("server is alive")
})

app.use("/api/auth" , userRouter);

// connect to db
await conncetDb();
const PORT = process.env.PORT || 5001;
server.listen(PORT , ()=> console.log("server running on port " + PORT));