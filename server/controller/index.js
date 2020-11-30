const e = require("express");
const pool = require("../dbconfig/dbconfig")

class mainController {
    async selectProduct(req, res, next) {
        pool.getConnection((err, conn) => {
            if (err) throw err;
            else {

                if (req.body.potato != null) {
                    // 감자 상품 들고 오기
                    const sql = `SELECT * FROM product WHERE product_sort = "${req.body.potato}" and product_state = "판매중"`

                    conn.query(sql, (err, row) => {
                        console.log("에러1");
                        if (err) throw err;
                        else {
                            req.productinfo = row
                            next();
                        }
                    })
                } else if (req.body.sweet_potato != null) {
                    // 고구마 상품 들고 오기
                    const sql = `SELECT * FROM product WHERE product_sort = "${req.body.sweet_potato}" and product_state = "판매중"`

                    conn.query(sql, (err, row) => {
                        console.log("에러2");
                        if (err) throw err;
                        else {
                            req.productinfo = row
                            next();
                        }
                    })
                } else if (req.body.mushroom != null) {

                    // 버섯 상품 들고 오기
                    const sql = `SELECT * FROM product WHERE product_sort = "${req.body.mushroom}" and product_state = "판매중"`

                    conn.query(sql, (err, row) => {
                        console.log("에러3");
                        if (err) throw err;
                        else {
                            req.productinfo = row
                            next();
                        }
                    })
                } else if (req.body.pumpkin != null) {
                    // 호박 상품 들고 오기
                    const sql = `SELECT * FROM product WHERE product_sort = "${req.body.pumpkin}" and product_state = "판매중"`

                    conn.query(sql, (err, row) => {
                        console.log("에러4");
                        if (err) throw err;
                        else {
                            req.productinfo = row
                            next();
                        }
                    })
                } else if (req.body.onion != null) {
                    // 양파 상품 들고 오기
                    const sql = `SELECT * FROM product WHERE product_sort = "${req.body.onion}" and product_state = "판매중"`

                    conn.query(sql, (err, row) => {
                        console.log("에러5");
                        if (err) throw err;
                        else {
                            req.productinfo = row
                            next();
                        }
                    })
                } else if (req.body.best != null) {

                    // 인기상품 들고 오기 최대 8개
                    const sql = `SELECT p.*, COUNT(o.order_num) FROM orderinfo as o, product as p WHERE o.product_num = p.product_num and p.product_state = '판매중' GROUP BY o.product_num ORDER BY COUNT(o.order_num) DESC limit 8`

                    conn.query(sql, (err, row) => {
                        console.log("에러6");
                        if (err) throw err;
                        else {
                            req.productinfo = row
                            next();
                        }
                    })
                } else if (req.body.date != null) {
                    // 판매마감 임박 상품 들고 오기
                    const sql = `SELECT * FROM product WHERE date(product_date) = date(now()) and product_state = '판매중' ORDER BY product_date ASC`

                    conn.query(sql, (err, row) => {
                        console.log("에러7");
                        if (err) throw err;
                        else {
                            req.productinfo = row
                            next();
                        }
                    })
                } else {
                    // 인기상품 가져오기 전부?
                    const sql = `SELECT p.*, COUNT(o.order_num) FROM orderinfo as o, product as p WHERE o.product_num = p.product_num and p.product_state = '판매중' GROUP BY o.product_num ORDER BY DESC`

                    conn.query(sql, (err, row) => {
                        console.log("에러8");
                        if (err) throw err;
                        else {
                            req.productinfo = row
                            next();
                        }
                    })
                }
            }
        })
    }

    async selectSortMethod(req, res, next) {
        pool.getConnection((err, conn) => {

            // 등록순 했을 때
            if (req.body.sortValue == 1) {
                conn.query('select * from product, image where image.image_seq = 1 and product.product_num = image.fk_product_num and product_state = ?', [
                    '판매중'
                ], (err, create_level) => {
                    if (err) throw err;

                    req.sortProductList = create_level

                    conn.release();
                    next();
                })
            }
            // 높은 가격순으로 했을 때
            else if (req.body.sortValue == 2) {
                conn.query('select * from product, image where image.image_seq = 1 and product.product_num = image.fk_product_num and product_state = ? order by product_price desc', [
                        '판매중'
                    ],
                    (err, high_cost) => {
                        if (err) throw err;

                        req.sortProductList = high_cost;

                        conn.release();
                        next();
                    })
            }

            // 낮은 가격순으로 했을 때
            else if (req.body.sortValue == 3) {
                conn.query('select * from product, image where image.image_seq = 1 and product.product_num = image.fk_product_num and product_state = ? order by product_price', [
                    '판매중'
                ], (err, low_cost) => {

                    req.sortProductList = low_cost
                    conn.release();
                    next();
                })
            }

            // 리뷰갯수로 했을 때
            else {
                conn.query(`(select pd.*, reviewLevel.*, img.* from product as pd 
                    join 
                    (select product_num ,count(*) as review_count from review group by product_num order by review_count) as reviewLevel 
                    join
                    (select * from image where image.image_seq = 1) as img
                    on pd.product_num = reviewLevel.product_num and img.fk_product_num = reviewLevel.product_num and pd.product_state = '판매중'
                    ) order by review_count desc`,
                    (err, review_sort) => {
                        if (err) throw err;

                        req.sortProductList = review_sort;
                        conn.release();
                        next();
                    })
            }
        })
    }



}

module.exports = mainController;