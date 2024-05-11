const crypto = require('crypto')
const randomImageName = (byte = 32) => {
    return crypto.randomBytes(byte).toString('hex')
}

module.exports = {
    randomImageName
}