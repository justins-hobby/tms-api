const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Routes
require('./src/routes/employee.routes')(app);
require('./src/routes/account.routes')(app);
require('./src/routes/department.routes')(app);
require('./src/routes/terminal.routes')(app);

// CORS
app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

app.get('/', function (req,res) {
    res.send('Hello');
 });

mongoose.Promise = global.Promise;

// Connect to MongoDB

var env = process.env.NODE_ENV === 'development' ? process.env.MONGO_URL_LOCAL : process.env.MONGO_URL_PROD;

mongoose.connect(env, {
    useNewUrlParser: true
}).then(() => {
    console.log("Connected to MongoDB.")  
}).catch(err => {
    console.log(`Cannot connect: ${err}`);
    process.exit();
})

app.listen(process.env.PORT || 5480, () => {
  console.log(`TMS-API is now online. Ready for ${process.env.NODE_ENV}.`)  
})

