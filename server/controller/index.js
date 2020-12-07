const e = require("express");
const pool = require("../dbconfig/dbconfig")

class mainController {

    // 메인에 띄어줄 상품목록 가져오기 (인기상품)
    async getProductListMain(req, res, next) {
        pool.getConnection((err, conn) => {
            if (err) throw err;

            conn.query(`select rc.*, img.image_content from (select p.product_num, p.product_price, p.product_state,p.product_name,ifnull(o.order_count, 0) as order_count from product as p
            left outer join
            (select count(*) as order_count, orderinfo.product_num from orderinfo group by orderinfo.product_num) as o
            on  p.product_num = o.product_num) as rc, image as img where rc.product_num = img.fk_product_num 
            and img.image_seq = 1 and rc.product_state = '판매중' order by order_count desc limit 8`,
                (err, main_product_list) => {
                    if (err) throw err;

                    req.main_product_list = main_product_list;
                    conn.release();
                    next();
                })
        })
    }

    async selectProduct(req, res, next) {
        pool.getConnection((err, conn) => {
            if (err) throw err;
            else {

                if (req.body.potato != null) {
                    // 감자 상품 들고 오기
                    const sql = `SELECT * FROM product, image WHERE product_sort = "감자" and product_state = "판매중" and image_seq = 1 and product_num = fk_product_num`

                    conn.query(sql, (err, row) => {
                        console.log("에러1");
                        if (err) throw err;
                        else {
                            req.productinfo = row
                            conn.release();
                            next();
                        }
                    })
                } else if (req.body.sweet_potato != null) {
                    // 고구마 상품 들고 오기
                    const sql = `SELECT * FROM product, image WHERE product_sort = "고구마" and product_state = "판매중" and image_seq = 1 and product_num = fk_product_num`

                    conn.query(sql, (err, row) => {
                        console.log("에러2");
                        if (err) throw err;
                        else {
                            req.productinfo = row
                            conn.release();
                            next();
                        }
                    })
                } else if (req.body.mushroom != null) {

                    // 버섯 상품 들고 오기
                    const sql = `SELECT * FROM product, image WHERE product_sort = "버섯" and product_state = "판매중" and image_seq = 1 and product_num = fk_product_num`

                    conn.query(sql, (err, row) => {
                        console.log("에러3");
                        if (err) throw err;
                        else {
                            req.productinfo = row
                            conn.release();
                            next();
                        }
                    })
                } else if (req.body.pumpkin != null) {
                    // 호박 상품 들고 오기
                    const sql = `SELECT * FROM product, image WHERE product_sort = "호박" and product_state = "판매중" and image_seq = 1 and product_num = fk_product_num`

                    conn.query(sql, (err, row) => {
                        console.log("에러4");
                        if (err) throw err;
                        else {
                            req.productinfo = row
                            conn.release();
                            next();
                        }
                    })
                } else if (req.body.onion != null) {
                    // 양파 상품 들고 오기
                    const sql = `SELECT * FROM product, image WHERE product_sort = "양파" and product_state = "판매중" and image_seq = 1 and product_num = fk_product_num`

                    conn.query(sql, (err, row) => {
                        console.log("에러5");
                        if (err) throw err;
                        else {
                            req.productinfo = row
                            conn.release();
                            next();
                        }
                    })
                } else if (req.body.best != null) {

                    // 인기상품 들고 오기 최대 8개
                    const sql = `select rc.*, img.image_content from (select p.product_num, p.product_price, p.product_state,p.product_name,ifnull(o.order_count, 0) as order_count from product as p
                    left outer join
                    (select count(*) as order_count, orderinfo.product_num from orderinfo group by orderinfo.product_num) as o
                    on  p.product_num = o.product_num) as rc, image as img where rc.product_num = img.fk_product_num 
                    and img.image_seq = 1 and rc.product_state = '판매중' order by order_count desc limit 8`

                    conn.query(sql, (err, row) => {
                        console.log("에러6");
                        if (err) throw err;
                        else {
                            req.productinfo = row
                            conn.release();
                            next();
                        }
                    })
                } else if (req.body.date != null) {
                    // 판매마감 임박 상품 들고 오기
                    const sql = `SELECT * FROM product, image WHERE date(product_date) = date(now()) and product_state = '판매중' and image_seq = 1 and product_num = fk_product_num ORDER BY product_date ASC`

                    conn.query(sql, (err, row) => {
                        console.log("에러7");
                        if (err) throw err;
                        else {
                            req.productinfo = row
                            conn.release();
                            next();
                        }
                    })
                } else {
                    // 인기상품 가져오기 전부?
                    const sql = `select rc.*, img.image_content from (select p.product_num, p.product_price, p.product_state,p.product_name,ifnull(o.order_count, 0) as order_count from product as p
                    left outer join
                    (select count(*) as order_count, orderinfo.product_num from orderinfo group by orderinfo.product_num) as o
                    on  p.product_num = o.product_num) as rc, image as img where rc.product_num = img.fk_product_num 
                    and img.image_seq = 1 and rc.product_state = '판매중' order by order_count desc`

                    conn.query(sql, (err, row) => {
                        console.log("에러8");
                        if (err) throw err;
                        else {
                            req.productinfo = row
                            conn.release();
                            next();
                        }
                    })
                }
            }
        })
    }

    async getSerchProductList(req, res, next){
        pool.getConnection((err, conn)=>{
            if(err) throw err;

            conn.query(`SELECT p.product_num, p.product_name, p.product_price, i.image_content FROM product as p, image as i
            where i.image_seq = 1 and p.product_state = '판매중' and p.product_num = i.fk_product_num and p.product_name like ?`,[
                '%'+req.params.serchValue + '%'
            ], (err, serch_list)=>{
                if(err) throw err;

                req.serchList = serch_list;

                conn.release();
                next();
            })
        })
    }

    // 직거래 가능한 상품 가져오기  나중에 세션넣기
    async getDirectAbleList(req, res, next) {
        pool.getConnection((err, conn) => {
            if (err) throw err;

            conn.query(`select p.product_num, p.product_name, p.product_price, i.image_content from product p, image i 
                    where company_num in(select company_num from company where area_num = ?) 
                    and product_num = fk_product_num 
                    and image_seq = 1 and p.product_state = '판매중'`,[
                        req.session.area_num
                    ],
                (err, direct_List) => {
                    if (err) throw err;

                    req.directList = direct_List;
                    conn.release();
                    next();
                })
        })
    }

    // 판매기간이 오늘까지 인거 가져오기
    async getLastList(req, res, next){
        pool.getConnection((err, conn)=>{
            if(err) throw err;

            conn.query(`SELECT * FROM product, image WHERE date(product_date) = date(now()) and product_state = '판매중' and image_seq = 1 and product_num = fk_product_num ORDER BY product_num`,
                        (err, last_list) => {
                            if (err) throw err;

                            req.lastList = last_list;
                            conn.release();
                            next();
                        })
        })
    }


    // 버섯 상품 가져오기
    async getmushList(req, res, next){
        pool.getConnection((err, conn)=>{
            if(err) throw err;
            
            conn.query('select * from product, image where image.image_seq = 1 and product.product_num = image.fk_product_num and product_state = ? and product_sort = ?', [
                '판매중', '버섯'
            ], (err, mush_list) => {
                if (err) throw err;

                req.mushList = mush_list
                conn.release();
                next();
            })
        })
    }


    // 양파 상품 가져오기
    async getOnionList(req, res, next){
        pool.getConnection((err, conn)=>{
            if(err) throw err;
            
            conn.query('select * from product, image where image.image_seq = 1 and product.product_num = image.fk_product_num and product_state = ? and product_sort = ?', [
                '판매중', '양파'
            ], (err, onion_list) => {
                if (err) throw err;

                req.onionList = onion_list
                conn.release();
                next();
            })
        })
    }


    // 감자 상품 가져오기
    async getPotatoList(req, res, next){
        pool.getConnection((err, conn)=>{
            if(err) throw err;
            
            conn.query('select * from product, image where image.image_seq = 1 and product.product_num = image.fk_product_num and product_state = ? and product_sort = ?', [
                '판매중', '감자'
            ], (err, potato_list) => {
                if (err) throw err;

                req.potatoList = potato_list
                conn.release();
                next();
            })
        })
    }


    // 호박 상품 가져오기
    async getPumkinList(req, res, next){
        pool.getConnection((err, conn)=>{
            if(err) throw err;
            
            conn.query('select * from product, image where image.image_seq = 1 and product.product_num = image.fk_product_num and product_state = ? and product_sort = ?', [
                '판매중', '호박'
            ], (err, pumkin_list) => {
                if (err) throw err;

                req.pumkinList = pumkin_list
                conn.release();
                next();
            })
        })
    }


    // 고구마 상품 가져오기
    async getSweetList(req, res, next){
        pool.getConnection((err, conn)=>{
            if(err) throw err;
            
            conn.query('select * from product, image where image.image_seq = 1 and product.product_num = image.fk_product_num and product_state = ? and product_sort = ?', [
                '판매중', '고구마'
            ], (err, sweet_list) => {
                if (err) throw err;

                req.sweetList = sweet_list
                conn.release();
                next();
            })
        })
    }





    // 정렬 ㅋㅋㅋㅋ
    async selectSortMethod(req, res, next) {
        pool.getConnection((err, conn) => {

            // 등록순 했을 때

            // 인기상품 정렬
            if (req.body.category == 'index') {

                // 등록순 정렬
                if (req.body.sortValue == 1) {
                    conn.query(`select rc.*, img.image_content from (select p.product_num, p.product_price, p.product_state,p.product_name,ifnull(o.order_count, 0) as order_count from product as p
                    left outer join
                    (select count(*) as order_count, orderinfo.product_num from orderinfo group by orderinfo.product_num) as o
                    on  p.product_num = o.product_num) as rc, image as img where rc.product_num = img.fk_product_num 
                    and img.image_seq = 1 and rc.product_state = '판매중' order by product_num limit 8`,
                        (err, create_level) => {
                            if (err) throw err;

                            req.sortProductList = create_level

                            conn.release();
                            next();
                        })
                }
                // 높은 가격순으로 했을 때
                else if (req.body.sortValue == 2) {
                    conn.query(`select rc.*, img.image_content from (select p.product_num, p.product_price, p.product_state,p.product_name,ifnull(o.order_count, 0) as order_count from product as p
                    left outer join
                    (select count(*) as order_count, orderinfo.product_num from orderinfo group by orderinfo.product_num) as o
                    on  p.product_num = o.product_num) as rc, image as img where rc.product_num = img.fk_product_num 
                    and img.image_seq = 1 and rc.product_state = '판매중' order by product_price desc limit 8`,
                        (err, high_cost) => {
                            if (err) throw err;

                            req.sortProductList = high_cost;

                            conn.release();
                            next();
                        })
                }

                // 낮은 가격순으로 했을 때
                else if (req.body.sortValue == 3) {
                    conn.query(`select rc.*, img.image_content from (select p.product_num, p.product_price, p.product_state,p.product_name,ifnull(o.order_count, 0) as order_count from product as p
                    left outer join
                    (select count(*) as order_count, orderinfo.product_num from orderinfo group by orderinfo.product_num) as o
                    on  p.product_num = o.product_num) as rc, image as img where rc.product_num = img.fk_product_num 
                    and img.image_seq = 1 and rc.product_state = '판매중' order by product_price limit 8`, (err, low_cost) => {
                        if (err) throw err;

                        req.sortProductList = low_cost
                        conn.release();
                        next();
                    })
                }

                // 리뷰갯수로 했을 때
                else {
                    conn.query(`select rc.*, img.image_content from (select oc.*, ifnull(rc.review_count, 0) as review_count from (select p.product_num, p.product_price, p.product_state,p.product_name,ifnull(o.order_count, 0) as order_count from product as p
                    left outer join
                    (select count(*) as order_count, orderinfo.product_num from orderinfo group by orderinfo.product_num) as o
                    on  p.product_num = o.product_num) as oc
                    
					left outer join
                    (select count(*) as review_count, review.product_num from review group by review.product_num) as rc
                    
                    on oc.product_num = rc.product_num) as rc, image as img where rc.product_num = img.fk_product_num 
                    and img.image_seq = 1 and rc.product_state = '판매중' order by review_count desc limit 8`,
                        (err, review_sort) => {
                            if (err) throw err;

                            req.sortProductList = review_sort;
                            conn.release();
                            next();
                        })
                }
            }



            ///// 나중에 로그인 할때 세션에 지역값 넣기  지금은 부산꺼만 나옴
            // 직거래 가능한 상품들을 정렬
            else if (req.body.category == 'direct') {

                // 등록순 => 제품번호 순
                if (req.body.sortValue == 1) {
                    conn.query(`select p.product_num, p.product_name, p.product_price, i.image_content from product p, image i 
                    where company_num in(select company_num from company where area_num = ?) 
                    and product_num = fk_product_num 
                    and image_seq = 1 and p.product_state = '판매중'`,[
                        req.session.area_num
                    ],
                        (err, create_level) => {
                            if (err) throw err;

                            req.sortProductList = create_level;
                            conn.release();
                            next();
                        })
                }

                // 높은 가격 순
                else if (req.body.sortValue == 2) {
                    conn.query(`select p.product_num, p.product_name, p.product_price, i.image_content from product p, image i 
                    where company_num in(select company_num from company where area_num = ?) 
                    and product_num = fk_product_num 
                    and image_seq = 1 and p.product_state = '판매중' order by p.product_price desc`,[
                        req.session.area_num
                    ],
                        (err, high_cost) => {
                            if (err) throw err;

                            req.sortProductList = high_cost;

                            conn.release();
                            next();
                        })

                }

                // 낮은 가격 순
                else if (req.body.sortValue == 3) {
                    conn.query(`select p.product_num, p.product_name, p.product_price, i.image_content from product p, image i 
                    where company_num in(select company_num from company where area_num = ?) 
                    and product_num = fk_product_num 
                    and image_seq = 1 and p.product_state = '판매중' order by p.product_price`, [
                        req.session.area_num
                    ],(err, low_cost) => {
                        if (err) throw err;

                        req.sortProductList = low_cost
                        conn.release();
                        next();
                    })
                }

                // 리뷰 많은 순
                else {
                    conn.query(`select rc.*, img.image_content from (select p.product_num, p.product_sort,p.product_price, p.company_num, p.product_state,p.product_name,ifnull(r.review_count, 0) as review_count from product as p
                    left outer join
                    (select count(*) as review_count, review.product_num from review group by review.product_num) as r
                    on  p.product_num = r.product_num
                    where p.company_num in (select company_num from company where area_num = ?)) as rc, image as img where rc.product_num = img.fk_product_num 
                    and img.image_seq = 1 and rc.product_state = '판매중' order by review_count desc`,[
                        req.session.area_num
                    ],
                        (err, review_sort) => {
                            if (err) throw err;

                            req.sortProductList = review_sort;
                            conn.release();
                            next();
                        })
                }

            }

            // 판매마감기간 오늘까지인것들의 정렬
            else if (req.body.category == 'last') {
                // 등록순 => 제품번호 순
                if (req.body.sortValue == 1) {
                    conn.query(`SELECT * FROM product, image WHERE date(product_date) = date(now()) and product_state = '판매중' and image_seq = 1 and product_num = fk_product_num ORDER BY product_num`,
                        (err, create_level) => {
                            if (err) throw err;

                            req.sortProductList = create_level;
                            conn.release();
                            next();
                        })
                }

                // 높은 가격 순
                else if (req.body.sortValue == 2) {
                    conn.query(`SELECT * FROM product, image WHERE date(product_date) = date(now()) and product_state = '판매중' and image_seq = 1 and product_num = fk_product_num ORDER BY product_price desc`,
                        (err, high_cost) => {
                            if (err) throw err;


                            req.sortProductList = high_cost;

                            conn.release();
                            next();
                        })
                }

                // 낮은 가격 순
                else if (req.body.sortValue == 3) {
                    conn.query(`SELECT * FROM product, image WHERE date(product_date) = date(now()) and product_state = '판매중' and image_seq = 1 and product_num = fk_product_num ORDER BY product_price `,
                        (err, low_cost) => {
                            if (err) throw err;


                            req.sortProductList = low_cost;

                            conn.release();
                            next();
                        })

                }

                // 리뷰 많은 순
                else {
                    conn.query(`select rc.*, img.image_content from (select p.product_num, p.product_date,p.product_price, p.product_state,p.product_name,ifnull(r.review_count, 0) as review_count from product as p
                    left outer join
                    (select count(*) as review_count, review.product_num from review group by review.product_num) as r
                    on  p.product_num = r.product_num) as rc, image as img where rc.product_num = img.fk_product_num 
                    and img.image_seq = 1 and rc.product_state = '판매중' and date(rc.product_date) = date(now()) order by review_count desc`,
                        (err, review_sort) => {
                            if (err) throw err;

                            req.sortProductList = review_sort;
                            conn.release();
                            next();
                        })
                }
            }

            // 나머지 개별 카테고리 (감자, 고구마 등등)
            else {

                // 등록 순
                if (req.body.sortValue == 1) {
                    conn.query('select * from product, image where image.image_seq = 1 and product.product_num = image.fk_product_num and product_state = ? and product_sort = ?', [
                        '판매중', req.body.category
                    ], (err, create_level) => {
                        if (err) throw err;

                        req.sortProductList = create_level
                        conn.release();
                        next();
                    })

                    // 높은 가격순
                } else if (req.body.sortValue == 2) {

                    conn.query('select * from product, image where image.image_seq = 1 and product.product_num = image.fk_product_num and product_state = ? and product_sort = ? order by product_price desc', [
                        '판매중', req.body.category
                    ], (err, high_cost) => {
                        if (err) throw err;

                        req.sortProductList = high_cost;

                        conn.release();
                        next();
                    })

                    // 낮은 가격 순
                } else if (req.body.sortValue == 3) {
                    conn.query('select * from product, image where image.image_seq = 1 and product.product_num = image.fk_product_num and product_state = ? and product_sort = ? order by product_price', [
                        '판매중', req.body.category
                    ], (err, low_cost) => {
                        if (err) throw err;

                        req.sortProductList = low_cost
                        conn.release();
                        next();
                    })

                } else if (req.body.sortValue == 4) {

                    //리뷰 많은 순
                    conn.query(`select rc.*, img.image_content from (select p.product_num, p.product_sort,p.product_price, p.product_state,p.product_name,ifnull(r.review_count, 0) as review_count from product as p
                    left outer join
                    (select count(*) as review_count, review.product_num from review group by review.product_num) as r
                    on  p.product_num = r.product_num) as rc, image as img where rc.product_num = img.fk_product_num 
                    and img.image_seq = 1 and rc.product_state = '판매중' and rc.product_sort = ? order by review_count desc`, [
                        req.body.category
                    ], (err, review_sort) => {
                        if (err) throw err;

                        req.sortProductList = review_sort;
                        conn.release();
                        next();
                    })

                }
            }


        })
    }



}

module.exports = mainController;