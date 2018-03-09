
const router = require('express-promise-router')();

const { callback,promise,asynawait,getSkus } = require('../controllers/skusController');

router.get('/callback', callback)
router.get('/promise', promise)
router.get('/asyncawait', asynawait)
router.get('/:substrSku', getSkus)

module.exports = router