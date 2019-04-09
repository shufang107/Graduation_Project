const express = require('express');
var history = require('connect-history-api-fallback');
const app = express();
const path = require('path');
const meta = require('./package.json');
const serverMiddleware = require('./server/index')

process.on('uncaughtException', function(err) {
  (app.get('logger') || console).error('Uncaught exception:\n', err.stack);
});
app.use(history());
app.set('name', meta.name);
app.set('version', meta.version);
app.set('port', process.env.PORT || 6660);
app.set('views', path.join(__dirname, 'dist', 'html'));
app.use(express.static(__dirname + '/dist'));
app.set('logger', console);
app.enable('trust proxy');
serverMiddleware(app)

if (require.main === module) {
  app.listen(app.get('port'), function() {
      console.log('[%s] Express server listening on port %d',
          app.get('env').toUpperCase(), app.get('port'));
  });
}

// module.exports = app;