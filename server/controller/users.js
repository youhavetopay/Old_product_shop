const pool = require("../dbconfig/dbconfig")
const moment = require('moment');

class userController {

    async selectArea (req, res, next) {
        pool.getConnection((err, conn) => {
            if (err) throw err;
            else {
                const sql = `SELECT * FROM area`

                conn.query(sql, (err, row) => {
                    if (err) throw err;
                    else {
                        req.area = row;
                        next();
                    }
                })
            }
        })
    }

    // 회원가입
    async signupInput(req, res, next) {
        console.log(req.body);
    
        const user = req.body;

        pool.getConnection((err, conn) => {
            if(err) throw res.json({success: false, err});
            else{
                
                const areaSql = `SELECT * FROM area WHERE area_name = "${req.params.area_name}"`
                console.log(req.params.area_name);
               
                var sql = "INSERT INTO users VALUES (?,?,?,?,?)";

                if (req.body.user_id == '' || req.body.user_pw == '' || req.body.user_name == '' || req.body.user_tel == '') {
                    console.log("33333" + user.user_id);
                    res.send('<script type="text/javascript">alert("정보를 다시 입력해주세요.");history.back();</script>');
                }
                else {
                    conn.query(areaSql, (err, area) => {
                        console.log("에러1");
                        console.log(area);
                        if (err) throw err;
                        else {
                            const val = [user.user_id, user.user_pw, user.user_name, moment().format("YYYY-MM-DD"), user.user_tel, area[0].area_name]

                            conn.query(sql, val, (err, row) => {
                                if (err) {
                                    res.send('<script type="text/javascript">alert("아이디가 중복입니다.");history.back();</script>');
                                }
                                else {
                                    next();
                                }
                            })
                        }
                    })
                }            
            }
        })
    }
    

    // 로그인
    async userLogin(req, res, next){
        pool.getConnection((err, conn) => {
            if(err) throw err;
            else{
                var sql = `SELECT * FROM users WHERE user_id = "${req.body.user_id}" AND user_pw = "${req.body.user_pw}"`;

                conn.query(sql, (err, row)=>{
                    conn.release();
                    if(err) throw err;
                    else {
                        if(row.length === 0){
                            res.send('<script type="text/javascript">alert("아이디나 비밀번호가 틀렸습니다.");history.back();</script>');
                        }else{
                            req.session.user_id = row[0].user_id;
                            console.log(row[0].user_id, row[0].user_pw, row[0].user_pw);
                            next();  
                        }

                    }
                })
            }
        })
    }



    //마이페이지
    async getMyPage (req, res, next) {
        pool.getConnection((err, conn) => {
            if (err) throw err;
            else {
                const couponSql = `SELECT * FROM coupon WHERE user_id = "${req.session.user_id}"`
                const orderStateSql = `SELECT COUNT(order_state) FROM orders WHERE user_id = "${req.session.user_id}" AND order_state = "배송중"`
                const directSql = `SELECT COUNT(order_direct_whether) FROM orders WHERE user_id = "${req.session.user_id}" AND order_direct_whether = "Y"`
                const MyOrderListSql = `SELECT * FROM orders WHERE user_id = "${req.session.user_id}"`

                conn.query(couponSql, (err, coupon) => {
                    console.log("에러1");
                    if (err) throw err;
                    else {
                        
                        conn.query(orderStateSql, (err, orderstate) => {
                            console.log("에러2");
                            if (err) throw err;
                            else {

                                conn.query(directSql, (err, direct) => {
                                    console.log("에러3");
                                    if (err) throw err;
                                    else {

                                        conn.query(MyOrderListSql, (err, myorderlist) => {
                                            console.log("에러4");
                                            if (err) throw err;
                                            else {

                                                req.coupon = coupon[0];
                                                req.orderstate = orderstate[0];
                                                req.direct = direct[0];
                                                req.myorderlist = myorderlist;

                                                next();
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    }

}

module.exports = userController;
