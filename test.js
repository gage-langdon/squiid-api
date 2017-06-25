const io = require('socket.io-client')('http://localhost:8080');



const init = async () => {
    io.connect().emit('join', { userToken: '3c16b14cce0f0642d4d1c62c5a439161e55afe850c7ee5f1b8566cb7f34dc65d6ec9a58125c8a25f70486d6afa66a7fd003c0df973508892', invoiceID: '594ee85bd07f562f9029bd80' });


    io.on('connected', () => {
        io.emit('contribute', 100);
    });
};
init();