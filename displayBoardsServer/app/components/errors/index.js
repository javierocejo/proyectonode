/**
 * Error responses
 */
'use strict';

module.exports = {
  404: function pageNotFound(req, res) {
    var statusCode = 404;
    var result = {
      status: statusCode,
    };
    res.json(result, result.status);
  },
  403: function forbidden(req, res) {
    var statusCode = 403;
    var result = {
      status: statusCode,
      message: 'Forbidden (wrong auth)',
    };
    res.json(result, result.status);
  },
  400: function forbidden(req, res) {
    var statusCode = 400;
    var result = {
      status: statusCode,
      message: 'Bad Request',
    };
    res.json(result, result.status);
  },
};
