var express = require('express');
var router = express.Router();
const companyController = require("../controller/company.js")
const company = new companyController();

//공급업체 마이페이지
router.get('/', company.selectCount, company.selectProduct, (req, res, next) => {
    res.render('company/companyMypage.ejs', {companyinfo: req.companyinfo})
})


//공급업체 상품 등록
router.get('/insertProduct', (req, res, next) => {
    res.render('company/insertProduct.ejs')
})

router.post('/insertProduct', company.insertProduct, (req, res, next) => {
    res.send('<script type="text/javascript">alert("상품이 등록 되었습니다.);location.href"/company";</script>')
})


//공급업체 판매 종료
router.post('/updateProductState/:product_num', company.updateProductState, (req, res, next) => {
    res.send('<script type="text/javascript">alert("상품 판매상태가 변경 되었습니다.);location.href"/company";</script>')
})


//공급업체 수정
router.get('/updateProduct/:product_num', (req, res, next) => {
    res.render('company/updateProduct.ejs')
})

router.post('/updateProduct/:product_num', company.updateProduct, (req, res, next) => {
    res.send('<script type="text/javascript">alert("상품이 수정 되었습니다.);location.href"/company";</script>')
})


//공급업체 배송 주문, 직거래 주문 목록
router.get('/selectOrder', company.selectOrder, (req, res, next) => {
    res.render('company_orderList.ejs', {sess:req.session.user_id, directY: req.directY, directN: req.directN})
})


//배송 주문, 직거래 주문 항목
router.get('/selectOrder/:order_num', company.selectOrderDetail, (req, res, next) => {
    res.render('company_orderListDetail.ejs', {detail: req.detail})
})


//주문 상태 변경
router.post('/updateOrderState/:order_num', company.updateOrderState, (req, res, next) => {
    res.send('<script type="text/javascript">alert(주문 상태가 변경 되었습니다.);location.href"/selectOrder";</script>')
})


//환불 목록
router.get('/selectRefund', company.selectRefund, (req, res, next) => {
    res.render('company_refundList', {refund : req.refund})
})


//환불 상세
router.get('/selectRefund/:order_num', company.refundDetail, (req, res, next) => {
    res.render('company_refundDetail.ejs', {refund: req.refund})
})


router.post('/updateRefund/:order_num', company.updateRefund, (rea, res, next) => {
    res.send('<script type="text/javascript">alert(환불처리 되었습니다.);location.href"/selectRefund";</script>')
})


// 정산 목록
router.get('/selectTotal', company.selectTotal, (req, res, next) => {
    res.render('company_refundList', {total : req.total})
})

module.exports = router;
 