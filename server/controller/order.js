const pool = require("../dbconfig/dbconfig")
let moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");


class orderController {

    // 주문정보 띄어주기
    async getOrderProduct(req, res, next) {
        pool.getConnection((err, conn) => {
            if (err) throw err;

            if (req.body.product_num.length == 1) {
                conn.query(`select p.product_num, p.product_name, p.product_price, i.image_content, case when (product_num in(select product_num from product where company_num in (select company_num from bookmark where user_id = ?))) 
                then round(product_price * 0.95)
                else product_price end as new_price from product p, image i where image_seq = 1 and product_num = 1 and product_num = fk_product_num`, [
                    req.session.user_id, req.body.product_num
                ], (err, order_product_list) => {
                    if (err) throw err;

                    conn.query('select * from place where user_id = ?', [
                        req.session.user_id
                    ], (err, user_address) => {
                        if (err) throw err;

                        conn.query('select * from card where user_id = ?', [
                            req.session.user_id
                        ], (err, user_card) => {
                            if (err) throw err;


                            req.order_product_list = order_product_list;
                            req.user_address = user_address;
                            req.user_card = user_card;

                            req.total_money = order_product_list[0].new_price * req.body.order_count

                            conn.release();
                            next();

                        })
                    })

                })
            } else {
                conn.query(`SELECT p.product_num, p.product_name, p.product_price, i.image_content, bi.bakset_sum, 
                case when (p.product_num in(select product_num from product where product.company_num in (select bookmark.company_num from bookmark where user_id = ?))) 
                                then round(product_price * 0.95)
                                else product_price end as new_price
                                from product p, image i, baksetinfo bi, bakset b
                                WHERE p.product_num = i.fk_product_num AND i.image_seq = 1 AND p.product_num = bi.product_num AND b.user_id = ?
                `, [
                    req.session.user_id, req.session.user_id
                ], (err, order_product_list) => {
                    if (err) throw err;

                    conn.query('select * from place where user_id = ?', [
                        req.session.user_id
                    ], (err, user_address) => {
                        if (err) throw err;

                        conn.query('select * from card where user_id = ?', [
                            req.session.user_id
                        ], (err, user_card) => {
                            if (err) throw err;

                            var total_money = 0;
                            for (var data of order_product_list) {
                                total_money += data.new_price * data.bakset_sum
                            }


                            req.order_product_list = order_product_list;
                            req.user_address = user_address;
                            req.user_card = user_card;

                            req.total_money = total_money

                            conn.release();
                            next();

                        })
                    })
                })
            }
        })
    }


    // 상품 주문하기
    async userBuyProduct(req, res, next) {
        pool.getConnection((err, conn) => {
            if (err) throw err;

            req.couponcheck = 0

            // 쿠폰 확인하기
            if (req.body.coupon) {
                conn.query('select * from coupon where coupon_num = ?', [
                    req.body.coupon
                ], (err, check_coupon) => {
                    if (err) throw err;

                    if (check_coupon.length <= 0) {
                        // 쿠폰 실패
                    } else {
                        
                        req.couponcheck = 1000;
                    }

                })
            }

            // 바로주문
            if (req.body.product_count) {

                // 개별 상품 정보 들고오기
                conn.query(`select product.*, case when (product_num in(select product_num from product where company_num in (select company_num from bookmark where user_id = ?))) 
                    then round(product_price * 0.95)
                    else product_price end as new_price from product where product_num = ?`, [
                    req.session.user_id, req.body.product_num
                ], (err, product_info) => {
                    if (err) throw err;

                    // 유저의 카드정보 가져오기
                    conn.query('select * from card where card_num = ?', [
                        req.body.card_num
                    ], (err, card_info) => {
                        if (err) throw err;


                        // 직거래 거래
                        if (req.body.post_num) {
                            conn.query('insert into orders values(?,?,?,?,?,?,?,?,?,?,?,?)',[
                                null, 
                                product_info[0].new_price - req.couponcheck,
                                moment().format('YYYY-MM-DD HH:MM:SS'), 
                                card_info[0].card_num, 
                                card_info[0].card_validity,
                                card_info[0].card_cvc,
                                req.body.post_num,
                                req.body.main_adr,
                                req.body.detail_adr,
                                '주문완료',
                                'Y',
                                req.session.user_id
                            ], (err)=>{
                                if(err) throw err;
                                
                            })
                        }

                        //배송주문
                        else {

                        }

                    })

                })

            }
            // 장바구니 주문
            else {
                // 직거래
                if (req.body.post_num) {

                }

                //배송주문
                else {

                }
            }

        })
    }
}

module.exports = orderController;