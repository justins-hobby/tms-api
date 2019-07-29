const Terminal = require('../models/terminal.model.js')
const mongoose = require('mongoose')

exports.save = (req, res) => {

    if (!req.body) {
        return res.status(400).send({
            message: "Cannot save with a blank Terminal details."
        })
    }

    const TerminalObject = new Terminal({
        terminalNumber: req.body.terminalNumber,
        employeeID: req.body.employeeID,
        assignedDate: req.body.assignedDate,
        returnedDate: req.body.returnedDate
    })

    TerminalObject.save()
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
    Terminal.aggregate([
        {
            $lookup:
            {
                from: "employees",
                localField: "employeeID",
                foreignField: "_id",
                as: "assigned_employee"
            }
        }
    ])
        .sort({
            terminalNumber: -1
        })
        .then(Terminals => {
            res.send(Terminals)
        })
        .catch(err => {
            res.status(500).send({
                message: `An error occurred while pulling data: ${err.message}`
            })
        })

};

exports.findOne = (req, res) => {
    Terminal.findOne({
        'terminalNumber': req.params.terminalID
    })
        .then(terminal => {
            if (!terminal)
                return res.status(404).send({
                    message: `Terminal not found on database.`
                })

            res.send(JSON.stringify(terminal))
        })
        .catch(error => {
            return res.status(500).send({
                message: `Something is wrong while pulling that Terminal: ${err.message}`
            })
        })

};

exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Cannot save with a blank Terminal details."
        })
    }

    console.log(req.body)

    const filter = { terminalNumber: req.body.terminalNumber };
    const updateDetails = {
        employeeID: req.body.employeeID,
        assignedDate: req.body.assignedDate,
        returnedDate: req.body.returnedDate,
        updatedAt: req.body.dateModified
    };

    Terminal.findOneAndUpdate(filter, updateDetails, {
        new: true
    })
    .then(Terminal => {
        if(!Terminal){
            return res.status(404).send({
                message: `Terminal with that details were not found on database.`
            })
        }

        res.send(Terminal)
    })
    .catch(err => {
        if(err.kind === 'ObjectId'){
            return res.status(404).send({
                message: `Terminal with that details were not found on database.`
            })
        }

        return res.status(500).send({
            message: `An error occurred while updating that Terminal information: ${err.message}`
        })
    })


    /*
    Terminal.findByIdAndUpdate(
        req.params.TerminalID,
        {
            "$set": {
                terminalNumber: req.body.terminalNumber,        
                employeeID: req.body.employeeID,
                assignedDate: req.body.assignedDate,
                returnedDate: req.body.returnedDate,
                updatedAt: req.body.dateModified
            }
        },
        { new: true }
    )
    .then(Terminal => {
        if(!Terminal){
            return res.status(404).send({
                message: `Terminal with that details were not found on database.`
            })
        }

        res.send(Terminal)
    })
    .catch(err => {
        if(err.kind === 'ObjectId'){
            return res.status(404).send({
                message: `Terminal with that details were not found on database.`
            })
        }

        return res.status(500).send({
            message: `An error occurred while updating that Terminal information: ${err.message}`
        })
    })
    */
};

exports.validateTerminalAssignment = (req, res) => {

    if (req.params.TerminalID !== 'new') {

        let oid = mongoose.Types.ObjectId(req.params.TerminalID);
        let employeeID = mongoose.Types.ObjectId(req.body.employeeID);

        Terminal.find({
            'terminalNumber': req.body.terminalNumber,
            '_id': { $ne: oid },
            'employeeID': { $ne: employeeID }
        }).then(r => {

            if (r.length > 0)
                return res.status(400).send({ message: `That terminal number is already assigned.` })

            return res.status(200).send({ message: `OK` })
        })
    } else {
        Terminal.findOne({
            'terminalNumber': req.body.terminalNumber
        }).then(r => {
            if (r != null)
                return res.status(400).send({ message: `${req.body.terminalNumber} is already assigned.` })

            return res.status(200).send({ message: `OK` })
        })
    }

}