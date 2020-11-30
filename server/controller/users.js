const pool = require("../dbconfig/dbconfig")
const moment = require('moment');
const e = require("express");
const { post } = require("../routes/users");

class userController {

    async selectArea(req, res, next) {
        pool.getConnection((err, conn) => {
            if (err) throw err;
            else {
                const sql = `SELECT * FROM area`

                conn.query(sql, (err, row) => {
                    if (err) throw err;
                    else {
                        req.area = row;
                        conn.release();
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


        if (req.body.user_signup != null) {
            pool.getConnection((err, conn) => {
                if (err) throw res.json({ success: false, err });
                else {

                    const areaSql = `SELECT * FROM area WHERE area_num = "${req.body.area_num}"`
                    console.log(req.params.area_num);

                    var sql = "INSERT INTO users VALUES (?,?,?,?,?,?)";

                    if (req.body.user_id == '' || req.body.user_pw == '' || req.body.user_name == '' || req.body.user_tel == '' || req.body.area_id == '') {
                        console.log("33333" + user.user_id);
                        res.send('<script type="text/javascript">alert("정보를 다시 입력해주세요.");history.back();</script>');
                    }
                    else {
                        conn.query(areaSql, (err, area) => {
                            console.log("에러1");
                            console.log(area);
                            if (err) throw err;
                            else {

                                const val = [user.user_id, user.user_pw, user.user_name, moment().format("YYYY-MM-DD"), user.user_tel, area[0].area_num]
                                console.log(val);

                                conn.query(sql, val, (err, row) => {
                                    if (err) {
                                        res.send('<script type="text/javascript">alert("아이디가 중복입니다.");history.back();</script>');
                                    }
                                    else {
                                        conn.release();
                                        next();
                                    }
                                })
                            }
                        })
                    }
                }
            })
        } else {
            pool.getConnection((err, conn) => {
                if (err) throw err;
                else {

                    const areaSql = `SELECT * FROM area WHERE area_num = "${req.body.area_num}"`
                    console.log(req.params.area_num);
                    if (req.body.user_id == '' || req.body._pw == '' || req.body.company_name == '' || req.body.company_id == '') {
                        res.send('<script type="text/javascript">alert("정보를 다시 입력해주세요.");history.back();</script>');
                    }
                    else {
                        conn.query(areaSql, (err, area) => {
                            console.log("에러2");
                            console.log(area);
                            if (err) throw err;
                            else {

                                const yn = `SELECT * FROM users WHERE user_id = "${req.body.user_id}"`
                                const sql2 = `INSERT INTO company(company_id,company_name,area_num,user_id) VALUES (?,?,?,?)`
                                const val2 = [req.body.company_id, req.body.company_name, area[0].area_num, req.body.user_id]
                                console.log(val2);

                                conn.query(yn, (err, ynrow) => {
                                    if (err) {
                                        res.send('<script type="text/javascript">alert("아이디나 비밀번호가 틀렸습니다.");history.back();</script>');
                                    } else {
                                        conn.query(sql2, val2, (err, row) => {
                                            if (err) {
                                                res.send('<script type="text/javascript">alert("이미 등록된 공급업체가 있습니다.");history.back();</script>');
                                            } else {
                                                conn.release();
                                                next();
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                }
            })
        }
    }


    // 로그인
    async userLogin(req, res, next) {
        pool.getConnection((err, conn) => {
            if (err) throw err;
            else {
                var sql = `SELECT * FROM users WHERE user_id = "${req.body.user_id}" AND user_pw = "${req.body.user_pw}"`;

                conn.query(sql, (err, row) => {
                    conn.release();
                    if (err) throw err;
                    else {
                        if (row.length === 0) {
                            res.send('<script type="text/javascript">alert("아이디나 비밀번호가 틀렸습니다.");history.back();</script>');
                        } else {
                            req.session.user_id = row[0].user_id;
                            console.log(row[0].user_id, row[0].user_pw, row[0].user_pw);
                            conn.release();
                            next();
                        }

                    }
                })
            }
        })
    }



    //마이페이지
    async getMyPage(req, res, next) {
        pool.getConnection((err, conn) => {
            if (err) throw err;
            else {

                // 사용자가 가지고 있는 쿠폰가져오기
                const couponSql = `SELECT COUNT(*) FROM coupon WHERE user_id = "${req.session.user_id}" AND coupon_whether = "N"`

                // 배송중인 주문 수 가져오기
                const orderStateSql = `SELECT COUNT(order_state) FROM orders WHERE user_id = "${req.session.user_id}" AND order_state = "배송중"`

                // 직거래 예정인 주문 수 가져오기
                const directSql = `SELECT COUNT(order_direct_whether) FROM orders WHERE user_id = "${req.session.user_id}" AND order_direct_whether = "Y"`

                // 내가 주문한 주문 목록 가져오기
                const MyOrderListSql = `SELECT * FROM orders WHERE user_id = "${req.session.user_id}"`


                // 사용자가 가지고 있는 쿠폰가져오기
                conn.query(couponSql, (err, coupon) => {
                    console.log("에러1");
                    if (err) throw err;
                    else {

                        conn.query(orderStateSql, (err, orderstate) => {
                            console.log("에러2");
                            if (err) throw err;
                            else {


                                // 직거래 예정인 주문 수 가져오기
                                conn.query(directSql, (err, direct) => {
                                    console.log("에러3");
                                    if (err) throw err;
                                    else {

                                        // 내가 주문한 주문 목록 가져오기
                                        conn.query(MyOrderListSql, (err, myorderlist) => {
                                            console.log("에러4");
                                            if (err) throw err;
                                            else {

                                                req.session.coupon = coupon[0];
                                                req.session.orderstate = orderstate[0];
                                                req.session.direct = direct[0];
                                                req.myorderlist = myorderlist;

                                                console.log(coupon);
                                                console.log(orderstate);
                                                console.log(direct);
                                                console.log(myorderlist);

                                                conn.release();
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



    //카드 select
    async selectCard(req, res, next) {
        pool.getConnection((err, conn) => {
            if (err) throw err;
            else {

                //사용자가 가지고 있는 카드 가져오기
                const sql = `SELECT * FROM card WHERE user_id = "${req.session.user_id}"`

                conn.query(sql, (err, row) => {
                    if (err) throw err;
                    else {
                        req.cardinfo = row;
                        conn.release();
                        next();
                    }
                })
            }
        })
    }



    //카드 insert
    async insertCard(req, res, next) {
        pool.getConnection((err, conn) => {
            if (err) throw err;
            else {
                if (req.body.card_num == '' || req.body.card_validity == '' || req.body.card_cvc == '') {
                    res.send('<script type="text/javascript">alert("정보를 입력해주세요.");history.back();</script>');
                }
                // 카드 새로 추가하기
                const sql = `INSERT INTO card VALUES (?,?,?,?)`
                const val = [req.body.card_num, req.body.card_validity, req.body.card_cvc, req.session.user_id]

                conn.query(sql, val, (err, row) => {
                    if (err) throw err;
                    else {
                        conn.release();
                        next();
                    }
                })
            }
        })
    }


    //카드 delete
    async deleteCard(req, res, next) {
        pool.getConnection((err, conn) => {
            if (err) throw err;
            const sql = `DELETE FROM card WHERE card_num = "${req.params.card_num}"`
            conn.query(sql, (err, row) => {
                conn.release();
                if (err) throw err;
                else {
                    conn.release();
                    next();
                }
            })
        })
    }




    //배송지 select
    async selectPlace(req, res, next) {
        pool.getConnection((err, conn) => {
            if (err) throw err;
            else {

                // 배송지 가져오기
                const sql = `SELECT * FROM place WHERE user_id = "${req.session.user_id}"`

                conn.query(sql, (err, row) => {
                    if (err) throw err;
                    else {
                        req.cardinfo = row;
                        conn.release();
                        next();
                    }
                })
            }
        })
    }



    //배송지 insert
    async insertPlace(req, res, next) {
        pool.getConnection((err, conn) => {
            if (err) throw err;
            else {
                if (req.body.place_num == '' || req.body.place_addr == '' || req.body.place_addrinfo == '' || req.body.place_name == '' || req.body.place_userNM == '' || req.body.place_tel == ''){
                    res.send('<script type="text/javascript">alert("정보를 입력해주세요.");history.back();</script>');
                }

                // 배송지 추가하기
                const sql = `INSERT INTO place(?,?,?,?,?,?,?) VALUES (?,?,?,?,?,?,?)`
                const val = [req.body.place_num, req.body.place_addr, req.body.place_addrinfo, req.body.place_name, req.body.place_userNM, req.body.place_tel, req.session.user_id]

                conn.query(sql, val, (err, row) => {
                    if (err) throw err;
                    else {
                        conn.release();
                        next();
                    }
                })
            }
        })
    }


    //배송지 delete
    async deletePlace(req, res, next) {
        pool.getConnection((err, conn) => {
            if (err) throw err;
            const sql = `DELETE FROM place WHERE place_id = "${req.params.place_id}"`
            conn.query(sql, (err, row) => {
                conn.release();
                if (err) throw err;
                else {
                    conn.release();
                    next();
                }
            })
        })
    }


    // 배송지 update
    async updatePlace(req, res, next) {
        pool.getConnection((err, conn) => {
            if (err) throw err;

            const place = req.body;

            if (req.body.place_num == '' || req.body.place_addr == '' || req.body.place_addrinfo == '' || req.body.place_name == '' || req.body.place_userNM == '' || req.body.place_tel == ''){
                res.send('<script type="text/javascript">alert("정보를 입력해주세요.");history.back();</script>');
            }

            // 배송지 수정하기
            const sql = `UPDATE place SET place_num = ?, place_addr = ?, place_addrinfo = ?, place_name = ?, place_userNM = ?, place_tel = ? WHERE place_id = "${req.params.place_id}"`;
            const val = [req.body.place_num, req.body.place_addr, req.body.place_addrinfo, req.body.place_name, req.body.place_userNM, req.body.place_tel];

            if (place.place_num == '' || place.place_addr == '' || place.place_addrinfo == '' || place.place_name == '' || place.place_userNM == '' || place.place_tel == '') {
                res.send('<script type="text/javascript">alert("정보를 다시 입력해주세요.");history.back();</script>');
            }
            conn.query(sql, val, (err, row) => {
                if (err) {
                    res.send('<script type="text/javascript">alert("이미 있는 배송지 입니다.");history.back();</script>');
                }
                else {
                    conn.release();
                    next();
                }
            })
        })
    }



    //즐겨찾기 select
    async selectBookmark(req, res, next) {
        pool.getConnection((err, conn) => {
            if (err) throw err;
            else {

                // 즐겨찾기 목록 가져오기
                const sql = `SELECT * FROM bookmark WHERE user_id = "${req.session.user_id}"`

                conn.query(sql, (err, row) => {
                    if (err) throw err;
                    else {
                        req.bookmarkinfo = row;
                        conn.release();
                        next();
                    }
                })
            }
        })
    }



    //즐겨찾기 delete
    async deleteBookmark(req, res, next) {
        pool.getConnection((err, conn) => {
            if (err) throw err;
            else {

                // 즐겨찾기 삭제하기
                const sql = `DELETE FROM bookmark WHERE user_id = "${req.session.user_id}"`

                conn.query(sql, (err, row) => {
                    if (err) throw err;
                    else {
                        conn.release();
                        next();
                    }
                })
            }
        })
    }



    //장바구니 select 
    async selectBasket(req, res, next) {
        pool.getConnection((err, conn) => {
            if (err) throw err;
            else {

                // 장바구니 가져오기???
                const sql = `SELECT * FROM basket WHERE user_id = "${req.session.user_id}"`

                conn.query(sql, (err, row) => {
                    if (err) throw err;
                    else {
                        req.basketinfo = row;
                        conn.release();
                        next();
                    }
                })
            }
        })
    }



    //coupon select 
    async selectCoupon(req, res, next) {
        pool.getConnection((err, conn) => {
            if (err) throw err;
            else {

                // 사용자가 가지고 있는 쿠폰 가져오기
                const sql = `SELECT * FROM coupon WHERE user_id = "${req.session.user_id}"`

                conn.query(sql, (err, row) => {
                    if (err) throw err;
                    else {
                        req.couponinfo = row;
                        conn.release();
                        next();
                    }
                })
            }
        })
    }
}

module.exports = userController;
