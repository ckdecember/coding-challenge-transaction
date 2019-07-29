var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // generate random session guard
  var sessionguard = Math.random() * 1000
  sessionguard = Math.floor(sessionguard)

  res.render('index', { 
      title: 'MO MONEY PAGE',
      sessionguard: sessionguard 
  });
});

module.exports = router;
