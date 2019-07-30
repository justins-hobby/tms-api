const mongoose = require('mongoose')

const EmployeeSchema = mongoose.Schema(
    {        
        firstName: String,
        lastName: String,
        departmentID: mongoose.Schema.Types.ObjectId 
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Employees', EmployeeSchema);