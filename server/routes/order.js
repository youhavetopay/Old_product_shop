var express = require('express');
var router = express.Router();
const orderController = require("../controller/order.js")
const order = new orderController();


router.post('/', order.getOrderProduct,(req, res, next)=>{
    res.render('order/order', {sess: req.session.user_id, productList:req.order_product_list, userInfo:req.user_info})
})

module.exports = router;
 