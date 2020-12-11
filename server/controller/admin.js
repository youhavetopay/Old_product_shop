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



    //공급업체 승인완료 리스트 가져오기
    async selectCompany2(req, res, next) {
        pool.getConnection((err, conn) => {
            if (err) throw err;
            else {
                const sql = `SELECT * FROM company as c, users as u WHERE c.user_id = u.user_id AND c.company_whether = "승인 완료"`

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
                const sql2 = `SELECT * FROM company WHERE company_num = "${req.params.company_num}"`
                const sql = `SELECT * FROM total WHERE company_num = "${req.params.company_num}"`

                conn.query(sql2, (err, row2) => {
                    if (err) throw err;
                    else {

                        conn.query(sql, (err, row) => {
                            if (err) throw err;
                            else {
                                req.total = row
                                req.num = row2[0]
                                console.log(row2[0]);
                                conn.release();
                                next();
                            }
                        })
                    }
                } )

                
            }
        })
    }



    // 정산하기
    async insertTotal (req, res, next) {
        pool.getConnection((err, conn) => {
            if (err) throw err;
            else {

                const sel = `SELECT * FROM company WHERE company_num = "${req.params.company_num}"`

                //총금액, 할인가 가져옴
                const select1 = `SELECT SUM(i.order_price) as order_price, SUM(i.order_sale) as order_sale FROM orders as o, orderinfo as i, product as p WHERE p.company_num = "${req.params.company_num}" AND i.product_num = p.product_num AND o.order_num = i.order_num AND o.order_date LIKE ?`
        
                const inserttotal = `INSERT INTO total(total_date, total_admin_profit, total_sum, total_company_profit, total_sale_price, total_ym, company_num) VALUES (?,?,?,?,?,?,?)`

                const val = [req.body.date + '-%%']

                conn.query(sel, (err, row1) => {
                    console.log("에러6");
                    if (err) throw err;
                    else {
                        console.log(row1[0]);
                        
                        //10% 일 때
                        if (row1[0].company_relation == "10%") {
                            conn.query(select1, val, (err, max) => {
                                console.log("에러1");
                                if (err) throw err;
                                else {
            
                                    console.log(max);
                                    const company_profit = [Number(max[0].order_price) * 0.9]
                                    const admin_profit = [(Number(max[0].order_price) * 0.1) - Number(max[0].order_sale)]
                                    console.log(company_profit);
                                    console.log(admin_profit);
                                    const val2 = [moment().format('YYYY-MM-DD'), admin_profit, max[0].order_price, company_profit, max[0].order_sale, req.body.date, req.params.company_num]
            
                                    conn.query(inserttotal, val2, (err, row) => {
                                        console.log("에러2");
                                        if (err) throw err;
                                        else {
            
                                            if (max[0].order_price > 10000000 && max[0].order_price <= 20000000) {
                                                const up1 = `UPDATE company SET company_relation = "9%" WHERE company_num = "${req.params.company_num}"`
            
                                                conn.query(up1, (err, row) => {
                                                    console.log("에러3");
                                                    if (err) throw err;
                                                    else {
                                                        conn.release();
                                                        next();
                                                    }
                                                })
                                            } else if (max[0].order_price > 20000000) {
                                                const up2 = `UPDATE company SET company_relation = "7%" WHERE company_num = "${req.params.company_num}"`
            
                                                conn.query(up2, (err, row) => {
                                                    console.log("에러4");
                                                    if (err) throw err;
                                                    else {
                                                        conn.release();
                                                        next();
                                                    }
                                                })
                                            } else {
                                                const up3 = `UPDATE company SET company_relation = "10%" WHERE company_num = "${req.params.company_num}"`
            
                                                conn.query(up3, (err, row) => {
                                                    console.log("에러5");
                                                    if (err) throw err;
                                                    else {
                                                        conn.release();
                                                        next();
                                                    }
                                                })
                                            }
                                            
                                        }
                                    })
                                }
                            })
                        } 
                        
                        else if (row1[0].company_relation == "9%") {
                            conn.query(select1, val, (err, max) => {
                                console.log("에러7");
                                if (err) throw err;
                                else {
            
                                    console.log(max);
                                    const company_profit = [Number(max[0].order_price) * 0.91]
                                    const admin_profit = [(Number(max[0].order_price) * 0.09) - Number(max[0].order_sale)]
                                    console.log(company_profit);
                                    console.log(admin_profit);
                                    const val2 = [moment().format('YYYY-MM-DD'), admin_profit, max[0].order_price, company_profit, max[0].order_sale, req.body.date, req.params.company_num]
            
                                    conn.query(inserttotal, val2, (err, row) => {
                                        console.log("에러8");
                                        if (err) throw err;
                                        else {
            
                                            if (max[0].order_price > 10000000 && max[0].order_price <= 20000000) {
                                                const up1 = `UPDATE company SET company_relation = "9%" WHERE company_num = "${req.params.company_num}"`
            
                                                conn.query(up1, (err, row) => {
                                                    console.log("에러9");
                                                    if (err) throw err;
                                                    else {
                                                        conn.release();
                                                        next();
                                                    }
                                                })
                                            } else if (max[0].order_price > 20000000) {
                                                const up2 = `UPDATE company SET company_relation = "7%" WHERE company_num = "${req.params.company_num}"`
            
                                                conn.query(up2, (err, row) => {
                                                    console.log("에러10");
                                                    if (err) throw err;
                                                    else {
                                                        conn.release();
                                                        next();
                                                    }
                                                })
                                            } else {
                                                const up3 = `UPDATE company SET company_relation = "10%" WHERE company_num = "${req.params.company_num}"`
            
                                                conn.query(up3, (err, row) => {
                                                    console.log("에러11");
                                                    if (err) throw err;
                                                    else {
                                                        conn.release();
                                                        next();
                                                    }
                                                })
                                            }
                                            
                                        }
                                    })
                                }
                            })
                        }

                        else {
                            conn.query(select1, val, (err, max) => {
                                console.log("에러12");
                                if (err) throw err;
                                else {
            
                                    console.log(max);
                                    const company_profit = [Number(max[0].order_price) * 0.93]
                                    const admin_profit = [(Number(max[0].order_price) * 0.07) - Number(max[0].order_sale)]
                                    console.log(company_profit);
                                    console.log(admin_profit);
                                    const val2 = [moment().format('YYYY-MM-DD'), admin_profit, max[0].order_price, company_profit, max[0].order_sale, req.body.date, req.params.company_num]
            
                                    conn.query(inserttotal, val2, (err, row) => {
                                        console.log("에러13");
                                        if (err) throw err;
                                        else {
            
                                            if (max[0].order_price > 10000000 && max[0].order_price <= 20000000) {
                                                const up1 = `UPDATE company SET company_relation = "9%" WHERE company_num = "${req.params.company_num}"`
            
                                                conn.query(up1, (err, row) => {
                                                    console.log("에러14");
                                                    if (err) throw err;
                                                    else {
                                                        conn.release();
                                                        next();
                                                    }
                                                })
                                            } else if (max[0].order_price > 20000000) {
                                                const up2 = `UPDATE company SET company_relation = "7%" WHERE company_num = "${req.params.company_num}"`
            
                                                conn.query(up2, (err, row) => {
                                                    console.log("에러15");
                                                    if (err) throw err;
                                                    else {
                                                        conn.release();
                                                        next();
                                                    }
                                                })
                                            } else {
                                                const up3 = `UPDATE company SET company_relation = "10%" WHERE company_num = "${req.params.company_num}"`
            
                                                conn.query(up3, (err, row) => {
                                                    console.log("에러16");
                                                    if (err) throw err;
                                                    else {
                                                        conn.release();
                                                        next();
                                                    }
                                                })
                                            }
                                            
                                        }
                                    })
                                }
                            })
                        }
                    }
                })
                
                
                
            }
        })
    }
}

module.exports = adminController;
