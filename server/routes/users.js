var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//회원가입 페이지(임시)
router.get('/sign_up', function (req, res) {
  res.render('user/sign_up');
});

module.exports = router;
