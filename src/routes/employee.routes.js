module.exports = (app) => {
    const employees = require('../controllers/employee.controller.js')
    const helper = require('../helpers/auth');
    
    app.post('/employees', helper.validateToken, employees.create)
    app.get('/employees', helper.validateToken, employees.findAll)
    app.get('/employees/:employeeID', helper.validateToken, employees.findOne)
    app.put('/employees/:employeeID', helper.validateToken, employees.update)
    app.post('/employees/validate/:employeeID', helper.validateToken, employees.validateBarcodeAssignment)
    app.get('/barcode/:barcodeNumber', helper.validateToken, employees.findBarcode)
}