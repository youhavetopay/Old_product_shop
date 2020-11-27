var express = require('express');
var router = express.Router();
const UsersController = require("../controller/users.js")
const user = new UsersController();


/* GET join page. */
router.get('/', user.selectArea, function (req, res, next) {
  res.render('signup.ejs', {area: req.area});
});

router.post('/', user.signupInput, (req, res)=>{
  res.send('<script type="text/javascript">alert("가입 되었습니다.");location.href="/";</script>');
})


//login
router.get('/login', function (req, res, next) {
  res.render('login.ejs');
})

router.post('/login', user.userLogin, (req, res)=>{
  res.send('<script type="text/javascript">alert("로그인 되었습니다.");location.href="/";</script>');
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
router.get('/mypage', user.getMyPage, (req, res, next) => {
  res.render('myPage.ejs', {sess: req.session.user_id, coupon : req.coupon, orderstate : req.orderstate, direct : req.direct, myorderlist: req.myorderlist })
})


//카드 select
router.get('/mypage/selectCard', user.selectCard, (req, res, next)=> {
  res.render('selectCard.ejs', {cardinfo: req.cardinfo})
})


//카드 insert
router.get('/mypage/insertCard', (req, res, next) => {
  res.render('insertCard.ejs')
})

router.post('/mypage/insertCard', user.insertCard, (req, res, next) => {
  res.send('<script type="text/javascript">alert("카드가 등록 되었습니다.);location.href"/users/mypage/selectCard";</script>')
})


//카드 delete
router.get('/mypage/deleteCard/:card_num', user.deleteCard, (req, res, next) => {
  res.send('<script type="text/javascript">alert("카드가 삭제 되었습니다.");location.href="/users/mypage/selectCard";</script>');
})


//배송지 select 
router.get('/mypage/selectPlace', user.selectPlace, (req, res, next) => {
  res.render('selectPlace.ejs', {placeinfo: req.placeinfo})
})


//배송지 insert
router.get('/mypage/insertPlace', (req, res, next) => {
  res.render('insertCard.ejs')
})

router.post('/mypage/insertPlace', user.insertPlace, (req, res, next) => {
  res.send('<script type="text/javascript">alert("배송지가 등록되었습니다.);location.href"/users/mypage/selectPalce";</script>')
})


//배송지 delete
router.get('/mypage/deletePlace/:place_id', user.deletePlace, (req, res, next) => {
  res.send('<script type="text/javascript">alert("배송지가 삭제 되었습니다.");location.href="/users/mypage/selectPlace";</script>');
})


//배송지 update
router.get('/mypage/updatePlace/:place_id', (req, res, next) => {
  res.render('updatePlace.ejs')
})

router.post('/mypage/updatePlace/:place_id', user.updatePlace, (req, res, next) => {
  res.send('<script type="text/javascript">alert("배송지가 수정 되었습니다.");location.href="/users/mypage/selectPlace";</script>');
})


//즐겨찾기 select
router.get('/mypage/selectBookmark', user.selectBookmark, (req, res, next) => {
  res.render('Bookmark.ejs', { bookmarkinfo : req.bookmarkinfo})
}) 


//즐겨찾기 delete
router.get('/mypage/selectBookmark/:bookmark_num', user.deleteBookmark, (req, res, next) => {
  res.send('<script type="text/javascript">alert("즐겨찾기가 삭제 되었습니다.");location.href="/users/mypage/selectBookmark";</script>');
})


//장바구니 select
router.get('/mypage/selectBasket', user.selectBasket, (req, res, next) => {
  res.render('basket.ejs', {basketinfo: req.basketinfo})
})


//쿠폰 select
router.get('/mypage/selectBasket', user.selectCoupon, (req, res, next) => {
  res.render('coupon.ejs', {couponinfo: req.couponinfo})
})

module.exports = router;
