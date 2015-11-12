// Public methods
var q = require('q');
var fs = require('fs');
var path = require('path');
var async = require('async');
var request = require('request');
var mssql = require('mssql');
var url = require('url');
var Configurator = require('configurator');
var winston = require('winston');
require('winston-logstash');


/**
 * Instantiates the Boot class, which helps in booting up the application.
 * Redundant, right? :)
 * @class helpers.boot
 * @memberOf helpers
 * @constructor
 */
function Boot() {
  if (!(this instanceof Boot)) {
    return new Boot();
  }
}

/**
 * Adds the parsers and loggers to the Express Application
 * @param {object} app - The ExpressJS App object
 * @returns {void}
 * @memberOf helpers.boot
 */
Boot.prototype.setupParsersAndLoggers = function(app) {
  var host = require('os').hostname();
  var LS_HOST = process.env.LOGSTASH_HOST || '127.0.0.1';
  var LS_PORT = process.env.LOGSTASH_PORT || 5000;
  var LS_NODE_NAME = process.env.LOGSTASH_NODE_NAME || 'QueueRT@' + host;
  var cors = require('cors');
  var bodyParser = require('body-parser');

  app.use(cors({
    origin: '*',
    methods: ['GET', 'DELETE', 'PUT', 'POST'],
    allowedHeaders: ['Authorization', 'Content-Type', 'Version'],
  }));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false}));

  winston.add(winston.transports.Logstash, {
    port: LS_PORT,
    nodName: LS_NODE_NAME,
    host: LS_HOST,
  });
  winston.info('Testing Winston/Logstash connection',{crazyMetadata: true});
  app.set('winston',winston);

  return q.fcall(function() {
    return app;
  });
};

/**
 * Adds the db connection object to the Express Application
 * @param {object} app - The ExpressJS App object
 * @returns {Promise}
 * @memberOf helpers.boot
 */
Boot.prototype.connectToDatabase = function(app){
  var deferred = q.defer();
  var configurator = app.get('Configurator');
  var dsn = url.parse(configurator.get('mssql').SQL_DSN);
  var auth = dsn.auth.split(':');
  var settings = {
    driver: 'tedious',
    user: auth[0],
    password: auth[1],
    database: dsn.path.replace('/', ''),
    server: dsn.host,
    requestTimeout: 15000,
    connectionTimeout: 8000,
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    },
    options: {
      encrypt: (configurator.get('mssql').MSSQL_ENCRYPT ? true : false)
    }
  };
  if (configurator.get('mssql').MSSQL_INSTANCE_NAME) {
    settings.options.instanceName = configurator.get('mssql').MSSQL_INSTANCE_NAME;
  }

  var dbConn = new mssql.Connection(settings, function(err) {
    if (err) {
      winston.error(err);
      return deferred.reject(err);
    }
    app.set('dbConn', dbConn);
    deferred.resolve(app);
  });

  return deferred.promise;
};

/**
 * Adds NTLM Authentication as a Express Middleware
 * @param {object} app - The ExpressJS App object
 * @returns {void}
 * @memberOf helpers.boot
 */
Boot.prototype.setupNTLMAuthentication = function(app) {
  var ntlm = require('express-ntlm');
  var errors = require('../errors');
  const DOMAIN = process.env.NTLM_DOMAIN || 'corp.iltest.com';
  const DC_HOST = process.env.NTLM_DC_HOST || '192.168.0.15';
  const BASE_DN = process.env.NTLM_BASE_DN || 'dc=corp,dc=iltest,dc=com';
  var ntlmSetup = {
    debug: function() {
      var args = Array.prototype.slice.apply(arguments);
      console.log.apply(null, args);
    },
    forbidden: errors[403],
    badrequest: errors[400],
    domain: DOMAIN,
    domaincontroller: 'ldap://' + DC_HOST + '/' + BASE_DN,
  };
  app.use(ntlm(ntlmSetup));
  // TODO req.ntlm will have the login information
  return q.fcall(function() {
    return app;
  });
};

/**
 * Adds a configurator object to the Express app (using .set), allowing other modules
 * to access it in order to configure theirselves.
 * @param {object} app - The ExpressJS App object
 * @returns {void}
 * @memberOf helpers.boot
 */
Boot.prototype.setupConfigurator = function setupConfigurator(app) {
  var deferred = q.defer();
  Configurator = new Configurator();
  Configurator.startup().then(function(data) {
    app.set('Configurator',Configurator);
    console.log('Finished setting up Configurator');
    deferred.resolve(app);
  }).catch(deferred.reject);
  return deferred.promise;
};

/**
 * Setup errors handlers (Sentry, for example) for this app
 * @param {object} app - The ExpressJS App object
 * @returns {void}
 * @memberOf helpers.boot
 */
Boot.prototype.setupErrorHandlers = function setupErrorHandlers(app) {
  var deferred = q.defer();
  var sentryDsn = app.get('Configurator').get('sentry') ?
    app.get('Configurator').get('sentry').SENTRY_DSN : null;
  /* Catch 404 and forward to error handler */
  function catch404(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  }

  /** Error Handlers */
  /** Development error handler: Shows the stack trace */
  function devErrorHandler(err, req, res, next) {
    if (typeof (err) !== 'object') {
      return next(new Error('Err is not of type object'));
    }
    err.randomValue = 'randomValue: ' + Math.random();
    if (!err.stack) {
      err.stack = 'NO STACK TRACE AVAILABLE \n :(';
    }
    var result = {
      name: err.name,
      message: err.message,
      error: err.stack.split('\n'),
    };
    if (err.code) {
      result.code = err.code;
    }
    res.status(err.status || 500).send(result);
  }

  /** Production error handler: No stacktraces leaked to user */
  function prodErrorHandler(err, req, res, next) {
    var result = {
      name: err.name,
      message: err.message,
      error: {},
    };
    if (err.code) {
      result.code = err.code;
    }
    res.status(err.status || 500).send(result);
  }

  function setupMainHandlers() {
    var devEnvs = ['development', 'staging', 'strider'];
    var isDevEnvironment = true || (devEnvs.indexOf(app.get('env')) !== -1);
    if (isDevEnvironment) {
      app.use(devErrorHandler);
    } else {
      app.use(prodErrorHandler);
    }
    app.use(catch404);
  }

  app.use(function logErrorToConsole(err, req, res, next) {
    console.log(err);
    next(err);
  });

  setupMainHandlers();
  deferred.resolve(app);
  winston.info('Starting Feedback backend..');
  return deferred.promise;
};

module.exports = Boot;
