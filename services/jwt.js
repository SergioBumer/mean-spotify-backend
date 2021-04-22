const jwt = require('jwt-simple');
const moment = require('moment');

const secret = "Prueba_MEAN"

function createToken(user) {

    let payload = {
        sub: user._id,
        name: user.name,
        surname: user.surname,
        role: user.role,
        email: user.email,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix
    };

    return jwt.encode(payload, secret);

}

module.exports = { createToken };