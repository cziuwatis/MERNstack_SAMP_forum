let express = require('express');
let mongoose = require('mongoose');
let cors = require('cors');
let bodyParser = require('body-parser');
let dbConfig = require('./config/db');

// Routers
const usersRouter = require('../server/routes/users');
const forumRouter = require('../server/routes/forum');
const subforumRouter = require('../server/routes/subforum');
const topicRouter = require('../server/routes/topic');


// Express
const app = express();

// Port
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
    console.log('Connected to port ' + port)
});


// app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use('/users', usersRouter);
app.use('/forum', forumRouter);
app.use('/subforum', subforumRouter);
app.use('/topic', topicRouter);


// Error 404
app.use((req, res, next) => {
    next(createError(404));
});


// Other errors
app.use(function (err, req, res, next)
{
    console.error(err.message);
    if (!err.statusCode)
    {
        err.statusCode = 500;
    }
    res.status(err.statusCode).send(err.message);
});
