module.exports = (app) => {
    const terminals = require('../controllers/terminal.controller.js')
    const helper = require('../helpers/auth');
    
    app.post('/terminals', helper.validateToken, terminals.save)
    app.get('/terminals', helper.validateToken, terminals.findAll)
    app.get('/terminal/:terminalID', helper.validateToken, terminals.findOne)
    app.put('/terminal/:terminalID', helper.validateToken, terminals.update)
    app.post('/terminal/validate/:terminalID', helper.validateToken, terminals.validateTerminalAssignment)

}