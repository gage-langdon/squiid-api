const User = require('../models/user');
const constants = require('../config/constants');
const crypto = require('../utilities/crypto');
const routes = require('../config/routes');
const request = require('request-promise');

module.exports = (app, express) => {
	const router = express.Router();

	/*
		Sign in for user account
	*/
	router.post('/signin', async (req, res) => {
		try {
			if (!req.body.username || !req.body.password) throw 'Login requires a username and password';
			else {
				const username = req.body.username;
				// hash password
				const cryptoPassword = crypto.hash(req.body.password, constants.user.pwSalt);

				// find account
				const foundUser = await User.findOne({ username, password: cryptoPassword });
				if (!foundUser) throw 'Invalid Username or Password';

				// create token for auth
				const token = crypto.encrypt(foundUser._id + constants.user.idSalt);
				foundUser.password = undefined;

				res.send({
					token,
					user: foundUser
				});
			}
		} catch (e) {
			res.status(400).send({ error: e.toString() });
		}
	});

	/*
		Create new user account
	*/
	router.post('/signup', async (req, res) => {
		try {
			if (!req.body.username || !req.body.password) throw 'Invalid user data suppplied';

			// Check username availability
			const userNameCheck = await User.findOne({ username: req.body.username });
			if (userNameCheck) throw 'Username already taken';

			// DEV: get random image
			const thumbnail = await request('https://randomuser.me/api/?inc=picture');
			thumbnail = JSON.parse(thumbnail).results[0].picture.thumbnail;

			// Hash password
			const cryptoPassword = crypto.hash(req.body.password, constants.user.pwSalt);

			// Create account
			const data = {
				username: req.body.username,
				password: cryptoPassword,
				dateCreated: new Date(),
				thumbnail
			};
			const newUser = await User.create(data);
			newUser.password = undefined;
			res.send({ user: newUser });
		} catch (e) {
			res.status(400).send({ error: e.toString() });
		}
	});

	app.use(routes.user, router);
};
