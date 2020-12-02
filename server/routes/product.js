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



module.exports = router;