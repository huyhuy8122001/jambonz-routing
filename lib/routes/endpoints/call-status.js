const router = require('express').Router();

// function wait(ms){
//   var start = new Date().getTime();
//   var end = start;
//   while(end < start + ms) {
//     end = new Date().getTime();
//  }
// }

router.post('/', (req, res) => {
  const {logger} = req.app.locals;
  const {getCallDetail, addRecordAppSheet} = require('../../utils.js')(logger);
  logger.debug({payload: req.body}, 'call status');
  // console.log('Hello');
  // console.log('----------------Hello------------');
  // console.log(req);
  console.log('Call Status');
  console.log(req.body.from);
  console.log(req.body.to);
  
  console.log(req.body.direction);
  direction = req.body.direction;
  console.log(req.body.call_status);
  call_status = req.body.call_status;
  console.log(req.body.call_sid);
  call_sid = req.body.call_sid;
  if (direction == 'inbound' && call_status == 'completed'){
    console.log('completed!!');
    setTimeout(() =>{ 
      const callDetail = getCallDetail(call_sid);
    }, 20000);
  } else if (call_status == 'busy'){
    console.log('busy!!');
    setTimeout(() =>{ 
      const callDetail = getCallDetail(call_sid);
    }, 12000);
  }

  // console.log(callDetail.attempted_at);
  // console.log(callDetail.from);

  console.log('----------------Hello------------');
  console.log(req.body);
  res.sendStatus(200);
});

module.exports = router;
