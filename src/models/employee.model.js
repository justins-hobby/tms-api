const mongoose = require('mongoose')

const EmployeeSchema = mongoose.Schema(
    {        
        firstName: String,
        lastName: String,
        terminalNumber: String    
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Employees', EmployeeSchema);