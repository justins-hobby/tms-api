const mongoose = require('mongoose')

const DepartmentSchema = mongoose.Schema(
    {        
        departmentName: String
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Departments', DepartmentSchema);