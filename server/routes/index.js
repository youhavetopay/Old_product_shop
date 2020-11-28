var express = require('express');
var router = express.Router();
const mainController = require("../controller/index.js")
const main = new mainController();

router.get('/', function (req, res, next) {
    res.render('index.ejs',{title: '아이즈원', sess : req.session.user_id});
  });



module.exports = router;
 