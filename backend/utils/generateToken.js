import jwt from "jsonwebtoken";

export const generateToken = (res, userId) => {

    const token = jwt.sign({userId},
        process.env.JWT_SECRET, {expiresIn: '30d'})

    //set jwt as http only cookie
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 30*24*3600*1000 //30days
    })
}