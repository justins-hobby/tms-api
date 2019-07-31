const Employee = require('../models/employee.model.js')
const Terminals = require('../models/terminal.model')
const mongoose = require('mongoose')

exports.findAll = (req, res) => {
    Employee.aggregate([
        {
            $lookup: {
                from: "departments",
                localField: "departmentID",
                foreignField: "_id",
                as: "employee_department"
            }
        }
    ])
        .sort({ firstName: 1, lastName: 1, terminalNumber: -1 })
        .then(e => { res.send(e) })
        .catch(error => {
            res.status(500).send({
                message: `An error occurred while pulling data: ${error.message}`
            })
        })
};

exports.findOne = (req, res) => {
    Employee.findById(req.params.employeeID)
        .then(employee => {
            if (!employee) {
                return res.status(404).send({
                    message: `Employee not found.`
                })
            }
            res.send(employee);
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: `Employee not found.`
                })
            }

            return res.status(500).send({
                message: `Something is wrong while pulling that employee: ${err.message}`
            })
        })
};

exports.findBarcode = (req, res) => {

    Employee.findOne({
        barcodeNumber: req.params.barcodeNumber
    }).exec(function (err, employee) {
        if (err)
            return res.status(404).send({
                message: `${req.params.barcodeNumber} not found on database.`
            })

        if (employee != null) {
            Terminals.findOne({
                employeeID: employee._id
            }).exec(function (error, terminal) {
                if (error)
                    return res.status(404).send({
                        message: `${req.params.barcodeNumber} not found on database.`
                    })

                res.status(200).send({
                    employee,
                    terminal
                })
            })
        } else {
            return res.status(404).send({
                message: `${req.params.barcodeNumber} not found on database.`
            })
        }
    });




    /*
    Employee.findOne({
        'barcodeNumber': req.params.barcodeNumber
    })
        .then(barcode => {
            if (!barcode)
                return res.status(404).send({
                    message: `Barcode Number not found on database.`
                })

            res.send(barcode)
        })
        .catch(error => {
            return res.status(500).send({
                message: `Something is wrong: ${err.message}`
            })
        })    
       
    */


    /*
            Employee.aggregate(
                [
                    {
                        "$project" : {
                            "employeeName" : {
                                "$concat" : [ "$firstName", " ", "$lastName"]
                            },
                            "barcodeNumber" : "$barcodeNumber"
                        }
                    },
                    { 
                        "$lookup" : {
                            "from" : "terminals",
                            "localField" : "_id",
                            "foreignField" : "employeeID",
                            "as" : "employee_terminal"
                        }
                    },
                    {
                        "$project": {
                            "fullName" : 1, 
                            "barcodeNumber" : 1,
                            "employee_terminal" : { 
                                "$arrayElemAt" : [ "$employee_terminal", 0  ]
                            }
                        }
                    }
                   
                ]
            )
            .then(r => {
                console.log(r)
                res.send(r)
            })
            .catch(error=>{
                return res.status(500).send({
                    message: `Something is wrong: ${error.message}`
                })           
            })
    
    */


}


exports.validateBarcodeAssignment = (req, res) => {

    if (req.params.employeeID !== 'new') {

        let employeeID = mongoose.Types.ObjectId(req.params.employeeID);

        Employee.find({
            'barcodeNumber': req.body.barcodeNumber,
            '_id': { $ne: employeeID }
        }).then(r => {
            if (r.length > 0)
                return res.status(400).send({ message: `${req.body.barcodeNumber} is already assigned to another employee.` })

            return res.status(200).send({ message: `OK` })
        })
    } else {
        Employee.findOne({
            'barcodeNumber': req.body.barcodeNumber
        }).then(r => {
            if (r != null)
                return res.status(400).send({ message: `${req.body.barcodeNumber} is already assigned to another employee.` })

            return res.status(200).send({ message: `OK` })
        })
    }

}

exports.create = (req, res) => {

    if (!req.body) {
        return res.status(400).send({
            message: "Cannot save with a blank employee details."
        })
    }

    const employeeObject = new Employee({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        departmentID: req.body.departmentID,
        barcodeNumber: req.body.barcodeNumber
    })

    employeeObject.save()
        .then(data => {
            res.send(data)
        })
        .catch(err => {
            res.status(500).send({
                message: `An error occurred while saving data: ${err.message}`
            })
        })
};

exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Cannot save with a blank employee details."
        })
    }

    Employee.findByIdAndUpdate(
        req.params.employeeID,
        {
            "$set": {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                departmentID: req.body.departmentID,
                barcodeNumber: req.body.barcodeNumber
            }
        },
        { new: true }
    )
        .then(employee => {
            if (!employee) {
                return res.status(404).send({
                    message: `Employee with that details were not found on database.`
                })
            }

            res.send(employee)
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: `Employee with that details were not found on database.`
                })
            }

            return res.status(500).send({
                message: `An error occurred while updating that employee information: ${err.message}`
            })
        })

};

