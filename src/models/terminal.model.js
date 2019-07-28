const mongoose = require('mongoose')

const TerminalSchema = mongoose.Schema(
    {   
        terminalNumber: String,   
        employeeID: mongoose.Schema.Types.ObjectId,
        assignedDate: Date,
        returnedDate: Date    
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Terminals', TerminalSchema);