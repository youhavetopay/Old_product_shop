var express = require('express');
var router = express.Router();
const UsersController = require("../controller/users.js")
const user = new UsersController();


/* GET join page. */
router.get('/', function (req, res, next) {
  res.render('signup.ejs');
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



module.exports = router;
