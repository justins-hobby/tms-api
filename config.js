require('dotenv').config();

module.exports = {
    url: `${process.env.MONGO_URL_LOCAL}`,
    serverport:`${process.env.APP_PORT}`
}