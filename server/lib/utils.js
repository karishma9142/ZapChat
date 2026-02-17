import jwt from 'jsonwebtoken';

// function to genrate a token for user
export const genrateToken = async (userId) => {
    const token = jwt.sign({userId} , process.env.JWT_SECRET);
    return token;
}