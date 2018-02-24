const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contributionSchema = new Schema({
	amount: Number,
	dateCreated: Date,
	invoice: { type: Schema.ObjectId, ref: 'Invoice' },
	user: { type: Schema.ObjectId, ref: 'User' }
});
const Contribution = mongoose.model('Contribution', contributionSchema);

module.exports = Contribution;
