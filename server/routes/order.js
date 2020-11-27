var express = require('express');
var router = express.Router();
const orderController = require("../controller/order.js")
const order = new orderController();

//
router.get('/', (req, res, next) => {
    
})




module.exports = router;
 