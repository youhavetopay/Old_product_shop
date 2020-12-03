var express = require('express');
var router = express.Router();
const orderController = require("../controller/order.js")
const order = new orderController();


router.post('/', order.getOrderProduct,(req, res, next)=>{

    console.log(req.totalMoney);

    res.render('order/order', {
        sess: req.session.user_id, 
        productList:req.order_product_list, 
        user_address: req.user_address,
        user_card:req.user_card, 
        count:req.body.order_count,
        totalMoney: req.total_money
    })
})

module.exports = router;
 