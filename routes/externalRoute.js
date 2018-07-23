
const router = require('express-promise-router')(); //PARA MANEJAR MEJOR LAS PROMESAS, para nuestro caso, para manjear mejor los errores
const { getDetailedPurchasesPromoters, getTotalPurchasesPromoters } = require('../controllers/externalController');

router.get('/promoters/detailedPurchases', getDetailedPurchasesPromoters)
router.get('/promoters/totalPurchases', getTotalPurchasesPromoters)

module.exports = router