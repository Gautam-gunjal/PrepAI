const mongoose = require('mongoose');

const userschema = new mongoose.Schema({
    username:{
        type:String,
        unique:[true,'Username already taken'],
        required:true
    },
    email:{
        type:String,
        unique:[true,'Email already Taken'],
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

const usermodel = mongoose.model("users",userschema);

module.exports = usermodel;