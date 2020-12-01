var express = require('express');
var router = express.Router();
const adminController = require("../controller/admin.js")
const admin = new adminController();

//관리자 페이지 메인
router.get('/', admin.selectCompany, (req, res, next) => {
    res.render('adminHome.ejs', { sess: req.session.user_id, companyinfo: req.companyinfo })
})


//공급업체 승인 거절 화면 가져오기
router.get('/companyState/:company_num', admin.selectCompanyDetail, (req, res, next) => {
    res.render('companyDetail.ejs', { sess: req.session.user_id, companyDetail: req.companyDetail })
})


//공급업체 승인 or 거절하기
router.post('/companyState/:company_num', admin.updateCompanyState, (req, res, next) => {
    res.send('<script type="text/javascript">alert("완료 되었습니다.");location.href="/admin";</script>')
})


//쿠폰 목록 화면
router.get('/coupon', admin.selectCoupon, (req, res, next) => {
    console.log("라우터",req.count);
    console.log("라우터",req.max);
    res.render('adminCoupon.ejs', {sess: req.session.user_id, count: req.count, max: req.max, couponinfo: req.couponinfo})
})


//쿠폰 추가
router.get('/insertCoupon', (req, res, next) => {
    res.render('insertCoupon.ejs', {sess: req.session.user_id})
})

router.post('/insertCoupon', admin.insertCoupon, (req, res, next) => {
    res.send('<script type="text/javascript">alert("등록 되었습니다.");location.href="/admin/coupon";</script>')
})


// //정산 화면
// router.get('/total', admin.selectTotal, (req, res, next) => {
//     res.render('adminTotal.ejs', {sess: req.session.user_id, total: req.total})
// })

// router.post('/total', admin.insertTotal, (req, res, next) => {
//     res.send('<script type="text/javascript">alert("완료 되었습니다.");location.href="/admin/total";</script>')
// })

module.exports = router;
