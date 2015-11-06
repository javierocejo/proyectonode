var express = require('express');
var router = express.Router();
var urlToOpen = null;

function open(urlToOpen) {
	var exec = require('child_process').exec;
  var cmd = 'google-chrome --kiosk '+urlToOpen;

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
console.log(urlToOpen);
//open(urlToOpen);
  //console.log(req.body);

 res.json({ result: true });
});



module.exports = router;


