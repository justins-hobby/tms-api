const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()
const Account = require('./src/models/account.model')
const app = express()

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Routes
require('./src/routes/employee.routes')(app);
require('./src/routes/account.routes')(app);

// CORS
app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})


mongoose.Promise = global.Promise;

// Connect to MongoDB
mongoose.connect(`${process.env.MONGO_URL_LOCAL}`, {
    useNewUrlParser: true
}).then(() => {

}).catch(err => {
    console.log(`Cannot connect: ${err}`);
    process.exit();
})

app.listen(`${process.env.APP_PORT}` || 5480, () => {
    
})

