const router = require('express').Router();
const WebhookResponse = require('@jambonz/node-client').WebhookResponse;
// const text = `Hi there, and welcome  to jambones! jambones is the seapass designed with the needs of communication service providers in mind. This is an example of simple text-to-speech, but there is so much more you can do. Try us out!`;
const text = `<speak>
<prosody volume="loud">Chào mừng bạn đến với tổng đài CCall,</prosody> để gặp nhân viên tư vấn vui lòng nhấn phím 1, để gặp bộ phận kỹ thuật vui lòng nhấn phím 2, chúc bạn có một ngày tốt lành, xin cảm ơn.
</speak>`;
router.post('/', (req, res) => {
  const {logger} = req.app.locals;
  logger.debug({payload: req.body}, 'POST /tts-test');
  try {
    const app = new WebhookResponse();
    app
      .tag({data: {
        foo: 'bar'
      }})
      .pause({length: 0.5})
      .say({text});
    res.status(200).json(app);
  } catch (err) {
    logger.error({err}, 'Error');
    res.sendStatus(503);
  }
});

module.exports = router;