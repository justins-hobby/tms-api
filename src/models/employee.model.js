const mongoose = require('mongoose')

const EmployeeSchema = mongoose.Schema(
    {        
        firstName: String,
        lastName: String,
        department: Object    
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Employees', EmployeeSchema);