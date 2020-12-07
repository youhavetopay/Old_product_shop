var express = require('express');
var router = express.Router();
const UsersController = require("../controller/users.js")
const user = new UsersController();


/* GET join page. */
router.get('/', user.selectArea, function (req, res, next) {
  res.render('login/signup.ejs', {area: req.area});
});

// 일반회원 회원가입
router.post('/', user.signupInput, (req, res)=>{
  res.send('<script type="text/javascript">alert("가입 되었습니다.");location.href="/";</script>');
})

// 공급업체 회원가입 post
router.post('/comSignUp', user.companySignUp ,(req, res, next)=>{
  res.send('<script type="text/javascript">alert("신청 완료 되었습니다.");location.href="/";</script>');
})


//login
router.get('/login', function (req, res, next) {
  res.render('login/login.ejs');
})

router.post('/login', user.userLogin, (req, res)=>{
  if(req.couponCheck){
    res.send('<script type="text/javascript">alert("쿠폰을 발급했습니다. 마이페이지에서 확인해주세요..");location.href="/";</script>');
  }
  else{
    res.send('<script type="text/javascript">alert("로그인 되었습니다.");location.href="/";</script>');
  }
})


//logout
router.get('/logout',(req, res, next) => {
  sess = req.session;
  if (sess) {
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
      } else {
        res.send('<script type="text/javascript">alert("로그아웃 되었습니다.");location.href="/";</script>');
      }
    })
  }
})


//mypage
router.get('/mypage', user.getMyPage, user.selectCard, user.selectCoupon, user.selectBookmark, (req, res, next) => {
  res.render('mypage/myPage.ejs', 
  {sess: req.session.user_id, bookmarkinfo : req.bookmarkinfo, coupon : req.session.coupon, couponinfo : req.couponinfo,cardinfo : req.cardinfo, placeinfo : req.placeinfo ,orderstate : req.session.orderstate, direct : req.session.direct, myorderlist: req.myorderlist })
})


// //카드 select
// router.get('/mypage/selectCard', user.selectCard, (req, res, next)=> {
//   res.render('mypage/selectCard.ejs', {cardinfo: req.cardinfo})
// })


//카드 insert
router.get('/mypage/insertCard', (req, res, next) => {
  res.render('mypage/insertCard.ejs')
})

router.post('/mypage/insertCard', user.insertCard, (req, res, next) => {
  res.send('<script type="text/javascript">alert("카드 등록이 완료되었습니다."); window.close();opener.parent.location="/users/mypage";</script>')
})


//카드 delete
router.get('/mypage/deleteCard/:card_num', user.deleteCard, (req, res, next) => {
  res.send('<script type="text/javascript">alert("카드가 삭제 되었습니다.");location.href="/users/mypage";</script>');
})


// //배송지 select 
// router.get('/mypage/selectPlace', user.selectPlace, (req, res, next) => {
//   res.render('mypage/selectPlace.ejs', {placeinfo: req.placeinfo})
// })


//배송지 insert
router.get('/mypage/insertPlace', (req, res, next) => {
  res.render('mypage/insertPlace.ejs')
})

router.post('/mypage/insertPlace', user.insertPlace, (req, res, next) => {
  res.send('<script type="text/javascript">alert("배송지 등록이 완료되었습니다."); window.close();opener.parent.location="/users/mypage";</script>')
})


//배송지 delete
router.get('/mypage/deletePlace/:place_id', user.deletePlace, (req, res, next) => {
  res.send('<script type="text/javascript">alert("배송지가 삭제 되었습니다.");location.href="/users/mypage";</script>');
})


//배송지 update
router.get('/mypage/updatePlace/:place_id', user.selectPlace, (req, res, next) => {
  res.render('mypage/updatePlace.ejs', { data : req.placeinfo })
})

router.post('/mypage/updatePlace/:place_id', user.updatePlace, (req, res, next) => {
  res.send('<script type="text/javascript">alert("배송지가 수정 되었습니다.");location.href="/users/mypage";</script>');
})


// //즐겨찾기 select
// router.get('/mypage/selectBookmark', user.selectBookmark, (req, res, next) => {
//   res.render('mypage/Bookmark.ejs', { bookmarkinfo : req.bookmarkinfo})
// }) 


//즐겨찾기 delete
router.get('/mypage/deleteBookmark/:bm_num', user.deleteBookmark, (req, res, next) => {
  res.send('<script type="text/javascript">alert("즐겨찾기가 삭제 되었습니다.");location.href="/users/mypage";</script>');
})


// //장바구니 select
// router.get('/mypage/selectBasket', user.selectBasket, (req, res, next) => {
//   res.render('mypage/basket.ejs', {basketinfo: req.basketinfo})
// })


// //쿠폰 select
// router.get('/mypage/selectBasket', user.selectCoupon, (req, res, next) => {
//   res.render('mypage/coupon.ejs', {couponinfo: req.couponinfo})
// })



//환불신청 insert
router.get('/mypage/refund/:order_num', user.selectRefund, (req, res, next) => {
  console.log(req.refund);
  res.render('mypage/request_refund.ejs', {refund: req.refund})
})

router.post('/mypage/refund/:order_num', user.updateRefund,(req, res, next) => {
  res.send('<script type="text/javascript">alert("환불 신청이 완료되었습니다."); location.href="/users/mypage";</script>')
})


//리뷰 쓰기
router.get('/mypage/review/:product_num', user.selectProduct, (req, res, next) => {
  console.log("들어와~~~~~~~~");
  res.render('mypage/review.ejs', {product: req.product})
})

router.post('/mypage/review/:product_num', user.insertReview, (req, res, next) => {
  res.send('<script type="text/javascript">alert("리뷰 등록이 완료되었습니다."); location.href="/users/mypage";</script>')
})


module.exports = router;
