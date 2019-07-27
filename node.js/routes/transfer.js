var express = require('express');
var router = express.Router();

/* transfer */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* need to add for POST */

module.exports = router;
