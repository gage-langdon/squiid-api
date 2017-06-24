const Location = require('../models/location');
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
                let cryptoPassword = crypto.hash(req.body.password, constants.location.pwSalt);
                let foundLoc = await Location.findOne({ username, password: cryptoPassword });
                if (!foundLoc) throw ("Invalid Username or Password");
                let token = crypto.encrypt(foundLoc._id + constants.location.idSalt);
                foundLoc.password = undefined;
                res.send({
                    token,
                    location: foundLoc
                });
            }
        } catch (e) {
            res.status(400).send({ error: e.toString() });
        }
    });
    router.post('/signup', async (req, res) => {
        try {
            if (!req.body.name || !req.body.username || !req.body.password) throw ("Invalid user data suppplied");
            let userNameCheck = await Location.findOne({ username: req.body.username });
            if (userNameCheck) throw ("Username already taken");
            let cryptoPassword = crypto.hash(req.body.password, constants.location.pwSalt);
            let data = {
                name: req.body.name,
                username: req.body.username,
                password: cryptoPassword
            }
            let newLoc = await Location.create(data);
            newLoc.password = undefined;
            res.send({ location: newLoc });
        } catch (e) {
            res.status(400).send({ error: e.toString() });
        }
    })

    app.use(routes.location, router);
}