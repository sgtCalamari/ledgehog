const express = require('express');
const routes = require('./routes');
const session = require('express-session');
const MongoStore = require('connect-mongo');
//require('./services/passport');
require('dotenv').config();
const app = express();
app.displayName = process.env.DISPLAY_NAME;
app.localPort = process.env.PORT || 8080;

// session setup
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.DB_STRING,
    dbName: process.env.DB_NAME,
    ttl: 1000 * 60 * 60 * 24 // = 1 day
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // = 1 day
  }
}));

// middleware
app.use(express.json()); // replaces body-parser
app.use(express.urlencoded({extended: true}));
//app.use(passport.initialize());
//app.use(passport.session());

// view engine
app.set('view engine', 'pug');

// app routes
app.use(routes);

// start server
app.listen(app.localPort, () => {
  console.log(`Node Express server for ${app.displayName} listening at http://localhost:${app.localPort}`);
});
