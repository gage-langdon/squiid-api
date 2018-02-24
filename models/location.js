const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const locationSchema = new Schema({
	name: String,
	username: String,
	password: String,
	dateCreated: Date
});
const Location = mongoose.model('Location', locationSchema);

module.exports = Location;
