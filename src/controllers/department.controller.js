const Department = require('../models/department.model.js')
const mongoose = require('mongoose')

exports.create = (req, res) => {

    if(!req.body){
        return res.status(400).send({
            message: "Cannot save with a blank department details."
        })
    }

    console.log(req.body);

    const departmentObject = new Department({
       departmentName: req.body.departmentName
    })

    departmentObject.save()
    .then(data => {
        res.send(data)
    })
    .catch(err => {
        res.status(500).send ({
            message: `An error occurred while saving data: ${err.message}`
        })
    })
};

exports.findAll = (req, res) => {
    Department.find()
    .sort({ departmentName: 1})
    
    .then(departments => {
      res.send(departments);
    })
    .catch(err => {
        res.status(500).send({
            message: `An error occurred while pulling data: ${err.message}`
        })
    })

};

exports.findOne = (req, res) => {
    Department.findById(req.params.departmentID)
    .then(department => {
        if(!department){
            return res.status(404).send({
                message: `Department not found.`
            })
        }
        res.send(department);
    })
    .catch(err => {
        if(err.kind === 'ObjectId'){
            return res.status(404).send({
                message: `Department not found.`
            })
        }

        return res.status(500).send({
            message: `Something is wrong while pulling that data: ${err.message}`
        })
    })
};

exports.update = (req, res) => {
    if(!req.body){
        return res.status(400).send({
            message: "Cannot save with a blank department details."
        })        
    }

    Department.findByIdAndUpdate(
        req.params.departmentID,
        {
            "$set": {
                departmentName: req.body.departmentName
            }
        },
        { new: true }
    )
    .then(department => {
        if(!department){
            return res.status(404).send({
                message: `Department not found.`
            })
        }

        res.send(department)
    })
    .catch(err => {
        if(err.kind === 'ObjectId'){
            return res.status(404).send({
                message: `Department not found.`
            })
        }

        return res.status(500).send({
            message: `An error occurred while updating that department information: ${err.message}`
        })
    })
    
};

exports.validateDepartmentName = (req, res) => {

    if(req.params.departmentID !== 'new'){
        
        let oid = mongoose.Types.ObjectId(req.params.departmentID);     

            Department.find({
                    'departmentName' : req.body.departmentName,
                    '_id' : { $ne: oid } 
                }).then(r=>{
                    if(r.length>0)
                        return res.status(400).send({message: `That department name is taken.` })

                    return res.status(200).send({ message: `OK` })
                })
    }else{
        Department.findOne({
            'departmentName' : req.body.departmentName           
        }).then(r=>{
            if(r != null)
                return res.status(400).send({message: `${req.body.departmentName} is taken.`})

            return res.status(200).send({ message: `OK` })
        })        
    }

}