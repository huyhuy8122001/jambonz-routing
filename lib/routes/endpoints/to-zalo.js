const router = require('express').Router();
const { WebhookResponse } = require('@jambonz/node-client');

router.post('/', (req, res) => {
  const { logger } = req.app.locals;
  logger.debug({ payload: req.body }, 'POST/to-zalo');
  try {
    const app = new WebhookResponse();
    app.dial({
      // callerId: req.body.from,
      callerId: "2193143979850080547",
      answerOnBridge: true,
      target: [
        {
          "type": "phone",
          "number": "319077303812156465",
          "trunk": "Zalo_ZCC"
        }
      ]
    });
    res.status(200).json(app);
  } catch (err) {
    logger.error({ err }, 'Error');
    res.sendStatus(503);
  }
});

module.exports = router;