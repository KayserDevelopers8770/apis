
const router = require('express-promise-router')(); //PARA MANEJAR MEJOR LAS PROMESAS, para nuestro caso, para manjear mejor los errores

//CONTROLLER y ENPOINTS PARA VENTAS DE PROMOTORAS ( GLUKY )
const { getDetailedPurchasesPromoters, getTotalPurchasesPromoters } = require('../controllers/external/promotersController.js');
router.get('/promoters/detailedPurchases', getDetailedPurchasesPromoters)
router.get('/promoters/totalPurchases', getTotalPurchasesPromoters)

//CONTROLLER PARA PARA PAGINA ONLINE SENS (SHOPIFY)
const { getStockSens } = require('../controllers/external/sensController');
router.get('/sensProducts/stock',getStockSens)

module.exports = router