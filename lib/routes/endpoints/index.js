const router = require('express').Router();

router.use('/call-status', require('./call-status'));
router.use('/dial-time', require('./dial-time'));
router.use('/auth', require('./auth-json'));
router.use('/from-zalo', require('./from-zalo'));
router.use('/to-zalo', require('./to-zalo'));
router.use('/sip-number', require('./sip-number'));
router.use('/ringgroup', require('./ringgroup'));
router.use('/tts-test', require('./tts-test'));
router.use('/transcribe', require('./transcribe-test'));
// router.use('/sip-auth', require('./auth-baserow'));
// router.use('/ivr', require('./ivr'));

module.exports = router;