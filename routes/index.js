var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Will'
  });
});

router.get('/gettingStarted', function(req, res, next) {
  res.render('gettingstarted');
});

module.exports = router;
