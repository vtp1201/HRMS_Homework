const express = require('express')
const methodOverride = require('method-override');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const passport = require('passport');
const session = require('express-session');
const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require('./swagger.json');

require('dotenv').config();

const app = express();

const route = require('./routes');
const db = require('./config/db');

require('./config/passport/passport');
require('./config/passport/passportGoogle');
require('./config/passport/passportLocal');

app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
console.log(path.join(__dirname, 'public'));

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    
}));

app.use(session({
    secret: 'key',
    resave: true,
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

// Connect to DB
db.connect();

// router
app.use('/api/v1', route);
// docs
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
// notFound
app.use((req, res) => {
    res.status(404);
    res.json({msg: 'not found'});
})

const serverPort = process.env.SERVER_PORT || 5000;
app.listen(serverPort, () => {
    console.log(`listening on port ${serverPort}`);
});