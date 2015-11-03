var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  	res.send({title: 'Express GET' });
});

/* POST home page. */
router.post('/', function(req, res, next) {
  res.send({title: 'Express POST' });
});

module.exports = router;
