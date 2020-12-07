const cookieParser = require("cookie-parser");
const e = require("express");
const nodemon = require("nodemon");
const pool = require("../dbconfig/dbconfig");

class companyController {
    // 공급업체 마이페이지
    async selectCount(req, res, next) {
        pool.getConnection((err, conn) => {
            if (err) throw err;
            else {
                // 공급업체인지 확인하기???
                const ynSql = `SELECT * FROM company WHERE user_id = "${req.session.user_id}"`;

                conn.query(ynSql, (err, yn) => {
                    console.log("에러1");
                    if (err) {
                        res.send(
                            '<script type="text/javascript">alert("공급업체 회원이 아닙니다.");history.back();</script>'
                        );
                    } else {
                        console.log("ssss", req.session.company_num);
                        if (req.session.company_num == 0) {
                            console.log("sssdsff");
                            conn.release();
                            res.send(
                                '<script type="text/javascript">alert("공급업체 회원이 아닙니다.");location.href="/";</script>'
                            );
                        } else {
                            console.log(yn.length);
                            console.log(yn[0]);
                            console.log(yn[0].company_num);
                            req.session.company_num = yn[0].company_num;

                            // 등록된 상품 갯수 들고 오기
                            const productCountSql = `SELECT COUNT(*) as count FROM product WHERE company_num = "${yn[0].company_num}"`;
                            // 주문 개수 들고 오기
                            const orderCountSql = `SELECT COUNT(order_num) as count FROM orderinfo as o, product as p WHERE company_num = "${yn[0].company_num}" AND o.product_num = p.product_num`;
                            // 직거래 개수 들고 오기
                            const directCountSql = `SELECT count(*) AS count FROM orders as o, orderinfo as oi, product as p WHERE p.product_num = oi.product_num AND o.order_num = oi.order_num AND p.company_num = "${yn[0].company_num}}" AND o.order_direct_whether = 'Y'`;

                            conn.query(productCountSql, (err, productCount) => {
                                console.log("에러2");
                                if (err) throw err;
                                else {
                                    conn.query(
                                        orderCountSql,
                                        (err, orderCount) => {
                                            console.log("에러3");
                                            if (err) throw err;
                                            else {
                                                conn.query(
                                                    directCountSql,
                                                    (err, directCount) => {
                                                        console.log("에러4");
                                                        if (err) throw err;
                                                        else {
                                                            req.productCount =
                                                                productCount[0];
                                                            req.orderCount =
                                                                orderCount[0];
                                                            req.directCount =
                                                                directCount[0];

                                                            console.log(
                                                                productCount
                                                            );
                                                            console.log(
                                                                orderCount
                                                            );
                                                            console.log(
                                                                directCount
                                                            );

                                                            conn.release();
                                                            next();
                                                        }
                                                    }
                                                );
                                            }
                                        }
                                    );
                                }
                            });
                        }
                    }
                });
            }
        });
    }

    //공급업체 등록 상품 가져오기
    async selectProduct(req, res, next) {
        pool.getConnection((err, conn) => {
            if (err) throw err;
            else {
                // 공급업체인지 확인하기???
                const ynSql = `SELECT * FROM company WHERE user_id = "${req.session.user_id}"`;

                conn.query(ynSql, (err, yn) => {
                    console.log("에러1");
                    if (err) {
                        res.send(
                            '<script type="text/javascript">alert("공급업체 회원이 아닙니다.");history.back();</script>'
                        );
                    } else {
                        // 등록 상품 출력
                        const productSql = `SELECT * FROM product as p, image as i WHERE p.company_num = "${yn[0].company_num}" AND p.product_num = i.fk_product_num AND i.image_seq = 1`;

                        conn.query(productSql, (err, product) => {
                            console.log("에러5");
                            if (err) throw err;
                            else {
                                req.product = product;
                                console.log(product);

                                const ynSql = `SELECT * FROM company WHERE user_id = "${req.session.user_id}"`;
                                const sql = `SELECT * FROM orders as o, orderinfo as i, product as p WHERE o.order_num = i.order_num AND i.product_num = p.product_num AND p.company_num = "${yn[0].company_num}" AND o.order_state LIKE "환불%%"`;

                                conn.query(ynSql, (err, yn) => {
                                    console.log("에러1");
                                    if (err) {
                                        res.send(
                                            '<script type="text/javascript">alert("공급업체 회원이 아닙니다.");history.back();</script>'
                                        );
                                    } else {
                                        conn.query(sql, (err, row) => {
                                            if (err) throw err;
                                            else {
                                                req.refund = row;
                                                conn.release();
                                                next();
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }

    //공급업체 상품 등록
    async insertProduct(req, res, next) {
        pool.getConnection((err, conn) => {
            if (err) throw err;
            else {
                if (
                    req.body.product_name == "" ||
                    req.body.product_price == "" ||
                    req.body.product_value == "" ||
                    req.body.product_detail == "" ||
                    req.body.product_sort == "" ||
                    req.body.product_date == "" ||
                    req.body.product_weight == "" ||
                    req.body.product_method == "" ||
                    req.body.product_before_price == ""
                ) {
                    res.send(
                        '<script type="text/javascript">alert("정보를 입력해주세요.");history.back();</script>'
                    );
                }

                console.log(req.body.product_value);
                console.log();

                const sql = `INSERT INTO product(?,?,?,?,?,?,?,?,?) VALUES (?,?,?,?,?,?,?,?,?)`;
                const val = [
                    req.body.product_name,
                    req.body.product_price,
                    req.body.product_value,
                    req.body.product_detail,
                    req.body.product_sort,
                    req.body.product_date,
                    req.body.product_weight,
                    req.body.product_method,
                    req.session.company_num,
                ];

                conn.query(`INSERT INTO product values(?,?,?,?,?,?,?,?,?,?,?,?)`,[
                        null, 
                        req.body.product_name, 
                        req.body.product_price,
                        req.body.product_value,
                        req.body.product_detail,
                        req.body.product_sort,
                        req.body.product_date,
                        req.body.product_weight,
                        req.body.product_method,
                        req.session.company_num,
                        '판매중',
                        req.body.product_before_price
                ], (err, row) => {
                    if (err) throw err;
                    else {

                        conn.query('select max(product_num) as product_num from product',
                        (err, max_product_num)=>{
                            if(err) throw err;

                            for(var i = 0; i<req.files.length; i++){
                                conn.query('insert into image values(?,?,?,?)',[
                                    null, req.files[i].filename, i+1, max_product_num[0].product_num 
                                ], (err)=>{
                                    if(err) throw err;
                                })
                            }

                            conn.release();
                            next();
                        })
                        
                    }
                });
            }
        });
    }

    //공급업체 판매 종료
    async updateProductState(req, res, next) {
        pool.getConnection((err, conn) => {
            if (err) throw err;
            else {
                const sql2 = `SELECT * FROM product WHERE product_num = "${req.params.product_num}"`;
                const sql = `UPDATE product SET product_state = "판매종료" WHERE product_num = "${req.params.product_num}"`;

                conn.query(sql2, (err, row2) => {
                    console.log("에러1");
                    if (err) throw err;
                    else {
                        if (row2[0].product_state == "판매종료") {
                            res.send(
                                '<script type="text/javascript">alert("이미 판매가 중지된 상품입니다.");history.back();</script>'
                            );
                        } else {
                            conn.query(sql, (err, row) => {
                                if (err) throw err;
                                else {
                                    conn.release();
                                    next();
                                }
                            });
                        }
                    }
                });
            }
        });
    }

    //상품 수정
    async updateProduct(req, res, next) {
        pool.getConnection((err, conn) => {
            if (err) throw err;
            else {
                if (
                    req.body.product_price == "" ||
                    req.body.product_value == "" ||
                    req.body.product_detail == "" ||
                    req.body.product_date == ""
                ) {
                    res.send(
                        '<script type="text/javascript">alert("정보를 입력해주세요.");history.back();</script>'
                    );
                }

                // 날짜 검사해서 현재 날짜보다 전의 날짜 입력하면 전 페이지로 돌아가게 해야될 것 같음
                const sql = `UPDATE product SET product_price = ?, product_value = ?, product_detail = ?, product_date == ? WHERE product_num = "${req.params.product_num}"`;
                const val = [
                    req.body.product_price,
                    req.body.product_value,
                    req.body.product_detail,
                    req.body.product_date,
                ];

                conn.query(sql, val, (err, row) => {
                    if (err) throw err;
                    else {
                        console.log(row);
                        conn.release();
                        next();
                    }
                });
            }
        });
    }

    //공급업체 주문 관리 페이지 - 배송 주문, 직거래 주문 가져오기
    async selectOrder(req, res, next) {
        pool.getConnection((err, conn) => {
            if (err) throw err;
            else {
                const ynSql = `SELECT * FROM company WHERE user_id = "${req.session.user_id}"`;

                conn.query(ynSql, (err, yn) => {
                    console.log("에러1");
                    if (err) {
                        res.send(
                            '<script type="text/javascript">alert("공급업체 회원이 아닙니다.");history.back();</script>'
                        );
                    } else {
                        // 배송
                        const sql = `SELECT * FROM orders as o, orderinfo as i, product as p WHERE o.order_num = i.order_num AND i.product_num = p.product_num AND p.company_num = "${yn[0].company_num}" AND o.order_direct_whether = "N"`;
                        // 직거래
                        const sql2 = `SELECT * FROM orders as o, orderinfo as i, product as p WHERE o.order_num = i.order_num AND i.product_num = p.product_num AND p.company_num = "${yn[0].company_num}" AND o.order_direct_whether = "Y"`;
                        conn.query(sql, (err, row1) => {
                            console.log("에러2");
                            if (err) throw err;
                            else {
                                conn.query(sql2, (err, row2) => {
                                    console.log("에러3");
                                    if (err) throw err;
                                    else {
                                        req.directY = row2;
                                        req.directN = row1;
                                        console.log(row1);
                                        console.log(row2);

                                        conn.release();
                                        next();
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }

    // 배송 주문, 직거래 주문 항목 가져오기
    async selectOrderDetail(req, res, next) {
        pool.getConnection((err, conn) => {
            if (err) throw err;
            else {
                const sql = `SELECT * FROM orders as o, orderinfo as i WHERE o.order_num = i.order_num AND o.order_num = "${req.params.order_num}"`;
                const sql4 = `SELECT * FROM orders, orderinfo, users, area, product WHERE orders.order_num = orderinfo.order_num AND orders.order_num = "${req.params.order_num}" AND users.user_id = orders.user_id AND users.area_num = area.area_num AND orderinfo.product_num = product.product_num;`;

                conn.query(sql4, (err, row) => {
                    if (err) throw err;
                    else {
                        req.detail = row;
                        conn.release();
                        next();
                    }
                });
            }
        });
    }

    //주문 상태 변경
    async updateOrderState(req, res, next) {
        pool.getConnection((err, conn) => {
            if (err) throw err;
            else {
                console.log(req.body.state);

                if (req.body.state == 1) {
                    const sql = `UPDATE orders SET order_state = "배송중" WHERE order_num = "${req.params.order_num}"`;

                    conn.query(sql, (err, row) => {
                        if (err) throw err;
                        else {
                            conn.release();
                            next();
                        }
                    });
                } else if (req.body.state == 2) {
                    const sql2 = `UPDATE orders SET order_state = "배송완료" WHERE order_num = "${req.params.order_num}"`;

                    conn.query(sql2, (err, row) => {
                        if (err) throw err;
                        else {
                            conn.release();
                            next();
                        }
                    });
                } else if (req.body.state == 3) {
                    const sql3 = `UPDATE orders SET order_state = "상품준비" WHERE order_num = "${req.params.order_num}"`;

                    conn.query(sql3, (err, row) => {
                        if (err) throw err;
                        else {
                            conn.release();
                            next();
                        }
                    });
                } else if (req.body.state == 4) {
                    const sql4 = `UPDATE orders SET order_state = "상품수령대기" WHERE order_num = "${req.params.order_num}"`;

                    conn.query(sql4, (err, row) => {
                        if (err) throw err;
                        else {
                            conn.release();
                            next();
                        }
                    });
                } else if (req.body.state == 5) {
                    const sql5 = `UPDATE orders SET order_state = "상품수령완료" WHERE order_num = "${req.params.order_num}"`;

                    conn.query(sql5, (err, row) => {
                        if (err) throw err;
                        else {
                            conn.release();
                            next();
                        }
                    });
                }
            }
        });
    }

    //환불 목록
    async selectRefund(req, res, next) {
        pool.getConnection((err, conn) => {
            if (err) throw err;
            else {
                const ynSql = `SELECT * FROM company WHERE user_id = "${req.session.user_id}"`;
                const sql = `SELECT * FROM orders as o, orderinfo as i, product as p WHERE o.order_num = i.order_num AND i.product_num = p.product_num AND p.company_num = "${yn[0].company_num}" AND o.order_state LIKE "환불%%"`;

                conn.query(ynSql, (err, yn) => {
                    console.log("에러1");
                    if (err) {
                        res.send(
                            '<script type="text/javascript">alert("공급업체 회원이 아닙니다.");history.back();</script>'
                        );
                    } else {
                        conn.query(sql, (err, row) => {
                            if (err) throw err;
                            else {
                                req.refund = row;
                                conn.release();
                                next();
                            }
                        });
                    }
                });
            }
        });
    }

    //환불 상세
    async refundDetail(req, res, next) {
        pool.getConnection((err, conn) => {
            if (err) throw err;
            else {
                //const sql = `SELECT * FROM orders WHERE order_num = "${req.params.order_num}"`;
                const sql = `SELECT * FROM orders, orderinfo, product WHERE orders.order_num = "${req.params.order_num}" AND orders.order_num = orderinfo.order_num AND orderinfo.product_num = product.product_num`;

                conn.query(sql, (err, row) => {
                    if (err) throw err;
                    else {
                        req.refund = row;
                        conn.release();
                        next();
                    }
                });
            }
        });
    }

    //환불 처리
    async updateRefund(req, res, next) {
        pool.getConnection((err, conn) => {
            if (err) throw err;
            else {
                const sql = `UPDATE orders SET order_state = "환불완료" WHERE order_num = "${req.params.order_num}"`;

                conn.query(sql, (err, row) => {
                    if (err) throw err;
                    else {
                        conn.release();
                        next();
                    }
                });
            }
        });
    }

    //통계 리스트
    async selectTotal(req, res, next) {
        pool.getConnection((err, conn) => {
            if (err) throw err;
            else {
                const ynSql = `SELECT * FROM company WHERE user_id = "${req.session.user_id}"`;

                conn.query(ynSql, (err, yn) => {
                    console.log("에러1");
                    if (err) {
                        res.send(
                            '<script type="text/javascript">alert("공급업체 회원이 아닙니다.");history.back();</script>'
                        );
                    } else {
                        const sql = `SELECT * FROM total as t, company as c WHERE t.company_num = "${yn[0].company_num}" AND t.company_num = c.company_num`;
                        conn.query(sql, (err, row) => {
                            if (err) throw err;
                            else {
                                req.total = row;
                                conn.release();
                                next();
                            }
                        });
                    }
                });
            }
        });
    }
}

module.exports = companyController;
