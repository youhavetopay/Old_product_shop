var express = require('express');
var router = express.Router();
const mainController = require("../controller/index.js")
const main = new mainController();

// 메인화면 렌더링
router.get('/', main.getProductListMain, (req, res, next) =>{
    res.render('index.ejs', {title: '파지 팜', sess : req.session.user_id, productinfo: req.main_product_list});
  });


router.get('/serch/:serchValue',main.getSerchProductList, (req, res, next)=>{
  res.render('serch_result',{sess : req.session.user_id,serchList:req.serchList, serchValue:req.params.serchValue});
})

  // 정렬하는거 post
router.post('/sortSelect', main.selectSortMethod, (req, res, next)=>{
  console.log(req.body.sortValue);

  console.log(req.sortProductList);

  //var data = {'result':'ok'};
  res.json(req.sortProductList);
})

// 마감상품 보여주는 메인화면 렌더링
router.get('/last',main.getLastList,(req, res, next)=>{
  res.render('viewProduct/lastView',{title: '아이즈원',sess : req.session.user_id ,productinfo: req.lastList})
})


// 직거래가능한 상품 보여주는 메인화면 렌더링
router.get('/direct',main.getDirectAbleList, (req, res, next)=>{
  if(req.session.user_id){
    res.render('viewProduct/directView',{title: '아이즈원',sess : req.session.user_id, productinfo:req.directList})
  }
  else{
    res.send('<script type="text/javascript">alert("로그인이 필요한 기능입니다...");location.href="/users/login";</script>');
  }
})


// 감자 보여주는 메인화면 렌더링
router.get('/potato',main.getPotatoList, (req, res, next)=>{
  res.render('viewProduct/potatoView',{title: '아이즈원',sess : req.session.user_id, productinfo:req.potatoList})
})


// 고구마 보여주는 메인화면 렌더링
router.get('/sweet',main.getSweetList, (req, res, next)=>{
  res.render('viewProduct/sweetView',{title: '아이즈원',sess : req.session.user_id, productinfo:req.sweetList})
})


// 버섯 보여주는 메인화면 렌더링
router.get('/mush',main.getmushList, (req, res, next)=>{
  res.render('viewProduct/mushView',{title: '아이즈원',sess : req.session.user_id, productinfo:req.mushList})
})


// 호박 보여주는 메인화면 렌더링
router.get('/pumkin',main.getPumkinList, (req, res, next)=>{
  res.render('viewProduct/pumkinView',{title: '아이즈원',sess : req.session.user_id, productinfo:req.pumkinList})
})


// 양파 보여주는 메인화면 렌더링
router.get('/onion',main.getOnionList, (req, res, next)=>{
  res.render('viewProduct/onionView',{title: '아이즈원',sess : req.session.user_id, productinfo:req.onionList})
})

module.exports = router;
 