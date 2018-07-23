
const router = require('express-promise-router')(); //PARA MANEJAR MEJOR LAS PROMESAS, para nuestro caso, para manjear mejor los errores
const { getStoresStatus, changeStoreStatus } = require('../controllers/inventaryController');

router.get('/syncStores', getStoresStatus)
// router.post('/por_definir/', changeStatus)
router.put('/changeStatus/:codStore/:status',changeStoreStatus)
module.exports = router