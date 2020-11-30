const pool = require("../dbconfig/dbconfig")

class companyController {  
    async selectCompany (req, res, next) {
        pool.getConnection((err, conn) => {
            if (err) throw err;
            else {
                const ynSql = `SELECT * FROM company WHERE user_id = "${req.session.user_id}"`

                conn.query(ynSql, (err, yn) => {
                    if (err) {
                        res.send('<script type="text/javascript">alert("공급업체 회원이 아닙니다.");history.back();</script>');
                    }
                    else {
                        console.log(yn[0].company_num);

                        const productCountSql = `SELECT COUNT(*) FROM product WHERE company_num = "${yn[0].company_num}"`
                        const orderCountSql = `SELECT COUNT(order_num) FROM orderinfo WHERE {SELECT product_num FROM prodcut WHERE p.company_num = "${yn[0].company_num}}"`
                        const directCountSql = `SELECT COUNT(o.order_direct_whether) FROM orders as o, orderinfo as i WHERE o.order_num = i.order_num AND o.order_direct_whether = "Y" AND {SELECT product_num FROM prodcut WHERE p.company_num = "${yn[0].company_num}}"`
                    } 
                })
            }
        })
    }

}

module.exports = companyController;
