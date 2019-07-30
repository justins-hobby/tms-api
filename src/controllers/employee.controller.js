const Employee = require('../models/employee.model.js')
const mongoose = require('mongoose')

exports.create = (req, res) => {

    if (!req.body) {
        return res.status(400).send({
            message: "Cannot save with a blank employee details."
        })
    }

    const employeeObject = new Employee({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        departmentID: req.body.departmentID
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

exports.validateTerminalAssignment = (req, res) => {

    if (req.params.employeeID !== 'new') {

        let oid = mongoose.Types.ObjectId(req.params.employeeID);

        Employee.find({
            'terminalNumber': req.body.terminalNumber,
            '_id': { $ne: oid }
        }).then(r => {
            if (r.length > 0)
                return res.status(400).send({ message: `That terminal number is already assigned.` })

            return res.status(200).send({ message: `OK` })
        })
    } else {
        Employee.findOne({
            'terminalNumber': req.body.terminalNumber
        }).then(r => {
            if (r != null)
                return res.status(400).send({ message: `${req.body.terminalNumber} is already assigned.` })

            return res.status(200).send({ message: `OK` })
        })
    }

}