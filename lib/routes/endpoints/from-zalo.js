/* eslint-disable max-len */
const router = require('express').Router();
const { WebhookResponse } = require('@jambonz/node-client');


router.post('/', async(req, res) => {
  const { logger } = req.app.locals;
  const {getContactByZaloID, getContactByMobile, getExtensionByUserID} = require('../../utils.js')(logger);
  logger.debug({ payload: req.body }, 'POST/from-zalo');
  try {
    console.log('----------------------------------------------------------');
    console.log('from ZALO'); 
    
    console.log(req.body.sip.headers['X-Originating-Carrier']);
    carrier = req.body.sip.headers['X-Originating-Carrier'] // Zalo_ZCC, SBC_epa 

    // v assigneeId = '0';

    console.log(req.body.from);
    if (carrier == 'Zalo_ZCC'){
      var assigneeId = await getContactByZaloID(req.body.from);
    }else if (carrier == 'SBC_epa'){
      var assigneeId = await getContactByMobile(req.body.from);
    };

    // const assigneeId = await getContactByZaloID(req.body.from);

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
    res.status(200).json(app);
    console.log(req.body);
    // console.log('-------------');
    // console.log(res.status(200).json(app));
  } catch (err) {
    logger.error({ err }, 'Error');
    res.sendStatus(503);
  }
});

module.exports = router;
