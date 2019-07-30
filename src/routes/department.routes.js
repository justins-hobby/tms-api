module.exports = (app) => {
    const departments = require('../controllers/department.controller.js')
    const helper = require('../helpers/auth');
    
    app.get('/departments', helper.validateToken, departments.findAll)
    app.get('/department/:departmentID', helper.validateToken, departments.findOne)    
    app.post('/department/validate/:departmentID', helper.validateToken, departments.validateDepartmentName)
    app.post('/departments', helper.validateToken, departments.create)
    app.put('/department/:departmentID', helper.validateToken, departments.update)
    

}