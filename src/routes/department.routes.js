module.exports = (app) => {
    const departments = require('../controllers/department.controller.js')
    const helper = require('../helpers/auth');
    
    app.post('/departments', helper.validateToken, departments.create)
    app.get('/departments', helper.validateToken, departments.findAll)
    app.get('/department/:departmentID', helper.validateToken, departments.findOne)
    app.put('/department/:departmentID', helper.validateToken, departments.update)
    app.post('/department/validate/:departmentID', helper.validateToken, departments.validateDepartmentName)

}