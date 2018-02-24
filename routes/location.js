const Location = require('../models/location');
const constants = require('../config/constants');
const crypto = require('../utilities/crypto');
const routes = require('../config/routes');

module.exports = (app, express) => {
	const router = express.Router();

	/*
		Sign in for location account
	*/
	router.post('/signin', async (req, res) => {
		try {
			if (!req.body.username || !req.body.password) throw 'Login requires a username and password';
			else {
				const username = req.body.username;
				const password = req.body.password;

				// Hash password
				const cryptoPassword = crypto.hash(req.body.password, constants.location.pwSalt);
				const foundLoc = await Location.findOne({ username, password: cryptoPassword });
				if (!foundLoc) throw 'Invalid Username or Password';

				// create token for auth
				const token = crypto.encrypt(foundLoc._id + constants.location.idSalt);
				foundLoc.password = undefined;
				res.send({
					token,
					location: foundLoc,
					dateCreated: new Date()
				});
			}
		} catch (e) {
			res.status(400).send({ error: e.toString() });
		}
	});

	/*
		Create new location account
	*/
	router.post('/signup', async (req, res) => {
		try {
			if (!req.body.name || !req.body.username || !req.body.password) throw 'Invalid user data suppplied';

			// check username availability
			let userNameCheck = await Location.findOne({ username: req.body.username });
			if (userNameCheck) throw 'Username already taken';

			// hash password
			let cryptoPassword = crypto.hash(req.body.password, constants.location.pwSalt);

			// Create acount
			let data = {
				name: req.body.name,
				username: req.body.username,
				password: cryptoPassword
			};
			let newLoc = await Location.create(data);
			newLoc.password = undefined;
			res.send({ location: newLoc });
		} catch (e) {
			res.status(400).send({ error: e.toString() });
		}
	});

	app.use(routes.location, router);
};
