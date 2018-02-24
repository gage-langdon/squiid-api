require('dotenv').config('./env');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const socketIO = require('socket.io')(server);

mongoose.connect(process.env.mongo);

app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));

//routes
require('./routes/sockets')(socketIO);
require('./routes/user')(app, express);
require('./routes/invoice')(app, express);
require('./routes/location')(app, express);
require('./routes/contribution')(app, express, socketIO);

const PORT = process.env.PORT || 8080;
server.listen(PORT);
