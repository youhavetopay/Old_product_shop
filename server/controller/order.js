const pool = require("../dbconfig/dbconfig")
let moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");


class orderController {


    async deleteProduct_basket(req, res, next) {
        pool.getConnection((err, conn) => {
            if (err) throw err;

            conn.query('select * from bakset where user_id = ?', [
                req.session.user_id
            ], (err, basket_num) => {
                if (err) throw err;

                conn.query('delete from baksetinfo where basket_num =? and product_num = ?', [
                    basket_num[0].basket_num, parseInt(req.body.product_num)
                ], (err) => {
                    if (err) throw err;

                    conn.release();
                    next();
                })
            })


        })
    }



    // 장바구니에 추가하기
    async addBasketInProduct(req, res, next) {
        pool.getConnection((err, conn) => {
            if (err) throw err;

            conn.query('select * from bakset where user_id = ?', [
                req.session.user_id
            ], (err, check_basket) => {
                if (err) throw err;

                if (check_basket.length <= 0) {

                    conn.query('insert into bakset values(?,?,?)', [
                        null,
                        moment().format('YYYY-MM-DD HH:MM:SS'),
                        req.session.user_id
                    ], (err) => {
                        if (err) throw err;

                    })
                }

                conn.query('select * from bakset where user_id = ?', [
                    req.session.user_id
                ], (err, basket_num) => {
                    if (err) throw err;

                    conn.query('select * from baksetinfo where basket_num = ? and product_num = ?', [
                        basket_num[0].basket_num, req.body.product_num
                    ], (err, in_basket) => {
                        if (err) throw err;
                        console.log(basket_num[0].basket_num);
                        console.log(req.body.product_num);
                        console.log(in_basket.length);

                        if (in_basket.length <= 0) {
                            conn.query('insert into baksetinfo values(?,?,?)', [
                                basket_num[0].basket_num, parseInt(req.body.product_num), parseInt(req.body.product_count)
                            ], (err) => {
                                if (err) throw err;

                                conn.release();
                                next();
                            })
                        } else {
                            conn.query('update baksetinfo set bakset_sum = bakset_sum + ? where basket_num = ? and product_num = ?', [
                                parseInt(req.body.product_count), basket_num[0].basket_num, parseInt(req.body.product_num)
                            ], (err) => {
                                if (err) throw err;

                                conn.release();
                                next();
                            })
                        }
                    })


                })
            })

        })
    }


    // 장바구니 들어왔을 때 장바구니 목록 보여주기
    async getBasketList(req, res, next) {
        pool.getConnection((err, conn) => {
            if (err) throw err;

            req.basket_empty_check = false;
            conn.query(`select basket_num from bakset where user_id = ?`, [
                req.session.user_id
            ], (err, basket_num) => {
                if (err) throw err;

                if (basket_num.length <= 0) {
                    conn.query('insert into bakset values(?,?,?)', [
                        null,
                        moment().format('YYYY-MM-DD HH:MM:SS'),
                        req.session.user_id
                    ], (err) => {
                        if (err) throw err;

                        conn.release();
                        next();
                    })
                } else {
                    conn.query(`SELECT p.product_num, p.product_name, p.product_price, i.image_content, bi.bakset_sum, 
                    case when (p.product_num in(select product_num from product where product.company_num in (select bookmark.company_num from bookmark where user_id = ?))) 
                                    then round(product_price * 0.95)
                                    else product_price end as new_price
                                    from product p, image i, baksetinfo bi, bakset b
                                    WHERE p.product_num = i.fk_product_num AND i.image_seq = 1 AND p.product_num = bi.product_num and bi.basket_num = b.basket_num AND b.user_id = ?`, [
                        req.session.user_id, req.session.user_id
                    ], (err, basket_product_list) => {
                        if (err) throw err;

                        req.basket_empty_check = true;
                        if (basket_product_list.length <= 0) {
                            req.basket_empty_check = false;
                        }

                        req.basket_list = basket_product_list;
                        conn.release();
                        next();
                    })
                }
            })
        })
    }

    // 주문정보 띄어주기
    async getOrderProduct(req, res, next) {
        pool.getConnection((err, conn) => {
            if (err) throw err;

            if (req.body.product_num.length == 1) {
                console.log('바로주문 목록 하고있음에서 가져오고 있음');
                conn.query(`select p.product_num, p.product_name, p.product_price, i.image_content, case when (product_num in(select product_num from product where company_num in (select company_num from bookmark where user_id = ?))) 
                then round(product_price * 0.95)
                else product_price end as new_price from product p, image i where image_seq = 1 and product_num = ? and product_num = fk_product_num`, [
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
                            req.basket_check = false;
                            req.total_money = order_product_list[0].new_price * req.body.order_count

                            conn.release();
                            next();

                        })
                    })

                })
            } else {
                console.log('장바구니에서 가져오고 있음');
                conn.query(`SELECT p.product_num, p.product_name, p.product_price, i.image_content, bi.bakset_sum, 
                case when (p.product_num in(select product_num from product where product.company_num in (select bookmark.company_num from bookmark where user_id = ?))) 
                                then round(product_price * 0.95)
                                else product_price end as new_price
                                from product p, image i, baksetinfo bi, bakset b
                                WHERE p.product_num = i.fk_product_num AND i.image_seq = 1 AND p.product_num = bi.product_num and bi.basket_num = b.basket_num AND b.user_id = ?
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
                            req.basket_check = true;
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
                conn.query('select * from coupon where coupon_num = ? and coupon_whether = ?', [
                    req.body.coupon, 'N'
                ], (err, check_coupon) => {
                    if (err) throw err;

                    if (check_coupon.length <= 0) {
                        // 쿠폰 실패

                        res.send(`<script type="text/javascript">
                                alert("쿠폰번호가 잘못되었습니다..."); 
                                history.back();
                                </script>`)

                    } else {

                        conn.query('update coupon set coupon_whether = ? where coupon_num =?', [
                            'Y', req.body.coupon
                        ], (err) => {
                            if (err) throw err;
                            req.couponcheck = 1000;

                            console.log(req.couponcheck);
                        })

                    }

                })
            }

            // 바로주문
            console.log(req.body.product_count, '바로주문인지 아닌지 확인하기');
            if (req.body.product_count != 0) {

                console.log('바로주문');

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


                        console.log(req.body.post_num, 'post_num');

                        var real_total_money = 0

                        if (product_info[0].new_price * req.body.product_count - req.couponcheck < 0) {
                            real_total_money = 0
                        } else {
                            real_total_money = product_info[0].new_price * req.body.product_count - req.couponcheck
                        }

                        // 직거래 거래
                        if (req.body.post_num != -1) {

                            console.log('직거래');

                            conn.query('insert into orders values(?,?,?,?,?,?,?,?,?,?,?,?)', [
                                null,
                                real_total_money,
                                moment().format('YYYY-MM-DD HH:mm:ss'),
                                card_info[0].card_num,
                                card_info[0].card_validity,
                                card_info[0].card_cvc,
                                req.body.post_num,
                                req.body.main_adr,
                                req.body.detail_adr,
                                '주문완료',
                                'Y',
                                req.session.user_id
                            ], (err) => {
                                if (err) throw err;
                                //가장 최근 주문 번호 가져오기
                                conn.query('select max(order_num) as order_num from orders where user_id = ?', [
                                    req.session.user_id
                                ], (err, order_num) => {
                                    if (err) throw err;

                                    var real_discount_money = 0
                                    if (((product_info[0].product_price -  product_info[0].new_price) + req.couponcheck) < 0) {
                                        real_discount_money = product_info[0].product_price
                                    } else {
                                        real_discount_money = (product_info[0].product_price - product_info[0].new_price) + req.couponcheck
                                    }

                                    console.log(real_discount_money, '할인 금액');
                                    // orderinfo에 값 넣기
                                    conn.query('insert into orderinfo values(?,?,?,?,?)', [
                                        parseInt(req.body.product_num),
                                        order_num[0].order_num,
                                        product_info[0].product_price * parseInt(req.body.product_count),
                                        req.body.product_count,
                                        real_discount_money
                                    ], (err) => {
                                        if (err) throw err;

                                        // 재고량 업데이트
                                        conn.query('update product set product_value = ? where product_num = ?', [
                                            product_info[0].product_value - req.body.product_count, req.body.product_num
                                        ], (err) => {
                                            if (err) throw err;

                                            conn.release();
                                            next();
                                        })

                                    })
                                })
                            })
                        } else {
                            console.log('배송주문');
                            console.log(req.body.post_num, 'else post_num');
                            //배송주문
                            conn.query('select * from place where place_id = ?', [
                                req.body.address_num
                            ], (err, address_info) => {
                                if (err) throw err;

                                conn.query('insert into orders values(?,?,?,?,?,?,?,?,?,?,?,?)', [
                                    null,
                                    real_total_money,
                                    moment().format('YYYY-MM-DD HH:mm:ss'),
                                    card_info[0].card_num,
                                    card_info[0].card_validity,
                                    card_info[0].card_cvc,
                                    address_info[0].place_num,
                                    address_info[0].place_addr,
                                    address_info[0].place_addrinfo,
                                    '주문완료',
                                    'N',
                                    req.session.user_id
                                ], (err) => {
                                    if (err) throw err;

                                    //가장 최근 주문 번호 가져오기
                                    conn.query('select max(order_num) as order_num from orders where user_id = ?', [
                                        req.session.user_id
                                    ], (err, order_num) => {
                                        if (err) throw err;

                                        var bookmark_discount = 0;

                                        var real_discount_money = 0
                                        if (((product_info[0].product_price -  product_info[0].new_price) + req.couponcheck) < 0) {
                                            real_discount_money = product_info[0].product_price
                                        } else {
                                            real_discount_money = (product_info[0].product_price - product_info[0].new_price) + req.couponcheck
                                        }

                                        console.log(real_discount_money, '할인 금액');
                                        // orderinfo에 값 넣기
                                        conn.query('insert into orderinfo values(?,?,?,?,?)', [
                                            parseInt(req.body.product_num),
                                            order_num[0].order_num,
                                            product_info[0].product_price * parseInt(req.body.product_count),
                                            req.body.product_count,
                                            real_discount_money
                                        ], (err) => {
                                            if (err) throw err;

                                            // 재고량 업데이트
                                            conn.query('update product set product_value = ? where product_num = ?', [
                                                product_info[0].product_value - req.body.product_count, req.body.product_num
                                            ], (err) => {
                                                if (err) throw err;

                                                conn.release();
                                                next();
                                            })

                                        })
                                    })
                                })
                            })
                        }

                    })

                })

            }
            // 장바구니 주문
            else {
                console.log('장바구니주문');
                // 장바구니에 담긴 상품 정보 가져오기
                conn.query(`SELECT p.*, bi.bakset_sum, 
                case when (p.product_num in(select product_num from product where product.company_num in (select bookmark.company_num from bookmark where user_id = ?))) 
                                then round(product_price * 0.95)
                                else product_price end as new_price
                                from product p, baksetinfo bi, bakset b
                                WHERE p.product_num = bi.product_num AND b.user_id = ?`, [
                    req.session.user_id, req.session.user_id
                ], (err, basket_info) => {
                    if (err) throw err;

                    conn.query('select * from card where card_num = ?', [
                        req.body.card_num
                    ], (err, card_info) => {
                        if (err) throw err;

                        var total_price = 0
                        for (var j = 0; j < basket_info.length; j++) {
                            total_price += basket_info[j].bakset_sum * basket_info[j].new_price
                        }

                        console.log(total_price, '총가격');

                        var real_total_money = 0

                        if (total_price - req.couponcheck < 0) {
                            real_total_money = 0
                        } else {
                            real_total_money = total_price - req.couponcheck
                        }
                        console.log(real_total_money);

                        console.log(req.body.post_num);

                        // 직거래
                        if (req.body.post_num != -1) {
                            console.log('직거래');
                            conn.query('insert into orders values(?,?,?,?,?,?,?,?,?,?,?,?)', [
                                null,
                                real_total_money,
                                moment().format('YYYY-MM-DD HH:mm:ss'),
                                card_info[0].card_num,
                                card_info[0].card_validity,
                                card_info[0].card_cvc,
                                req.body.post_num,
                                req.body.main_adr,
                                req.body.detail_adr,
                                '주문완료',
                                'Y',
                                req.session.user_id
                            ], (err) => {
                                if (err) throw err;
                                conn.query('select max(order_num) as order_num from orders',
                                    (err, order_num) => {
                                        if (err) throw err;

                                        var sales_money = req.couponcheck;
                                        var temp_coupon_money = req.couponcheck;

                                        for (var i = 0; i < basket_info.length; i++) {
                                            
                                            if(i == 0){
                                                conn.query('insert into orderinfo values(?,?,?,?,?)', [
                                                    basket_info[i].product_num,
                                                    order_num[0].order_num,
                                                    basket_info[i].product_price * basket_info[i].bakset_sum,
                                                    basket_info[i].bakset_sum,
                                                    req.couponcheck
                                                ], (err) => {
                                                    if (err) throw err;
                                                })
                                            }
                                            else{
                                                conn.query('insert into orderinfo values(?,?,?,?,?)', [
                                                    basket_info[i].product_num,
                                                    order_num[0].order_num,
                                                    basket_info[i].product_price * basket_info[i].bakset_sum,
                                                    basket_info[i].bakset_sum,
                                                    0
                                                ], (err) => {
                                                    if (err) throw err;
                                                })
                                            }


                                            conn.query('update product set product_value = product_value - ? where product_num = ?', [
                                                basket_info[i].bakset_sum, basket_info[i].product_num
                                            ], (err) => {
                                                if (err) throw err;
                                            })
                                        }

                                        conn.query('select basket_num from bakset where user_id = ?', [
                                            req.session.user_id
                                        ], (err, basket_num) => {
                                            if (err) throw err;

                                            conn.query('delete from baksetinfo where basket_num = ?', [
                                                basket_num[0].basket_num
                                            ], (err) => {
                                                if (err) throw err;

                                                conn.release();
                                                next();
                                            })
                                        })

                                    })
                            })
                        }

                        //배송주문
                        else {
                            console.log('배송주문');
                            // 배송지 정보가져오기
                            conn.query('select * from place where place_id = ?', [
                                req.body.address_num
                            ], (err, address_info) => {
                                if (err) throw err;


                                conn.query('insert into orders values(?,?,?,?,?,?,?,?,?,?,?,?)', [
                                    null,
                                    real_total_money,
                                    moment().format('YYYY-MM-DD HH:mm:ss'),
                                    card_info[0].card_num,
                                    card_info[0].card_validity,
                                    card_info[0].card_cvc,
                                    address_info[0].place_num,
                                    address_info[0].place_addr,
                                    address_info[0].place_addrinfo,
                                    '주문완료',
                                    'N',
                                    req.session.user_id
                                ], (err) => {
                                    if (err) throw err;

                                    conn.query('select max(order_num) as order_num from orders',
                                        (err, order_num) => {
                                            if (err) throw err;

                                            var sales_money = req.couponcheck;
                                            var temp_coupon_money = req.couponcheck;




                                            for (var i = 0; i < basket_info.length; i++) {
                                                if (i == 0) {
                                                    
                                                    conn.query('insert into orderinfo values(?,?,?,?,?)', [
                                                        basket_info[i].product_num,
                                                        order_num[0].order_num,
                                                        basket_info[i].product_price * basket_info[i].bakset_sum,
                                                        basket_info[i].bakset_sum,
                                                        sales_money
                                                    ], (err) => {
                                                        if (err) throw err;
                                                    })
                                                } else {
                                                    conn.query('insert into orderinfo values(?,?,?,?,?)', [
                                                        basket_info[i].product_num,
                                                        order_num[0].order_num,
                                                        basket_info[i].product_price * basket_info[i].bakset_sum,
                                                        basket_info[i].bakset_sum,
                                                        0
                                                    ], (err) => {
                                                        if (err) throw err;
                                                    })
                                                }

                                                conn.query('update product set product_value = product_value - ? where product_num = ?', [
                                                    basket_info[i].bakset_sum, basket_info[i].product_num
                                                ], (err) => {
                                                    if (err) throw err;
                                                })
                                            }

                                            conn.query('select basket_num from bakset where user_id = ?', [
                                                req.session.user_id
                                            ], (err, basket_num) => {
                                                if (err) throw err;

                                                conn.query('delete from baksetinfo where basket_num = ?', [
                                                    basket_num[0].basket_num
                                                ], (err) => {
                                                    if (err) throw err;

                                                    conn.release();
                                                    next();
                                                })
                                            })



                                        })
                                })
                            })
                        }



                    })

                })

            }

        })
    }
}

module.exports = orderController;