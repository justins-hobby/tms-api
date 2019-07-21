module.exports = (app) => {
const accounts = require('../controllers/account.controller.js')


app.post('/account/register', accounts.register);
app.post('/account/login', accounts.signIn);
}