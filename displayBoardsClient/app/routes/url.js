var express = require('express');
var router = express.Router();
var urlToOpen = null;

function open(urlToOpen) {
	var exec = require('child_process').exec;
  var cmd = 'chromium-browser '+urlToOpen;

  /*TODO how do I get this string combined to comand?
  (its the bash script to kill and start chrome if already running)

  if ps ax | grep -v grep | grep chromium-browser > /dev/null
then
    pkill chromium-browser && chromium-browser
else
    chromium-browser
fi
 */


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