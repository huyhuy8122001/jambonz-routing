const router = require('express').Router();

router.post('/', (req, res) => {
  const {logger} = req.app.locals;
  logger.debug({payload: req.body}, 'call status');
  // console.log('Hello');
  // console.log('----------------Hello------------');
  // console.log(req);
  console.log('Call Status');
  console.log(req.body.from);
  console.log(req.body.to);
  res.sendStatus(200);
});

module.exports = router;
