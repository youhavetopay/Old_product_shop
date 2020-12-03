var express = require('express');
var router = express.Router();
const orderController = require("../controller/order.js")
const order = new orderController();


// 주문페이지 렌더링
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


// 주문하기 POST
router.post('/buy', (req, res, next)=>{
    res.send(`<script type="text/javascript">
            alert("주문이 완료되었습니다. 감사합니다..^^"); 
            location.href='/';
            </script>`)
})

module.exports = router;
 