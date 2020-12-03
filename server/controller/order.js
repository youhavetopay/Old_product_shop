const pool = require("../dbconfig/dbconfig")

class orderController {

    async getOrderProduct(req, res, next){
        pool.getConnection((err, conn)=>{
            if(err) throw err;

            if(req.body.product_num.length == 1){
                conn.query('select * from product, image where image_seq = 1 and product_num = ? and product_num = fk_product_num',[
                    req.body.product_num
                ], (err, order_product_list)=>{
                    if(err) throw err;

                    conn.query('SELECT * FROM place, card where card.user_id = ? and place.user_id = ?;',[
                        req.session.user_id, req.session.user_id
                    ], (err, user_info)=>{
                        if(err) throw err;

                        req.order_product_list = order_product_list;
                        req.user_info = user_info;

                        conn.release();
                        next();
                    })
                })
            }
            else{
                conn.query(`SELECT p.*, i.image_content, bi.bakset_sum
                from product p, image i, baksetinfo bi, bakset b
                WHERE p.product_num = i.fk_product_num AND i.image_seq = 1 AND p.product_num = bi.product_num AND b.user_id = ?
                `,[
                    req.session.user_id
                ], (err, order_product_list)=>{
                    if(err) throw err;

                    conn.query('SELECT * FROM place, card where card.user_id = ? and place.user_id = ?;',[
                        req.session.user_id, req.session.user_id
                    ], (err, user_info)=>{
                        if(err) throw err;

                        req.order_product_list = order_product_list;
                        req.user_info = user_info;

                        conn.release();
                        next();
                    })
                })
            }
        })
    }
}

module.exports = orderController;
