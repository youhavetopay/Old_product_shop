const pool = require("../dbconfig/dbconfig")

class userController {

    // 회원가입
    async signupInput(req, res, next) {
        console.log(req.body);
    
        const user = req.body;

        pool.getConnection((err, conn) => {
            if(err) throw res.json({success: false, err});
            else{
                var val = [user.user_id, user.user_pw, user.user_name]
                const {user_id, user_pw, user_name} = req.body
                console.log(val)
                var sql = "INSERT INTO users VALUES (?,?,?)";
                conn.query(sql, val, (err, row)=>{
                    conn.release();
                    if(err) {
                        if (req.body.user_id == undefined || req.body.user_pw == undefined || req.body.user_name == undefined){
                            console.log("33333"+user.user_id);
                            res.send('<script type="text/javascript">alert("정보를 다시 입력해주세요.");history.back();</script>');
                        }
                        else {
                            res.send('<script type="text/javascript">alert("아이디가 중복입니다.");history.back();</script>');
                        }
                        
                    }
                    else{
                            next();
                        }
                })               
            }
        })
    }
    

    // 로그인
    async userLogin(req, res, next){
        const {user_id, user_pw } = req.body;
        console.log(req.body);

        pool.getConnection((err, conn) => {
            if(err) throw err;
            else{
               
                var sql = `SELECT * FROM users WHERE user_id = "${user_id }" AND user_pw = "${user_pw }"`;

                conn.query(sql, (err, row)=>{
                    conn.release();
                    if(err) throw err;
                    else {
                        if(row.length === 0){
                            res.send('<script type="text/javascript">alert("아이디나 비밀번호가 틀렸습니다.");history.back();</script>');
                        }else{
                            req.session.user_id = row[0].user_id;
                            console.log(row[0].user_id, row[0].user_pw, row[0].user_pw);
                            next();  
                        }

                    }
                })
            }
        })
    }

}

module.exports = userController;
