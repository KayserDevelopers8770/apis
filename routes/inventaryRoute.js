
const router = require('express-promise-router')(); //PARA MANEJAR MEJOR LAS PROMESAS, para nuestro caso, para manjear mejor los errores
const { getStoresStatus/*, changeStatus*/ } = require('../controllers/inventaryController');

router.get('/syncStores', getStoresStatus)
// router.post('/por_definir/', changeStatus)
module.exports = router