let validator = require('validator'); //require validator form npm
const mongoose = require('mongoose'); //require mongoose form mongoose
const collegeModel = require("../models/collegeModel")
const internModel = require("../models/internModel");
const { find } = require('../models/collegeModel');
const ObjectId = mongoose.Types.ObjectId;
//<----------------------------create a fucntion for checking up typeof and lenghth----------------->//

const isvalid = function (value) {
    if (!value || typeof value != "string" || value.trim().length == 0) return false
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
        let collegeName = req.body.collegeName

        if (Object.keys(data).length <= 0)
            return res.status(400).send({ status: false, msg: "please provide data" })

        if (!data.name)
            return res.status(400).send({ status: false, msg: "please provide name" })
        if (!isvalid(data.name))
            return res.status(400).send({ status: false, msg: "please provide alphabetic character" })

        if (!data.email)
            return res.status(400).send({ status: false, msg: "please provide email" })
        if (!validator.isEmail(data.email))
            return res.status(400).send({ status: false, msg: "please input proper format - eg'name@gmail.com'" })

        let emailCheck = await internModel.findOne({ email: data.email })
        if (emailCheck)
            return res.status(400).send({ status: false, msg: "This email-Id is already use" })

        if (!data.mobile)
            return res.status(400).send({ status: false, msg: "please provide mobile" })
        if (!isValidMobile(data.mobile))
            return res.status(400).send({ status: false, msg: "please input 10 digit number" })
        let mobileNumberCheck = await internModel.findOne({ mobile: data.mobile })
        if (mobileNumberCheck)
            return res.status(400).send({ status: false, msg: "Mobile number already use" })

            
        let collegeNamecheck = await collegeModel.findOne({ name: collegeName })
       
        if (!collegeNamecheck)
            return res.status(400).send({ status: false, msg: "college name does't exits" })

        let collegedata = collegeNamecheck._id;
        // let Objectid = mongoose.Types.ObjectId(collegedata)
        // console.log(Objectid );
        data.collegeId =  collegedata
        
        let saveData = await internModel.create(data)
      console.log(saveData );
        res.status(201).send({ status: true, data: saveData })
    }
    catch (error) {
        console.log(error.message)
        res.status(500).send({ status: false, msg: error.message })

    }
}

const  getInterns = async function (req, res){
try {
    let query = req.query
    let getDetails = await collegeModel.findOne(query).select({name:1,fullName:1,logoLink:1,_id:1})
    let collegeId=getDetails._id
    let internDetails = await internModel.find({collegeId:collegeId}).select({name:1,email:1,mobile:1})
    let name = getDetails.name;
    let  fullName = getDetails.fullName;
    let  logoLink = getDetails.logoLink;

    let  collegeData ={
        name:name,
        fullName:fullName,
        logoLink:logoLink,
        intern:internDetails
    }
     
   res.status(200).send({ status: true, data: collegeData})
}  
catch (error) {
    console.log(error.message)
    res.status(500).send({ status: false, msg: error.message })
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
    
