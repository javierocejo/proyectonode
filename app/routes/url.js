var express = require('express');
var router = express.Router();
var urlToOpen = null;

function open(urlToOpen) {
	//todo :spawn of child process
}

router.get('/', function(req, res, next) {
   res.json({title: urlToOpen });
});

router.post('/', function(req, res, next) {

//todo : set urlToOpen to the one in the request
urlToOpen = req.body;
console.log(urlToOpen);
//open(urlToOpen);
  //console.log(req.body);
  res.send(req.body);
  //res.json({ result: true });
});



module.exports = router; 


