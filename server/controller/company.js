const pool = require("../dbconfig/dbconfig")

class companyController {  

    // 
    async selectCompany (req, res, next) {
        pool.getConnection((err, conn) => {
            if (err) throw err;
            else {

                // 공급업체인지 확인하기???
                const ynSql = `SELECT * FROM company WHERE user_id = "${req.session.user_id}"`

                conn.query(ynSql, (err, yn) => {
                    if (err) {
                        res.send('<script type="text/javascript">alert("공급업체 회원이 아닙니다.");history.back();</script>');
                    }
                    else {
                        console.log(yn[0].company_num);

                        // 등록된 상품 갯수 들고 오기
                        const productCountSql = `SELECT COUNT(*) FROM product WHERE company_num = "${yn[0].company_num}"`

                        // 내가 등록한 상품을 주문한 개수
                        const orderCountSql = `SELECT COUNT(o.order_num) FROM orderinfo WHERE {SELECT product_num FROM prodcut WHERE p.company_num = "${yn[0].company_num}}"`
                    } 
                })
            }
        })
    }

}

module.exports = companyController;
