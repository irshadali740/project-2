const collegeModel = require("../models/collegeModel")
const interModel = require("../models/internModel")

//<-----------This is used for Validation of Attributes-------------------->//

let valid = function (value) {
    if (typeof value == "undefined" || typeof value == null || typeof value == "number" || value.trim().length == 0) {
        return false
    }
    if (typeof value == "string") {
        return true
    }
    return true
}

//<------------------This function is used for Creating a college----------------->//
const createCollege = async function (req, res) {

    try {
        let college = req.body
        //<------Checking Whether Request Body is empty or not----------->//0
        if (!(college.name && college.fullName && college.logoLink)) {
            return res.status(400).send({ status: false, msg: "All fields are mandatory." })
        }

        //<-------Validation of  Name----------->//
        if (!valid(college.name)) return res.status(400).send({ status: false, message: "Please Use Alphabets in  name" })
        let name = /^[A-Za-z ]+$/.test(college.name.trim())
        if (!name) return res.status(400).send({ status: false, msg: "Please Use Alphabets in name" })
        //<-------Validation of name----------->//
        let nameValidation = college.name
        let duplicate = await collegeModel.findOne({ name: nameValidation })
        if (duplicate) return res.status(400).send({ status: false, msg: "Name Already Exist." })
        //<-------Validation of fullName----------->//
        if (!valid(college.fullName)) return res.status(400).send({ status: false, message: "Please Use Alphabets in fullName" })
        name = /^[A-Za-z ]+$/.test(college.fullName)
        if (!name) return res.send({ status: false, message: "Please Use Alphabets in fullName" })

        //<-------Validation of logolink----------->//
        if (!valid(college.logoLink)) return res.status(400).send({ status: false, message: "Please enter logoLink" })
        //  name=/^[A-Za-z]+$/.test(college.logoLink)
        //  if(!name) return res.send({ status: false, message: "Please enter logoLink"  })

        //<-------Creation Creation----------->//

        let collegeCreated = await collegeModel.create(college)
        res.status(201).send({ status: true, data: collegeCreated })

    } catch (err) {
        return res.status(500).send({ msg: err.message })
    }
}

module.exports.createCollege = createCollege