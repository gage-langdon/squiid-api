const crypto = require('crypto');
const encryptionAlgorithm = 'aes-256-ctr';
const hashAlgorithm = 'sha512';
const password = '8dV%s52skiOpZ&1#!'

const generateSalt = (length) => {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length);
};
const hash = (text, salt) => {
    let hash = crypto.createHmac(hashAlgorithm, salt);
    hash.update(text);
    let value = hash.digest('hex');
    return value;
};
const encrypt = (text) => {
    let cipher = crypto.createCipher(encryptionAlgorithm, password)
    let crypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
    return crypted;
}
const decrypt = (text) => {
    let decipher = crypto.createDecipher(encryptionAlgorithm, password)
    let dec = decipher.update(text, 'hex', 'utf8') + decipher.final('utf8');
    return dec;
}

module.exports = {
    generateSalt, hash, encrypt, decrypt
}
