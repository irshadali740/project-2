const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({

    name:{
        type:String,
        require:true,
        unique:true,
        trim:true,
        lowercase: true
    },
    fullName:{
        type:String,
        require:true,
        trim:true
    },
    logoLink:{
        type: String,
        required: true,
        trim:true
    },
    isDeleted:{
        type:Boolean,
        default:false,
        trim:true
    }


}, { timestamps: true });

module.exports = mongoose.model('College', collegeSchema)