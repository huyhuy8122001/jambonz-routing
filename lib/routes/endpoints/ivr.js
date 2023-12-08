const router = require('express').Router();
const { WebhookResponse } = require('@jambonz/node-client');

router.post('/', (req, res) => {
  const {logger} = req.app.locals;
  logger.debug({payload: req.body, query: req.query}, 'POST /ivr');
  try {
    const app = new WebhookResponse();
    app.gather({
        actionHook: '/ivr/collect',
        input: ['digits'],
        maxDigits: 1,
        timeout: 5,
        say: {
            text: 'Nhấn 1 để gặp 100, nhấn 2 để gặp 101'
        }
    });
    res.status(200).json(app);
  } catch (err) {
    logger.error({err}, 'Error');
    res.sendStatus(503);
  }
});

router.post('/collect', (req, res) => {
    const {logger} = req.app.locals;
    const payload = req.body;
    logger.debug({payload}, 'POST /attended-transfer/collect');
    try {
      const app = new WebhookResponse();
      if (payload.digits == '1') {
        app
          .say({
            text:
            `<speak>
              Please wait a second!
            </speak>`
          })
          .dial({
            callerId: process.env.OUTBOUND_CALLER_ID || payload.from,
            answerOnBridge: true,
            dtmfCapture: ['*2', '*3'],
            dtmfHook: '/attended-transfer/dtmf',
            target: [
              {
                type: 'user',
                name: `${payload.to}@sip.cpaas61.epacific.net`
              }
            ]
          });
      }
      else {
        app
          .say({text: 'Are you there?  We did not collect any input.'})
          .gather(gatherTN);
      }
      res.status(200).json(app);
    } catch (err) {
      logger.error({err}, 'Error');
      res.sendStatus(503);
    }
  });

module.exports = router;