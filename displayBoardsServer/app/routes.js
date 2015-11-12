'use strict';
var DisplayBoards = require('./api/displayboards/displayboards.http');

module.exports = function(app) {
  app.get('/',function(req,res) {
    res.send('This will show the whole API docs');
  });

  app.use('/displayboards',new Departments(app));
  console.log('loaded all routes');
};