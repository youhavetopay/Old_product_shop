var express = require('express');
var router = express.Router();

var productController = require('../controller/product');
var Product = new productController();

router.get('/:product_num', Product.getProductDetail, (req, res, next)=>{
    res.render('product/user_product_detail', {
        sess : req.session.user_id,
        productInfo: req.productInfo,
        imageList: req.imageList,
        reviewList: req.reviewList});
})

router.post('/addBookMark', Product.addBookMark, (req, res, next)=>{
    res.send(`<script type="text/javascript">
            alert("해당 업체가 즐겨찾기에 추가되었습니다.."); 
            history.back();
            </script>`)
})

module.exports = router;