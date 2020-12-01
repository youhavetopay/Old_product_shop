const e = require("express");
const { format } = require("../dbconfig/dbconfig");
const pool = require("../dbconfig/dbconfig")
let moment = require('moment');

class adminController {

    //공급업체 리스트 가져오기
    async selectCompany(req, res, next) {
        pool.getConnection((err, conn) => {
            if (err) throw err;
            else {
                const sql = `SELECT * FROM company as c, users as u WHERE c.user_id = u.user_id`

                conn.query(sql, (err, row) => {
                    if (err) throw err;
                    else {
                        req.companyinfo = row
                        console.log(row);
                        conn.release();
                        next();
                    }
                })
            }
        })
    }



    //공급업체 승인 거절 화면 가져오기 
    async selectCompanyDetail(req, res, next) {
        pool.getConnection((err, conn) => {
            if (err) throw err;
            else {

                console.log(req.params.company_num);
                const sql = `SELECT * FROM company as c, users as u WHERE c.user_id = u.user_id AND c.company_num = "${req.params.company_num}"`

                conn.query(sql, (err, row) => {
                    if (err) throw err;
                    else {
                        req.companyDetail = row[0]
                        console.log(row);
                        conn.release();
                        next();
                    }
                })
            }
        })
    }



    // 공급업체 승인, 거절하기
    async updateCompanyState(req, res, next) {
        pool.getConnection((err, conn) => {
            if (err) throw err;
            else {// 승인
                if (req.body.ok != null) {
                    const truefalse = `SELECT * FROM company WHERE company_num = "${req.params.company_num}"`

                    conn.query(truefalse, (err, tf) => {
                        if (err) throw err;
                        else {
                            if (tf[0].company_whether == "승인 완료") {
                                console.log("이미 완료된 업체");
                                res.send('<script type="text/javascript">alert("이미 승인된 공급업체입니다.");history.back();</script>')
                            } else if (tf[0].company_whether == "승인 거절") {
                                console.log("이미 거절된 업체");
                                res.send('<script type="text/javascript">alert("이미 거절된 공급업체입니다.");history.back();</script>')
                            } else {
                                const sql = `UPDATE company SET company_relation = "10%", company_whether = "승인 완료" WHERE company_num = "${req.params.company_num}"`

                                conn.query(sql, (err) => {
                                    if (err) throw err;
                                    conn.release();
                                    next();
                                })
                            }
                        }
                    })
                }

                else {// 거절

                    const truefalse2 = `SELECT * FROM company WHERE company_num = "${req.params.company_num}"`

                    conn.query(truefalse2, (err, tf2) => {
                        if (err) throw err;
                        else {
                            if (tf2[0].company_whether == "승인 완료") {
                                console.log("이미 완료된 업체");
                                res.send('<script type="text/javascript">alert("이미 승인된 공급업체입니다.");history.back();</script>')
                            } else if (tf2[0].company_whether == "승인 거절") {
                                console.log("이미 거절된 업체");
                                res.send('<script type="text/javascript">alert("이미 거절된 공급업체입니다.");history.back();</script>')
                            } else {
                                // 거절 사유 비었으면 에러 처리
                                if (req.body.company_reason == '') {
                                    console.log("들어와");
                                    res.send('<script type="text/javascript">alert("거절사유를 입력해주세요.");history.back();</script>')
                                }
                                else {
                                    const sql2 = `UPDATE company SET company_whether = "승인 거절", company_reason = ? WHERE company_num = "${req.params.company_num}"`
                                    const val = [req.body.company_reason]

                                    conn.query(sql2, val, (err) => {
                                        if (err) throw err;
                                        conn.release();
                                        next();
                                    })
                                }
                            }
                        }
                    })
                }
            }
        })
    }



    // 쿠폰 목록 가져오기
    async selectCoupon(req, res, next) {
        pool.getConnection((err, conn) => {
            if (err) throw err;
            else {
                const sql = `SELECT * FROM coupon`
                const sql2 = `SELECT COUNT(*) as count FROM coupon`
                const sql3 = 'SELECT SUM(coupon_sale_price) as max FROM coupon'

                conn.query(sql, (err, row) => {
                    console.log("에러1");
                    if (err) throw err;
                    else {

                        conn.query(sql2, (err, row2) => {
                            console.log("에러2");
                            if (err) throw err;
                            else {

                                conn.query(sql3, (err, row3) => {
                                    console.log("에러3");
                                    if (err) throw err;
                                    else {
                                        req.couponinfo = row
                                        req.count = row2[0].count
                                        req.max = row3[0].max
                                        conn.release();
                                        console.log(row);
                                        console.log(row2);
                                        console.log(row3);
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



    //쿠폰 등록
    async insertCoupon(req, res, next) {
        pool.getConnection((err, conn) => {
            if (err) throw err;
            else {
                const sql = `INSERT INTO coupon(coupon_name, coupon_date, coupon_sale_price, coupon_whether, coupon_issueDate, user_id) VALUES (?,?,?,?,?,?)`
                const val = [req.body.coupon_name, req.body.coupon_date, req.body.coupon_sale_price, 'N', moment().format('YYYY-MM-DD'), req.body.user_id]

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



    //정산 목록 가져오기
    async selectTotal (req, res, next) {
        pool.getConnection((err, conn) => {
            if (err) throw err;
            else {
                const sql = `SELECT * FROM total`

                conn.query(sql, (err, row) => {
                    if (err) throw err;
                    else {
                        req.total = row
                        console.log(total);
                        conn.release();
                        next();
                    }
                })
            }
        })
    }



    // 정산하기
    async insertTotal (req, res, next) {
        pool.getConnection((err, conn) => {
            if (err) throw err;
            else {
                
                const inserttotal = `INSERT INTO total(total_date, total_admin_profit, total_sum, total_company_profit, total_sale_price, total_ym, company_num)`
            }
        })
    }
}

module.exports = adminController;
