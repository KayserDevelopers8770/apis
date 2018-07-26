
const router = require('express-promise-router')(); //PARA MANEJAR MEJOR LAS PROMESAS, para nuestro caso, para manjear mejor los errores
const { getStoresStatus, changeStoreStatus } = require('../controllers/inventary/storeStatusController');
const { getProcessedDocs } = require('../controllers/inventary/processedDocsController')

router.get('/inventary/syncStores', getStoresStatus)
// router.post('/por_definir/', changeStatus)
router.put('/inventary/changeStatus/:codStore/:status',changeStoreStatus)
//router de productos procesados
router.get('/inventary/processedDocs/:codStore/:docState', getProcessedDocs)
module.exports = router