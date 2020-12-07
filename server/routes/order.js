var express = require('express');
var router = express.Router();
const orderController = require("../controller/order.js")
const order = new orderController();


// 주문페이지 렌더링
router.post('/', order.getOrderProduct,(req, res, next)=>{

    console.log(req.order_product_list.length, 'ㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁ');

    res.render('order/order', {
        sess: req.session.user_id, 
        productList:req.order_product_list, 
        user_address: req.user_address,
        user_card:req.user_card, 
        count:req.body.product_count,
        totalMoney: req.total_money,
        check_basket: req.basket_check
    })
})


// 주문하기 POST
router.post('/buy', order.userBuyProduct,(req, res, next)=>{
    res.send(`<script type="text/javascript">
            alert("주문이 완료되었습니다. 감사합니다..^^"); 
            location.href='/';
            </script>`)
})


// 장바구니 렌더링
router.get('/basket', order.getBasketList,(req, res, next)=>{
    res.render('mypage/myBasket', {sess:req.session.user_id, basketList:req.basket_list, empty_check:req.basket_empty_check})
})

// 장바구니에 물품 추가
router.post('/basketAdd', order.addBasketInProduct,(req, res, next)=>{
    res.send(`<script type="text/javascript">
            alert("장바구니에 추가 되었습니다.."); 
            location.href='/order/basket';
            </script>`)
})

// 장바구니에 상품 삭제
router.post('/delete/basket/product', order.deleteProduct_basket, (req, res, next)=>{
    res.send(`<script type="text/javascript">
    alert("삭제 되었습니다.."); 
    location.href='/order/basket';
    </script>`)
})

module.exports = router;
 