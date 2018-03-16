// const express = require('express')
// const router = express.Router()
const router = require('express-promise-router')();

const { /*callback,promise,asynawait,*/ getStockSkus } = require('../controllers/skusController');

// router.get('/callback', callback)
// router.get('/promise', promise)
// router.get('/asyncawait', asynawait)
router.get('/:substrSku', getStockSkus)

module.exports = router