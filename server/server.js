let express = require('express');
let session = require('express-session');
const MongoStore = require('connect-mongo')(session);
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
app.use(session({
  secret: "YOUR_SECRET_KEY",
  resave: true,
  cookie: { secure: false, maxAge: 6000000 }, 
  saveUninitialized: true,
  store: new MongoStore({mongooseConnection: mongoose.connection})
}));

// Port
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
    console.log('Connected to port ' + port)
});


// app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors({credentials: true, origin: 'http://localhost:3000'})); //fixes stuff https://stackoverflow.com/a/21622564
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
