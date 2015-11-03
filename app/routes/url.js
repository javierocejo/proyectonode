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

urlToOpen = req.body.url;
console.log(urlToOpen);
//open(urlToOpen);
  //console.log(req.body);
  
 res.json({ result: true });
});



module.exports = router; 


