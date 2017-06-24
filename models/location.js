const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var locationSchema = new Schema({
    name: String,
    username: String,
    password: String,
    dateCreated: Date
});
var Location = mongoose.model('Location', locationSchema);

Location.save = () => {
    return new Promise((resolve, reject) => {
        Location.save(err => {
            if (err) reject(err);
            else resolve();
        });
    });
}

module.exports = Location;