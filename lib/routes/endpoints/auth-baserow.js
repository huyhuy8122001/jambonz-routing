const router = require('express').Router();

router.post('/', async(req, res) => {
  const {logger, calculateResponse} = req.app.locals;
  const {getCredentials} = require('../../utils.js')(logger);
  try {
    console.log('---------------------Baserow!----------------------------');

    const {realm, username} = req.body;

    const my_user = await getCredentials(realm, username);
    const my_password = my_user.password;

    const myResponse = calculateResponse(req.body, my_password);
    if (myResponse === req.body.response) {
      logger.info({payload: req.body}, 'sip user successfully authenticated');
      return res.json({status: 'ok'});
    }
    logger.info(`invalid password supplied for ${username}`);
    return res.status(200).json({status: 'fail', msg: 'invalid password'});
  } catch (err) {
    logger.error({err}, 'Error authenticating');
    res.send({status: 'fail', msg: err.message});
  }
});

module.exports = router;
