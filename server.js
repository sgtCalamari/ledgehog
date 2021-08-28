const app = require('./routes');

// start server
app.listen(app.localPort, () => {
  console.log(`Node Express server for ${app.displayName} listening at http://localhost:${app.localPort}`);
});
