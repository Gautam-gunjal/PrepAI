const usermodel = require('../models/user.model')
const tokenBlacklistModel = require('../models/blacklist.model')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

async function RegisterUser(req,res){
    const {username,email,password} = req.body;

    if(!username || !email || !password)
    {
        return res.status(400).json({
            message:'Please Provide username,password and email'
        })
    }

    const isAlreadyExist = await usermodel.findOne({email})

    if(isAlreadyExist)
    {
        return res.status(400).json({
            message:'Account already exists with this email'
        })
    }

    const hashpassword = await bcrypt.hash(password,10)

    const user = await usermodel.create({
        username,
        email,
        password:hashpassword
    })

    const token = jwt.sign({id:user._id,email:user.email},process.env.JWT_SECRET,{expiresIn:'1d'})  
    
    res.cookie("token",token)

    res.status(200).json({
        message:"User created successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })
}

async function LoginUser(req,res){
    const {email,password} = req.body;

    if(!email || !password){
        return res.status(400).json({
            message:'Please provide email and password'
        })
    }

    const user = await usermodel.findOne({email})

    if(!user){
        return res.status(400).json({
            message:"Invalid email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password,user.password)

    if(!isPasswordValid){
        return res.status(400).json({
            message:"Invalid email or password"
        })
    }

    const token = jwt.sign({id:user._id,email:user.email},process.env.JWT_SECRET,{expiresIn:"1d"})

    res.cookie("token",token);

    res.status(200).json({
        message:"User Logged in successfully",
        user:{
            id:user._id,
            email:user.email,
            username:user.username
        }
    })
}

async function logoutUser(req,res){
    const token = req.cookies.token;
    if(token){
        await tokenBlacklistModel.create({token})
    }

    res.clearCookie("token");

    res.status(200).json({
        message:'User logged out successfully'
    })
}

async function getMe(req,res){
    const user = await usermodel.findById(req.user.id)

    res.status(200).json({
        message:'User fetched successfully',
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })
}

module.exports = {RegisterUser,LoginUser,logoutUser,getMe}