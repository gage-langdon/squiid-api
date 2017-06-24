const User = require('../models/user');
const constants = require('../config/constants');
const crypto = require('../utilities/crypto');
const routes = require('../config/routes');

module.exports = (app, express, middleware) => {
    const router = express.Router();

    router.post('/signin', async (req, res) => {
        try {
            if (!req.body.username || !req.body.password)
                throw ("Login requires a username and password");
            else {
                let username = req.body.username;
                let password = req.body.password;
                let cryptoPassword = crypto.hash(req.body.password, constants.user.pwSalt);
                let foundUser = await User.findOne({ username, password: cryptoPassword });
                if (!foundUser) throw ("Invalid Username or Password");
                let token = crypto.encrypt(foundUser._id + constants.user.idSalt);
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
    router.post('/signup', async (req, res) => {
        try {
            if (!req.body.username || !req.body.password) throw ("Invalid user data suppplied");
            let userNameCheck = await User.findOne({ username: req.body.username });
            if (userNameCheck) throw ("Username already taken");
            let cryptoPassword = crypto.hash(req.body.password, constants.user.pwSalt);
            let data = {
                username: req.body.username,
                password: cryptoPassword
            }
            let newUser = await User.create(data);
            newUser.password = undefined;
            res.send({ user: newUser });
        } catch (e) {
            res.status(400).send({ error: e.toString() });
        }
    })

    app.use(routes.user, router);
}