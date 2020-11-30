var express = require('express');
var router = express.Router();
const mainController = require("../controller/index.js")
const main = new mainController();

router.get('/',  (req, res, next) =>{
    res.render('index.ejs', {title: '아이즈원', sess : req.session.user_id, productinfo: req.productinfo});
  });

router.post('/sortSelect', main.selectSortMethod, (req, res, next)=>{
  console.log(req.body.sortValue);

  console.log(req.sortProductList);

  var data = {'result':'ok'};
  res.json(data);
})

module.exports = router;
 