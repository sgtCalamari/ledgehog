const express = require('express');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const session = require('express-session');
const routes = require('./routes');
require('dotenv').config(); // exposes process.env.VARIABLE_NAME
const app = express();
app.displayName = process.env.DISPLAY_NAME;

// session setup
const mongoStore = MongoStore.create({
  mongoUrl: process.env.DB_STRING,
  dbName: process.env.DB_NAME,
  ttl: 1000 * 60 * 60 * 24 // = 1 day
});
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  store: mongoStore,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // = 1 day
  }
}));

// middleware
app.use(express.json()); // replaces body-parser
app.use(express.urlencoded({extended: true}));

// authentication
require('./services/passport');
app.use(passport.initialize());
app.use(passport.session());

// view engine and routes
app.set('view engine', 'pug');
app.use(routes);

// error handler
// TODO: error handler goes here!

// start server
app.listen(process.env.PORT, () => {
  console.log(`Node Express server for ${app.displayName} listening at http://localhost:${process.env.PORT}`);
});
