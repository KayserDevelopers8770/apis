
const router = require('express-promise-router')(); //PARA MANEJAR MEJOR LAS PROMESAS, para nuestro caso, para manjear mejor los errores
const { getAvalaibleStores } = require('../controllers/general/generalController');


router.get('/avalaibleStores', getAvalaibleStores)
module.exports = router