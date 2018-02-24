const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
	username: String,
	password: String,
	thumbnail: String,
	stripeID: String,
	dateCreated: Date
});
const User = mongoose.model('User', userSchema);

module.exports = User;
