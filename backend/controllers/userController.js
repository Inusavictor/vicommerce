import asyncHandler from '../middleware/asyncHandler.js'
import User from "../models/userModel.js";
import bcrypt from 'bcryptjs'
import { generateToken } from '../utils/generateToken.js';



//@desc Auth user and get token
//@route POST /api/users/login
//@access public
const authUser = asyncHandler(async (req, res) => {
   const {email, password} = req.body
    if (!email || !password) {
        res.status(400)
        throw new Error('Please fill in all fields')
    }
    const findUser = await User.findOne({email})
    if (!findUser) {
        res.status(401)
        throw new Error('User does not exist')
    }
  
    if (!await findUser.validatePassword(password)) {
        res.status(400)
        throw new Error('Wrong Password')
    }
    
    generateToken(res, findUser._id)

    res.json({_id: findUser._id, name: findUser.name, email: findUser.email, isAdmin: findUser.isAdmin})
    
 })


 //@desc Register user
//@route POST /api/users
//@access public
const registerUser = asyncHandler(async (req, res) => {
    const {name, email, password} = req.body
    if (!name || !email || !password) {
        res.status(401)
        throw new Error('Please fill in all fields')
    }
    //check if user exist
    const user = await User.findOne({email})
    if (user) {
        res.status(401)
        throw new Error('User Exists, Please use a different email')
    } 

    const newUser = await User.create({
        name, email, password
    })
    
    if (newUser) {

        generateToken(res, newUser._id)
        res.status(201).json({
            _id: newUser._id, name: newUser.name, email: newUser.email,
            isAdmin: newUser.isAdmin
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }

  })


//@desc Logout user and clear cookie
//@route POST /api/users/logout
//@access private
const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    })
    res.status(200).json({message: 'Logged out successfully'})
  })


//@desc Get user profile
//@route GET /api/users/profile
//@access private
const getUserProfile = asyncHandler(async (req, res) => {
    
    if (req.user){
    const {_id, name, email, isAdmin} =req.user
    res.status(200).json({
        _id, name, email, isAdmin
    })} else {
        res.status(404)
        throw new Error('User not found')
    }
   
  })


//@desc Update user profile
//@route PUT /api/users/profile
//@access private
const updateUserProfile = asyncHandler(async (req, res) => {
   const user = await User.findById(req.user._id)
   if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    if (req.body.password) {
        user.password = req.body.password
       }
    const updatedUser = await user.save()

    res.status(200).json({
        _id: updatedUser._id, name: updatedUser.name,
        email: updatedUser.email, isAdmin: updateUser.isAdmin
    })
} else {
    res.status(401)
    throw new Error('User not found')
}

   
  })


//@desc Get users
//@route GET /api/users/
//@access private admin
const getUsers = asyncHandler(async (req, res) => {
    res.send('get users')
  })


//@desc Delete user
//@route DELETE /api/users/:id
//@access private admin
const deleteUser = asyncHandler(async (req, res) => {
    res.send('delete users')
  })


//@desc Get user by ID
//@route GET /api/users/:ID
//@access private admin
const getUserByID = asyncHandler(async (req, res) => {
    res.send('get user by id')
  })


//@desc Update user
//@route PUT /api/users/:ID
//@access private admin
const updateUser = asyncHandler(async (req, res) => {
    res.send('update user')
  })


  export {
   getUsers, authUser, registerUser, logoutUser, getUserByID, getUserProfile, updateUser, updateUserProfile, deleteUser
  }