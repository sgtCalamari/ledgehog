const app = require('./routes');
app.displayName = 'Ledgehog';
app.localPort = 8080;

// start server
app.listen(app.localPort, () => {
  console.log(`Node Express server for ${app.displayName} listening at http://localhost:${app.localPort}`);
});
