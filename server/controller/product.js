const pool = require("../dbconfig/dbconfig");


class ProductController{

    async getProductDetail(req, res, next){
        pool.getConnection((err, conn)=>{
            if(err) throw err;

            conn.query('select p.*, c.company_name from product as p, company as c where p.product_num = ? and p.company_num = c.company_num',[
                req.params.product_num
            ], (err, product_info)=>{
                if(err) throw err;

                conn.query('select * from image where fk_product_num = ? order by image_seq',[
                    req.params.product_num
                ], (err, image_list)=>{
                    if(err) throw err;

                    conn.query('select * from review where product_num = ? order by review_date',[
                        req.params.product_num
                    ], (err, review_list)=>{
                        if(err) throw err;

                        req.productInfo = product_info;
                        req.imageList = image_list;
                        req.reviewList = review_list;

                        conn.release();
                        next();
                    })
                })
            })
        })
    }


    async addBookMark(req, res, next){
        pool.getConnection((err, conn)=>{
            if(err) throw err;

            conn.query('insert into bookmark values(?,?,(select company_num from product where product_num = ?))',[
                null, req.session.user_id, req.body.product_num
            ], (err)=>{
                if(err) throw err;

                conn.release();
                next();
            })
        })
    }
}

module.exports = ProductController