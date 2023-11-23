const router = require('express').Router();
const { WebhookResponse } = require('@jambonz/node-client');

router.post('/', (req, res) => {
  const { logger } = req.app.locals;
  logger.debug({ payload: req.body }, 'POST/ringgroup');
  try {
    const app = new WebhookResponse();
    app.dial({
      // callerId: req.body.from,
      callerId: "2193143979850080547",
      answerOnBridge: true,
      target: [
        {
          "type": "phone",
          "number": "666666",
          "trunk": "fusionGCP"
        },
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