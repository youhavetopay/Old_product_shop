const e = require("express");
const pool = require("../dbconfig/dbconfig")

class mainController {
    async selectProduct (req, res, next) {
        pool.getConnection((err, conn) => {
            if (err) throw err;
            else {

                if (req.body.potato != null) {
                    // 감자 상품 들고 오기
                    const sql = `SELECT * FROM product WHERE product_sort = "${req.body.potato}"`

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
                    const sql = `SELECT * FROM product WHERE product_sort = "${req.body.sweet_potato}"`

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
                    const sql = `SELECT * FROM product WHERE product_sort = "${req.body.mushroom}"`

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
                    const sql = `SELECT * FROM product WHERE product_sort = "${req.body.pumpkin}"`

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
                    const sql = `SELECT * FROM product WHERE product_sort = "${req.body.onion}"`

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
                    const sql = `SELECT p.*, COUNT(o.order_num) FROM orderinfo as o, product as p WHERE o.product_num = p.product_num GROUP BY o.product_num ORDER BY DESC limit 8`

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
                    const sql = `SELECT * FROM product WHERE date(product_date) = date(now()) ORDER_BY product_date ASC`

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
                    const sql = `SELECT p.*, COUNT(o.order_num) FROM orderinfo as o, product as p WHERE o.product_num = p.product_num GROUP BY o.product_num ORDER BY DESC`

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



}

module.exports = mainController;
