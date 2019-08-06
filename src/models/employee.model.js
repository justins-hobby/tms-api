const mongoose = require('mongoose')

const EmployeeSchema = mongoose.Schema(
    {        
        firstName: String,
        lastName: String,
        departmentID: mongoose.Schema.Types.ObjectId,
        barcodeNumber: String
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Employees', EmployeeSchema);