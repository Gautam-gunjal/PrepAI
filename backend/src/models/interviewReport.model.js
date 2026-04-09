const mongoose = require('mongoose');


const technicalQuestionSchema = new mongoose.Schema({
    question:{
        type:String,
        required:true
    },
    intention:{
        type:String,
        required:true
    },
    answer:{
        type:String,
        required:true
    }
},{
    _id:false
})

const behaviouralQuestionSchema = new mongoose.Schema({
    question:{
        type:String,
        required:true
    },
    intention:{
        type:String,
        required:true
    },
    answer:{
        type:String,
        required:true
    }
},{
    _id:false
})

const skillGapSchema = new mongoose.Schema({
    skills:{
        type:String,
        required:true
    },
    severity:{
        type:String,
        enum:['low','medium','high'],
        required:true
    }
},{
    _id:false
})

const preparationPlanSchema = new mongoose.Schema({
    day:{
        type:Number,
        required:true
    },
    focus:{
        type:String,
        required:true
    },
    tasks:[{
        type:String,
        required:true
    }]
},{
    _id:false
})

const InterviewReportSchema = new mongoose.Schema({
    resume:{
        type:String,
        default: ""
    },
    selfDescription:{
        type:String
    },
    jobDescription:{
        type:String,
        required:true
    },
    matchScore:{
        type:Number,
        min:0,
        max:100
    },

    technicalQuestions:[technicalQuestionSchema],
    behaviouralQuestions:[behaviouralQuestionSchema],
    skillGaps:[skillGapSchema],
    preparationPlan:[preparationPlanSchema],

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    },
    title: {
        type: String,
        required: [ true, "Job title is required" ]
    }
},{
    timestamps:true
})

const interviewModel = mongoose.model('InterviewReport',InterviewReportSchema)

module.exports = interviewModel;