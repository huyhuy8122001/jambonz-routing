const router = require('express').Router();

router.use('/call-status', require('./call-status'));
router.use('/dial-time', require('./dial-time'));
router.use('/auth', require('./auth'));
router.use('/from-zalo', require('./from-zalo'));
router.use('/to-zalo', require('./to-zalo'));
// router.use('/ringgroup', require('./ringgroup'));

module.exports = router;