var express = require('express');
var router = express.Router();
const orderController = require("../controller/order.js")
const order = new orderController();


router.post('/', (req, res, next)=>{
    console.log(req.body.product_num);
    console.log(req.body.order_count);
    res.render('order/order', {sess: req.session.user_id})
})

module.exports = router;
 