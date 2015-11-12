'use strict';
var express = require('express');
var configurator = require('configurator');
var q = require('q');
var Boot = require('./components/boot');
var winston = require('winston');
var boot = new Boot();

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Setup server
var app = express();
app.server = require('http').createServer(app);
app.server.app = app;

module.exports = boot.setupParsersAndLoggers(app)
  .then(boot.setupConfigurator)
  .then(function() {
    require('./routes')(app);
    return app;
  })
  .then(boot.setupErrorHandlers)
  .then(function() {
    winston.log('info', 'Application initialized.');
    return app;
  })
  .catch(function(err) {
    winston.error(err);
    throw new Error(err);
  });

/*var express = require('express');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var users = require('./routes/users');
var url = require('./routes/url');
var urlfail = require('./routes/urlfail');
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', routes);
app.use('/users', users);
app.use('/url' , url);
app.use('/urlfail' , urlfail);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;


*/