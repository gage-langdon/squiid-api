const Location = require('../models/location');
const User = require('../models/user');
const crypto = require('./crypto');
const constants = require('../config/constants');

module.exports = {
    location: async (req) => {
        try {
            let token = req.headers['authorization'];
            if (!token) throw ("Lacking authorization");

            let decryptedToken = crypto.decrypt(token);
            let locationID = decryptedToken.replace(constants.location.idSalt, '');
            let loc = await Location.findById(locationID);
            if (!loc) throw ("Invalid authorization");
            else return loc;
        } catch (error) {
            throw (error);
        }
    },
    user: async (token) => {
        try {
            if (!token) throw ("Lacking authorization");
            let decryptedToken = crypto.decrypt(token);
            let userID = decryptedToken.replace(constants.user.idSalt, '');
            let user = await User.findById(userID);
            if (!user) throw ("Invalid authorization");
            else return user;
        } catch (error) {
            throw (error);
        }
    }
}