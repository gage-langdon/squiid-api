const qrcode = require('qrcode');

const create = (str) => {
    return new Promise((resolve, reject) => {
        qrcode.toDataURL(str, (err, url) => {
            if (err) reject(err);
            else resolve(url);
        });
    });
}

module.exports = { create };