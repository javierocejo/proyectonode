var express = require('express');
var router = express.Router();
var urlToOpen = null;

function open(urlToOpen) {
	var exec = require('child_process').exec;
  var cmd = 'open '+urlToOpen;
  //if the os is not MAC change for google-chrome kiosk --->todo
  console.log(cmd);


  exec(cmd, function(error, stdout, stderr) {
    if (error) {
      throw new Error(error);
    }
    // command output is in stdout
    console.log(stdout,stderr);
  });
}

router.get('/', function(req, res, next) {
   res.json({title: urlToOpen });
});

router.post('/', function(req, res, next) {

urlToOpen = req.body.url;
open(urlToOpen);
 res.json({ result: true });
});



module.exports = router;


