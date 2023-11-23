/* eslint-disable max-len */
const router = require('express').Router();
const { WebhookResponse } = require('@jambonz/node-client');


router.post('/', async(req, res) => {
  const { logger } = req.app.locals;
  const {getContactByZaloID, getExtensionByUserID} = require('../../utils.js')(logger);
  logger.debug({ payload: req.body }, 'POST/from-zalo');
  try {
    console.log('-----------------');
    console.log('from ZALO');
    console.log(req.body.from);
    const assigneeId = await getContactByZaloID(req.body.from);
    console.log('AssigneeId', assigneeId);
    const supporter = {
      type: 'user',
      name: '103@sip.cpaas61.epacific.net'
    };
    if (assigneeId !== '0' && assigneeId !== '-1') {
      let extensionDial = await getExtensionByUserID(assigneeId);
      console.log(extensionDial);
      if (extensionDial === '0') {
        extensionDial = '103';
      }
      supporter.name = `${extensionDial}@sip.cpaas61.epacific.net`;
    }
    console.log(supporter);
    const app = new WebhookResponse();
    app.dial({
      callerId: req.body.from,
      answerOnBridge: true,
      target: [
        // {
        //   type: 'user',
        //   name: '103@sip.cpaas61.epacific.net'
        // },
        supporter
        // {
        //   "type": "phone",
        //   "number": "8844773997146980834",
        //   "trunk": "Zalo_ZCC"
        // }
      ]
    });
    console.log(req.body);
    res.status(200).json(app);
  } catch (err) {
    logger.error({ err }, 'Error');
    res.sendStatus(503);
  }
});

module.exports = router;
