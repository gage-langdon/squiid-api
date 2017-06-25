const middleware = require('../utilities/middleware');
const Invoice = require('../models/invoice');
const Contribution = require('../utilities/contribution');
const Location = require('../models/location');

module.exports = (server) => {
    let io = require('socket.io')(server);

    io.on('connection', (socket) => {
        let user = {};
        let invoice = {};
        socket.on('join', async ({ userToken, invoiceID }) => {
            try {
                console.log('join', userToken, invoiceID);
                let userData = await middleware.user(userToken);
                if (!user) throw ("invalid user token");
                let invoiceData = await Invoice.findById(invoiceID);
                if (!invoiceData) throw ("invalid invoice id");
                user = userData;
                invoice = invoiceData;
                let contributions = await Contribution.get(invoiceID);
                let location = await Location.findById(invoice.location);
                location.password = undefined;
                location.username = undefined;
                socket.join(invoiceID);
                socket.emit('connected', { location, invoice, contributions });
            } catch (e) {
                console.error(e);
                socket.emit('err', e.toString());
            }
        });
        socket.on('contribute', async (amount) => {
            try {
                let data = await Contribution.add(invoice._id, amount, user._id);
                data.user = user;
                data.user.password = undefined;
                let contributions = await Contribution.get(invoice._id);
                io.in(invoice._id).emit('contribution', { contributions });
            } catch (e) {
                console.error(e);
                socket.emit('err', e.toString());
            }

        });
        socket.on('disconnect', () => {
            console.log('disconnect')
        });
    });
}