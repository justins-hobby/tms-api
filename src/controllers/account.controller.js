const Account = require('../models/account.model.js');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Methods for user registration and login logic are found here.
// Bcrypt has been used to 'hash' the creds to and from the db.

// Register method
exports.register = (req, res) => {

    if(!req.body){
        return res.status(400).send({
            message: "Credentials received are blank."
        })
    }

    const accountObject = new Account({
        employeeID: req.body.employeeID,
        userName: req.body.userName,
        passwordHash: req.body.passwordHash,
        isLocked: false,
        isActivated: false
    })
    
    accountObject.save()
                 .then(result => {
                     res.status(201).send(result)
                 })
                 .catch(error => {
                    res.status(500).send({
                        message: `${error.message}`
                    })
                 })
}

// Signin method.
exports.signIn = (req, res) => {
    Account.findOne({
        userName: req.body.userName,
        isLocked: false,
        isActivated: true
    }).then((account) => {
        if(account !== null){    
            account.comparePassword(req.body.passwordHash, (error, isEqual) => {               
                if(isEqual){
                    let token = jwt.sign({ accountId: account._id }, `${process.env.API_KEY}`);
                    res.status(200).json({
                        accountId: account._id,
                        userName: account.userName,
                        isActivated: account.isActivated,
                        isLocked: account.isLocked,
                        token
                    })
                }else{
                    res.status(401).send({ message: `Invalid password.`})
                }
            })
        }else{
            res.status(401).send({ message: `Invalid account credentials.`})
        }
    }).catch((err) => {
        res.status(500).json({ message: `An error has occurred: ${err.message}. `})
    })
}