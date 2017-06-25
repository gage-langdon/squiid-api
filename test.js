const io = require('socket.io-client')('ws://ec2-13-59-237-146.us-east-2.compute.amazonaws.com');



const init = async () => {
    io.connect().emit('join', { userToken: '3c16b14cce0f0642d4d1c62c5a439161e55afe850c7ee5f1b8566cb7f34dc65d6ec9a58125c8a25f70486d6afa66a7fd003c0df973508892', invoiceID: '594ee5de15a7233aec88a17c' });


    io.on('connected', (data) => {
        console.log('connected data', data);
        io.emit('contribute', 100);
    });
    io.on('contribution', (data) => {
        console.log('on contribution made', data);
    });
    io.on('complete', () => {
        console.log('complete!!');
    })
    io.on('err', (message) => {
        console.log('error', message);
    })
};
init();