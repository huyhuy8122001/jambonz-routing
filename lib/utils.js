/* eslint-disable max-len */

var AWS      = require('aws-sdk') ;
var S3Stream = require('s3-upload-stream');
const Websocket = require('ws');
const crypto = require('crypto');

module.exports = (logger) => {

  const calculateResponse = ({username, realm, method, nonce, uri, nc, cnonce, qop}, password) => {
    const ha1 = crypto.createHash('md5');
    ha1.update([username, realm, password].join(':'));
    const ha2 = crypto.createHash('md5');
    ha2.update([method, uri].join(':'));

    // Generate response hash
    const response = crypto.createHash('md5');
    const responseParams = [
      ha1.digest('hex'),
      nonce
    ];

    if (cnonce) {
      responseParams.push(nc);
      responseParams.push(cnonce);
    }

    if (qop) {
      responseParams.push(qop);
    }
    responseParams.push(ha2.digest('hex'));
    response.update(responseParams.join(':'));

    return response.digest('hex');
  };

  const getContactByZaloID = async(customerZID) => {
    const axios = require('axios');
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `http://report.hq-devlab.cloud:8080/api/database/rows/table/1063/?user_field_names=true&filter__ZaloUserID__equal=${customerZID}`,
      headers: {
        'Authorization': 'Token lbsu2t8CRncu4lOZnLXxQ9pIovQQZFJb'
      }
    };
    let assigneeId = '0';
    await axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        const data = response.data;
        if (data.count <= 0) {
          assigneeId = '0';
        }
        console.log(data.results);
        const numAssignee = data.results[0].Asignee.length;
        if (numAssignee == 0) {
          assigneeId = '0';
          return 0;
        }
        else {
          assigneeId = data.results[0].Asignee[0].value;
          return data.results[0].Asignee[0].value;
        }
      })
      .catch((error) => {
        console.log(error);
        assigneeId = '-1';
        return '-1';
      });
    return assigneeId;
  };

  const getExtensionByUserID = async(userID) => {
    const axios = require('axios');
    console.log('UserId', userID);
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `http://report.hq-devlab.cloud:8080/api/database/rows/table/1064/?user_field_names=true&filter__ID__equal=${userID}`,
      headers: {
        'Authorization': 'Token lbsu2t8CRncu4lOZnLXxQ9pIovQQZFJb'
      }
    };

    return await axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        const data = response.data;
        if (data.count <= 0) {
          return '0';
        }
        console.log(data.results);
        return data.results[0].Extension;
      })
      .catch((error) => {
        console.log(error);
        return '103';
      });
  };

  const recordAudio = async(logger, socket) => {
    socket.on('message', function(data) {
      /* first message is a JSON object containing metadata about the call */
      try {
        socket.removeAllListeners('message');
        const metadata = JSON.parse(data);
        logger.info({metadata}, 'received metadata');
        const {callSid, accountSid, applicationSid, from, to, callId} = metadata;
        let md = {
          callSid,
          accountSid,
          applicationSid,
          from,
          to,
          callId
        };
        if (metadata.parent_call_sid) md = {...md, parent_call_sid: metadata.parent_call_sid};
        const s3Stream = new S3Stream(new AWS.S3());
        const upload = s3Stream.upload({
          Bucket: process.env.RECORD_BUCKET,
          Key: `${metadata.callSid}.L16`,
          ACL: 'public-read',
          ContentType: `audio/L16;rate=${metadata.sampleRate};channels=${metadata.mixType === 'stereo' ? 2 : 1}`,
          Metadata: md
        });
        upload.on('error', function(err) {
          logger.error({err}, `Error uploading audio to ${process.env.RECORD_BUCKET}`);
        });
        const duplex = Websocket.createWebSocketStream(socket);
        duplex.pipe(upload);
      } catch (err) {
        logger.error({err}, `Error starting upload to bucket ${process.env.RECORD_BUCKET}`);
      }
    });
    socket.on('error', function(err) {
      logger.error({err}, 'recordAudio: error');
    });
  };

  return {
    recordAudio,
    calculateResponse,
    getContactByZaloID,
    getExtensionByUserID
  };
};
