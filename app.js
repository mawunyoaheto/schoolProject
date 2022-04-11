require('dotenv').config();
require('./api/data/db');
const express = require('express');
const routes = require('./api/routes/index');
const cors = require('cors');

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', function (req, res, next) {
    res.header('Access-Control-Allow-Origin',
        'http://localhost:4200');
    res.header('Access-Control-Allow-Headers', 'Origin, XRequested-With, Content-Type, Accept');
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,DELETE,POST,PUT");
    next();
});

app.use('/api', routes);

const server = app.listen(process.env.PORT, () => {
    const port = server.address().port;
    console.log(process.env.LISTEN_TO_PORT_MSG + ' ' + process.env.HOST + port);
});