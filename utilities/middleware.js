var Location = require('../models/location');
var crypto = require('./crypto');

const constants = require('../config/constants');

module.exports = (app) => {
    middleware = {};
    middleware.basic = (req, res, next) => {
        //rejects if he user does not have the most basic requirements
        next();
    }
    middleware.locationSubscriptionRequired = async (req, res, next) => {
        //rejects user is they do not have valid subscription aka locationID
        try {
            let token = req.headers['authorization'];
            if (!token)
                throw ("Lacking authorization");

            let decryptedToken = crypto.decrypt(token);
            let locationID = decryptedToken.replace(constants.location.idSalt, '');

            let loc = await locations.findById(locationID);
            if (!loc)
                throw ("Invalid authorization");

            req.location = loc;
            next();
        } catch (error) {
            res.status(403).send({ error })
        }
    }
    middleware.userSubscriptionRequired = async (req, res, next) => {
        //rejects user is they do not have valid subscription aka locationID
        try {
            let token = req.headers['authorization'];
            if (!token)
                throw ("Lacking authorization");

            let decryptedToken = crypto.decrypt(token);
            let userID = decryptedToken.replace(constants.user.idSalt, '');

            let user = await locations.findById(userID);
            if (!user)
                throw ("Invalid authorization");

            req.user = user;
            next();
        } catch (error) {
            res.status(403).send({ error })
        }
    }
    return middleware;
}