const router = require('express').Router();
const { WebhookResponse } = require('@jambonz/node-client');

router.post('/', (req, res) => {
  const { logger } = req.app.locals;
  logger.debug({ payload: req.body }, 'POST/ringgroup');
  try {
    console.log('----------------------------------------------------------');
    console.log('Logggg'); 
    console.log(req.body);

    // console.log(req.body.call_sid);
    // call_sid = req.body.call_sid

    const app = new WebhookResponse();
    app.dial({
      // callerId: req.body.from,
      callerId: req.body.from,
      answerOnBridge: true,
      target: [
        {
          type: 'user',
          name: `${req.body.to}@new-sip.cpaas61.epacific.net`
        },
        // {
        //   type: 'user',
        //   name: '104@sip.cpaas61.epacific.net'
        // },
        // {
        //   "type": "phone",
        //   "number": req.body.to, //"number": "319077303812156465",
        //   "trunk": "FusionPBX"
        // }
        // {
        //   "type": "sip",
        //   "sipUri": "sip:777777@sip.cpaas61.epacific.net",
        // },
        // {
        //   type: 'user',
        //   name: '103@sip.cpaas61.epacific.net'
        // },
        // {
        //   type: 'user',
        //   name: '104@sip.cpaas61.epacific.net'
        // }
      ]
    });
    res.status(200).json(app);
  } catch (err) {
    logger.error({ err }, 'Error');
    res.sendStatus(503);
  }
});

module.exports = router;