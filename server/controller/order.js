const pool = require("../dbconfig/dbconfig")

class orderController {

    async getOrderProduct(req, res, next) {
        pool.getConnection((err, conn) => {
            if (err) throw err;

            if (req.body.product_num.length == 1) {
                conn.query('select * from product, image where image_seq = 1 and product_num = ? and product_num = fk_product_num', [
                    req.body.product_num
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

                            req.total_money = order_product_list[0].product_price * req.body.order_count

                            conn.release();
                            next();

                        })
                    })

                })
            } else {
                conn.query(`SELECT p.*, i.image_content, bi.bakset_sum
                from product p, image i, baksetinfo bi, bakset b
                WHERE p.product_num = i.fk_product_num AND i.image_seq = 1 AND p.product_num = bi.product_num AND b.user_id = ?
                `, [
                    req.session.user_id
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

                            req.total_money = order_product_list[0].product_price * req.body.order_count

                            conn.release();
                            next();

                        })
                    })
                })
            }
        })
    }
}

module.exports = orderController;