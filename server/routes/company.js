var express = require('express');
var router = express.Router();
const companyController = require("../controller/company.js")
const company = new companyController();

router.get('/',  (req, res, next) => {
    res.render('companyMypage.ejs', {companyinfo: req.companyinfo})
})


module.exports = router;
 