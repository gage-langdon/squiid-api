var crypto = require('crypto');
var encryptionAlgorithm = 'aes-256-ctr';
var hashAlgorithm = 'sha512';
var password = '8dV%s52skiOpZ&1#!'

var generateSalt = (length) => {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length);
};
var hash = (text, salt) => {
    let hash = crypto.createHmac(hashAlgorithm, salt);
    hash.update(text);
    let value = hash.digest('hex');
    return value;
};
var encrypt = (text) => {
    var cipher = crypto.createCipher(encryptionAlgorithm, password)
    var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}
var decrypt = (text) => {
    var decipher = crypto.createDecipher(encryptionAlgorithm, password)
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}

module.exports = {
    generateSalt, hash, encrypt, decrypt
}
