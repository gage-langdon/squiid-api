const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var contributionSchema = new Schema({
    amount: Number,
    dateCreated: Date,
    invoice: { type: Schema.ObjectId, ref: 'Invoice' },
    user: { type: Schema.ObjectId, ref: 'User' }
});
var Contribution = mongoose.model('Contribution', contributionSchema);

Contribution.save = () => {
    return new Promise((resolve, reject) => {
        Contribution.save(err => {
            if (err) reject(err);
            else resolve();
        });
    });
}

module.exports = Contribution;