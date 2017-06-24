const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var invoiceSchema = new Schema({
    location: { type: Schema.ObjectId, ref: 'Location' },
    total: Number,
    dateCreated: Date
});
var Invoice = mongoose.model('Invoice', invoiceSchema);

Invoice.save = () => {
    return new Promise((resolve, reject) => {
        Invoice.save(err => {
            if (err) reject(err);
            else resolve();
        });
    });
}

module.exports = Invoice;