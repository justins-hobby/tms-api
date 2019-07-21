let jwt = require('jsonwebtoken')

module.exports.validateToken = (req, res, next) => {
    let bearerHeader = req.headers["authorization"]

    if(typeof bearerHeader !== 'undefined'){
        let bearer = bearerHeader.split(" ")
        let bearerToken = bearer[1]

        jwt.verify(bearerToken, `${process.env.API_KEY}`, (err, result) => {
            if(err) { res.status(403).send({ message: `Unauthorized.`}) }
            else { next() }

        })

    }else{
        res.status(403).send({message: `Unauthorized.`})
    }
}



