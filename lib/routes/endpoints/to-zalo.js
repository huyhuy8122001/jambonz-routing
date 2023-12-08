const router = require('express').Router();
const { WebhookResponse } = require('@jambonz/node-client');

router.post('/', (req, res) => {
  const { logger } = req.app.locals;
  logger.debug({ payload: req.body }, 'POST/to-zalo');
  try {
    const app = new WebhookResponse();
    app.dial({
      // callerId: req.body.from,
      callerId: "1572293430916862564",
      answerOnBridge: true,
      target: [
        {
          "type": "phone",
          "number": req.body.to,
          "trunk": "Zalo_ZCC"
        },
        // {
        //   "type": "phone",
        //   "number": "666666",
        //   "trunk": "fusionGCP"
        // },
      ]
    });
    res.status(200).json(app);
  } catch (err) {
    logger.error({ err }, 'Error');
    res.sendStatus(503);
  }
});

module.exports = router;