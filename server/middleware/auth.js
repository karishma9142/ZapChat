import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const auth = async (req, res, next) => {
    const token = req.headers.token;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(401).json({
                success : false ,
                msg: "unautherized"
            })
        }
        req.user = user;
        next();
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            msg : "internal sever error"
        })
    }
}