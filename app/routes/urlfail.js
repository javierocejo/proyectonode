var express = require('express');
var router = express.Router();


router.post('/', function(req, res, next) {

  var exec = require('child_process').exec;
  var cmd = 'killall chromium-browser';
  console.log(cmd);


  exec(cmd, function(error, stdout, stderr) {
    if (error) {
      throw new Error(error);
    }
    // command output is in stdout
    console.log(stdout,stderr);
  });
 res.json({ result: true });

});



module.exports = router;


