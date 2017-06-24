const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: String,
    password: String,
    stripeID: String
});
var User = mongoose.model('User', userSchema);

User.save = () => {
    return new Promise((resolve, reject) => {
        User.save(err => {
            if (err) reject(err);
            else resolve();
        });
    });
}

module.exports = User;

