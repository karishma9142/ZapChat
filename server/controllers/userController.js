import { genrateToken } from '../lib/utils';
import User from '../models/User';
import bcrypt from 'bcryptjs'

// Sign up a new user
export const signup =async (req,res) => {
    const fullName = req.body.fullName;
    const email = req.body.email;
    const password = req.body.password;
    const bio = req.body.bio;

    try {
        if(!fullName || !email || !password || !bio){
            return res.json({
                success : false ,
                msg : "missing feilds"
            })
        }
        const user = await User.findOne({email});
        if(user){
            return res.json({
                success : false ,
                msg : "user already exists"
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password , salt);
        const newUser = await User.create({
            fullName : fullName ,
            email : email ,
            password : hashedPassword,
            bio : bio
        })

        const token = genrateToken(newUser._id);

        return res.status(200).json({
            success : true ,
            userData : newUser , 
            msg : "Signed up succesfully",
            token : token
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success : false ,
            msg : error.message
        })
    }
}




// login user


export const login = async (req,res) => {
    const {email , password } = req.body;

    try {
        if(!email || !password){
            return res.status(400).json({
                success : false ,
                msg : "missing feilds"
            })
        }
        const foundUser = await User.findOne({email});
        if(!foundUser){
            return res.status(404).json({
                success : false , 
                msg : "user not found"
            })
        }
        const isPasswordCorrect = bcrypt.compare(password , foundUser.password);
        if(!isPasswordCorrect){
            return res.status(401).json({
                success : false , 
                msg : "wrong password"
            })
        }

        const token = genrateToken(foundUser._id)
        return res.status(200).json({
            success : true ,
            mag : "Signed in succesfully",
            userData : foundUser ,
            token : token
        })
    } catch (error) {
        console.log(error.message);
        return res.status(200).json({
            success : false ,
            mag : error.message 
        })
    }
}

// controller to cheak if user is authenticated

export const cheakAuth = (req , res) => {
    res.json({
        success : true , 
        user : req.user
    })
}