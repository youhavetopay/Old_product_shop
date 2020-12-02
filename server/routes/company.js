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

router.post('updateProduct/:product_num', company.updateProduct, (req, res, next) => {
    res.send('<script type="text/javascript">alert("상품이 수정 되었습니다.);location.href"/company";</script>')
})


//공급업체 
module.exports = router;
 