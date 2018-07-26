// const express = require('express')
// const router = express.Router()
const router = require('express-promise-router')(); //PARA MANEJAR MEJOR LAS PROMESAS, para nuestro caso, para manjear mejor los errores
const { getStockSkus, setSale } = require('../controllers/omni/omniController');

router.get('/StockBodega/:substrSku', getStockSkus)
router.post('/VentaOmni', setSale)
module.exports = router