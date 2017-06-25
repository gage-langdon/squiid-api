

module.exports = (server) => {
    let io = require('socket.io')(server);

    io.on('connection', (socket) => {
        socket.on('join', (invoiceID) => {
            console.log('join', socket);
            socket.join(invoiceID);
        });
        socket.on('contribute', (amount) => {
            console.log('contribute', socket.rooms)
        });
        socket.on('disconnect', () => {
            console.log('disconnect')
        });
    });
}