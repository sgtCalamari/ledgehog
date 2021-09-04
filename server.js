const express = require('express');
const routes = require('./routes');
const app = express();

app.displayName = 'Ledgehog';
app.localPort = 8080;

// middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// app routes
app.use(routes);

// start server
app.listen(app.localPort, () => {
  console.log(`Node Express server for ${app.displayName} listening at http://localhost:${app.localPort}`);
});
