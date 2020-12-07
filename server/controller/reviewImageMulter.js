const multer = require('multer')

const pool = require('../dbconfig/dbconfig');
let moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/reviewImage/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  },
  
})


const upload = multer({
  storage: storage
})

module.exports.send = (req, res, next) => {
  upload.single(profile_pt)(req, res, (err) => {

    if (err) throw err;
    else{
        console.log('사진');
        console.log(req.file);
        console.log(req.file.filename);
        next();
    }
    
  })
}