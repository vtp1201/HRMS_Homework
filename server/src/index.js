const express = require('express')
const methodOverride = require('method-override');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const passport = require('passport');
const session = require('express-session');
const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require('./swagger.json');
const morgan = require('morgan')

require('dotenv').config();

const app = express();

const route = require('./routes');
const db = require('./config/db');

require('./config/passport/passport');
require('./config/passport/passportLocal');

const {checkActive} = require('./middleware/authMiddleware');

app.use(methodOverride('_method'));

app.use(cors());
//app.use('/file', express.static(path.join(__dirname, 'public')));
// static file
app.use('/file', passport.authenticate("jwt", { session: false }),
        checkActive, 
        express.static(path.join(__dirname, 'public'))
);


app.use(helmet());
//bodyparse
app.use(express.urlencoded( {extended: false} ));
app.use(express.json());
app.use(morgan('dev'))

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