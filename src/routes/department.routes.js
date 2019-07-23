module.exports = (app) => {
    const departments = require('../controllers/department.controller.js')
    const helper = require('../helpers/auth');
    
    app.post('/departments', helper.validateToken, departments.create)
    app.get('/departments', helper.validateToken, departments.findAll)
    app.get('/departments/:departmentID', helper.validateToken, departments.findOne)
    app.put('/departments/:departmentID', helper.validateToken, departments.update)
    app.post('/departments/validate/:departmentID', helper.validateToken, departments.validateDepartmentName)

}