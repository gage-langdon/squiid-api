const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const config = require('./config/config-dev');

mongoose.connect(`mongodb://${config.mongoose.username}:${config.mongoose.password}@ds135522.mlab.com:35522/squiid`);

app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));

const PORT = process.env.PORT || 8080;

//routes
require('./routes/user')(app, express);
require('./routes/invoice')(app, express);
require('./routes/location')(app, express);
require('./routes/contribution')(app, express);

app.listen(PORT, () => {
    console.log('server listening on port ', PORT);
});
