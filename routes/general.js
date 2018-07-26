
const router = require('express-promise-router')(); //PARA MANEJAR MEJOR LAS PROMESAS, para nuestro caso, para manjear mejor los errores
const { getAvailableStores } = require('../controllers/general/generalController');


router.get('/availableStores', getAvailableStores)
module.exports = router