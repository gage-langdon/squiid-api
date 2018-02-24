const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const invoiceSchema = new Schema({
	location: { type: Schema.ObjectId, ref: 'Location' },
	total: Number,
	dateCreated: Date
});
const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;
