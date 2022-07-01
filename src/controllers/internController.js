let validator = require('validator'); //require validator form npm
const mongoose = require('mongoose'); //require mongoose form mongoose
const collegeModel = require("../models/collegeModel")
const internModel = require("../models/internModel");
const { default: isEmail } = require('validator/lib/isemail');

const ObjectId = mongoose.Types.ObjectId;
//<----------------------------create a fucntion for checking up typeof and lenghth----------------->//

let isvalid = function (value) {
    if (typeof value == "undefined" || typeof value == null || typeof value === "number" || value.trim().length == 0) {
        return false
    }
    if (typeof value == "string") {
        return true
    }
    return true
}
//<---------------------------------define callback function for mobilePhone----------------------->//
let isValidMobile = function (number) {
    let mobileRegex = /^[6-9]{1}[0-9]{9}$/;
    return mobileRegex.test(number);
}
//<--------------------------------createInter route handler------------------------------>//
const createintern = async function (req, res) {
    try {
        let data = req.body
        //<------Checking Whether Request Body is empty or not----------->//
        if (!(data.name && data.email && data.mobile)) {
            return res.status(400).send({ status: false, message: "All fields are mandatory." })
        }

        //----------------------------------------//
        if (Object.keys(data).length <= 0)
            return res.status(400).send({ status: false, message: "please provide data" })

        let collegeName = req.body.collegeName
        if (!collegeName) return res.status(400).send({ status: false, message: "Please provide the college name" })
        let Validation = /^[A-Za-z ]+$/.test(collegeName.trim())
        if (!Validation) return res.status(400).send({ status: false, message: "Please Use Alphabets in college name" })

        collegeName.toLowerCase();

        if (!data.name)
            return res.status(400).send({ status: false, message: "please provide name" })
        let Valid = /^[A-Za-z ]+$/.test(data.name.trim())
        if (!Valid) return res.status(400).send({ status: false, message: "Please Use Alphabets in name" })

        if (!isvalid(data.name))
            return res.status(400).send({ status: false, message: "please provide alphabetic character" })

        if (!data.email)
            return res.status(400).send({ status: false, message: "please provide email" })
        if (!isEmail(data.email))
            return res.status(400).send({ status: false, message: "please input proper format - eg'name@gmail.com'" })

        let emailCheck = await internModel.findOne({ email: data.email })
        if (emailCheck)
            return res.status(400).send({ status: false, message: "This email-Id is already use" })

        if (!data.mobile)
            return res.status(400).send({ status: false, message: "please provide mobile" })
        if (!isValidMobile(data.mobile))
            return res.status(400).send({ status: false, message: "please input 10 digit number" })
        let mobileNumberCheck = await internModel.findOne({ mobile: data.mobile })
        if (mobileNumberCheck)
            return res.status(400).send({ status: false, message: "Mobile number already use" })


        let collegeNamecheck = await collegeModel.findOne({ name: collegeName })

        if (!collegeNamecheck)
            return res.status(400).send({ status: false, message: "college name does't exits" })

        // let collegedata = collegeNamecheck._id;

        data.collegeId = collegeNamecheck._id;

        let saveData = await internModel.create(data)

        res.status(201).send({ status: true, data: saveData })
    }
    catch (error) {
        console.log(error.message)
        res.status(500).send({ status: false, message: error.message })

    }
}

const getInterns = async function (req, res) {
    try {
        let query = req.query.collegeName
        if (!query) return res.status(400).send({ status: false, message: "Please provide the college name" })
        query.toLowerCase();

        let Validation = /^[A-Za-z ]+$/.test(query.trim())
        if (!Validation) return res.status(400).send({ status: false, message: "Please Use Alphabets in college name" })

        let getDetails = await collegeModel.findOne({ name: query }).select({ name: 1, fullName: 1, logoLink: 1, _id: 1 })
        if (!getDetails) return res.status(400).send({ status: false, message: "No such college found" })

        let collegeId = getDetails._id


        let internDetails = await internModel.find({ collegeId: collegeId }).select({ name: 1, email: 1, mobile: 1 })
        if (internDetails.length == 0) return res.status(400).send({ status: false, message: `no interns found in ${query}` })

        let name = getDetails.name;
        let fullName = getDetails.fullName;
        let logoLink = getDetails.logoLink;

        let collegeData = {
            name: name,
            fullName: fullName,
            logoLink: logoLink,
            intern: internDetails
        }
        res.status(200).send({ status: true, data: collegeData })
    }
    catch (error) {
        console.log(error.message)
        res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = {
    createintern,
    getInterns
}


// const getInternswithcollege = async function(req, res){
    //     let requestedQuery = req.query
    //     let collegename = await collegeModel.findOne(requestedQuery).select({name:1,fullName:1,logolink:1})
    //     let collegeandintern= await internModel.find({collegeId: collegename._id}).select({_id:1,name:1,email:1,mobile:1})
        
    //     let fulldata = {
    //           name: collegename.name,
    //           fullName: collegename.fullName,
    //           logolink: collegename.logoLink,
    //           intern: collegeandintern
    //     }
    
    //     res.status(200).send({status: true, data: fulldata})
    
    
    
    // }
    


