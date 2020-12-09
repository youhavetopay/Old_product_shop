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


            conn.query('select count(*) as count from bookmark where user_id = ?',[
                req.session.user_id
            ], (err, count)=>{
                if(err) throw err;

                if(count[0].count >= 3){
                    res.send(
                        '<script type="text/javascript">alert("업체 즐겨찾기 갯수가 3곳 이상입니다..");history.back();</script>'
                    );
                }
                else{
                    conn.query('select * from bookmark where user_id = ? and company_num = (select company_num from product where product_num = ?)',[
                        req.session.user_id, req.body.product_num
                    ], (err, check_bookMark)=>{
                        if(err) throw err;

                        if(check_bookMark.length <= 0){
                            conn.query('insert into bookmark values(?,?,(select company_num from product where product_num = ?))',[
                                null, req.session.user_id, req.body.product_num
                            ], (err)=>{
                                if(err) throw err;
                
                                conn.release();
                                next();
                            })
                        }
                        else{
                            res.send(
                                '<script type="text/javascript">alert("이미 추가한 업체 입니다..");history.back();</script>'
                            );
                        }
                    })
                }
            })
        })
    }
}

module.exports = ProductController