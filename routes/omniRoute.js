// const express = require('express')
// const router = express.Router()
const router = require('express-promise-router')();

const { getStockSkus, setSale } = require('../controllers/omniController');

// router.get('/callback', callback)
// router.get('/promise', promise)
// router.get('/asyncawait', asynawait)
router.get('/:substrSku', getStockSkus)
router.get('/', setSale)

module.exports = router