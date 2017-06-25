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
                let locationData = await Location.findById(invoice.location);
                let location = {
                    _id: locationData._id,
                    name: locationData.name
                }
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

                let totalContributed = 0;
                contributions.forEach(x => totalContributed += x.amount);
                console.log('-------', totalContributed, invoice.total)
                if (totalContributed >= invoice.total)
                    io.in(invoice._id).emit('complete');
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