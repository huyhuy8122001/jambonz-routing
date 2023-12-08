/* eslint-disable max-len */

var AWS = require("aws-sdk");
var S3Stream = require("s3-upload-stream");
const Websocket = require("ws");
const crypto = require("crypto");

module.exports = (logger) => {
  const calculateResponse = (
    { username, realm, method, nonce, uri, nc, cnonce, qop },
    password
  ) => {
    const ha1 = crypto.createHash("md5");
    ha1.update([username, realm, password].join(":"));
    const ha2 = crypto.createHash("md5");
    ha2.update([method, uri].join(":"));

    // Generate response hash
    const response = crypto.createHash("md5");
    const responseParams = [ha1.digest("hex"), nonce];

    if (cnonce) {
      responseParams.push(nc);
      responseParams.push(cnonce);
    }

    if (qop) {
      responseParams.push(qop);
    }
    responseParams.push(ha2.digest("hex"));
    response.update(responseParams.join(":"));

    return response.digest("hex");
  };

  const getContactByZaloID = async (customerZID) => {
    const axios = require("axios");
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `http://report.hq-devlab.cloud:8080/api/database/rows/table/1063/?user_field_names=true&filter__ZaloUserID__equal=${customerZID}`,
      headers: {
        Authorization: "Token lbsu2t8CRncu4lOZnLXxQ9pIovQQZFJb",
      },
    };
    let assigneeId = "0";
    await axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        const data = response.data;
        if (data.count <= 0) {
          assigneeId = "0";
          return assigneeId;
        }
        console.log(data.results);
        const numAssignee = data.results[0].Asignee.length;
        if (numAssignee == 0) {
          assigneeId = "0";
          return assigneeId;
        } else {
          assigneeId = data.results[0].Asignee[0].value;
          return assigneeId;
        }
      })
      .catch((error) => {
        console.log(error);
        assigneeId = "-1";
        return "-1";
      });
    return assigneeId;
  };

  const getContactByMobile = async (mobileNumber) => {
    const axios = require("axios");
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `http://report.hq-devlab.cloud:8080/api/database/rows/table/1063/?user_field_names=true&filter__mobile__equal=${mobileNumber}`,
      headers: {
        Authorization: "Token lbsu2t8CRncu4lOZnLXxQ9pIovQQZFJb",
      },
    };
    let assigneeId = "0";
    await axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        const data = response.data;
        if (data.count <= 0) {
          assigneeId = "0";
          return assigneeId;
        }
        console.log(data.results);
        const numAssignee = data.results[0].Asignee.length;
        if (numAssignee == 0) {
          assigneeId = "0";
          return assigneeId;
        } else {
          assigneeId = data.results[0].Asignee[0].value;
          return assigneeId;
        }
      })
      .catch((error) => {
        console.log(error);
        assigneeId = "-1";
        return "-1";
      });
    return assigneeId;
  };

  const getExtensionByUserID = async (userID) => {
    const axios = require("axios");
    console.log("UserId", userID);
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `http://report.hq-devlab.cloud:8080/api/database/rows/table/1064/?user_field_names=true&filter__ID__equal=${userID}`,
      headers: {
        Authorization: "Token lbsu2t8CRncu4lOZnLXxQ9pIovQQZFJb",
      },
    };

    return await axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        const data = response.data;
        if (data.count <= 0) {
          return "0";
        }
        console.log(data.results);
        return data.results[0].Extension;
      })
      .catch((error) => {
        console.log(error);
        return "103";
      });
  };

  const getCredentials = async (realm, username) => {
    const axios = require("axios");
    // console.log('UserId', userID);
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `http://report.hq-devlab.cloud:8080/api/database/rows/table/1066/?user_field_names=true&filter__realm__equal=${realm}&filter__user__equal=${username}`,
      headers: {
        Authorization: "Token lbsu2t8CRncu4lOZnLXxQ9pIovQQZFJb",
      },
    };

    return await axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        const data = response.data;
        if (data.count <= 0) {
          console.log(
            "------------- Invalid sip realm or username!!! -------------"
          );
        }
        console.log(data.results[0]);
        return data.results[0];
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getCallDetail = async (new_call_sid) => {
    const axios = require("axios");
    // console.log('UserId', userID);
    const account_sid = "72377df7-4b8d-4b9b-afd9-ada81ca9bc10";
    const account_API_key = "21fba1a8-ee61-4153-b2f1-739ea0da1c0b";
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://cpaas61.epacific.net/api/v1/Accounts/${account_sid}/RecentCalls?page=1&count=25&days=7&filter=${new_call_sid}`,
      headers: {
        Authorization: `Bearer ${account_API_key}`,
      },
    };

    return await axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        const data = response.data;
        const call_detail = data.data[0];
        console.log(call_detail);
        console.log(call_detail.attempted_at);
        console.log(call_detail.from);
        console.log(call_detail.to);

        // const attempted_at = call_detail.attempted_at;
        // const source = call_detail.from;
        // const destination = call_detail.to;
        // const call_status = call_detail.sip_status;
        // const duration = call_detail.duration;
        var recording_url;
        if (call_detail.recording_url == null){
          recording_url = '';
        } else {
          recording_url = `https://cpaas61.epacific.net/api/v1${call_detail.recording_url}`;
        }
        

        // addRecordAppSheet($attempted_at, $source, $destination, $call_status, $duration, $recording_url);
        addRecordAppSheet(call_detail.attempted_at, call_detail.from, call_detail.to, call_detail.sip_status, call_detail.duration, recording_url);

        // return {
        //   attempted_at: call_detail.attempted_at,
        //   source: call_detail.from,
        //   destination: call_detail.to
        // };
        return data;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const addRecordAppSheet = async (
    attempted_at,
    source,
    destination,
    call_status,
    duration,
    recording_url
  ) => {
    const axios = require("axios");
    const app_id = "4e90962e-5a30-4ec4-8924-73131d925166";
    const table_name = "CDRs_table";
    const application_access_key = "V2-FoUHb-EGg5T-JEe1y-sLAiE-MX8vg-JSTSv-bohcD-EHzqF";
    const data_json = JSON.stringify({
      Action: "Add",
      Properties: {
        Locale: "en-US",
        Timezone: "Pacific Standard Time",
      },
      Rows: [
        {
          "Attempted_at": attempted_at,
          "Source": source,
          "Destination": destination,
          "Call_status": call_status,
          "Duration": duration,
          "Recording_url": recording_url
        }
      ]
    });
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `https://api.appsheet.com/api/v2/apps/4e90962e-5a30-4ec4-8924-73131d925166/tables/CDRs_table/Action`,
      headers: {
        'applicationAccessKey': application_access_key,
        'Content-Type': 'application/json'

      },
      data: data_json
    };

    return await axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        const data = response.data;
        console.log(data);
        return data;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const recordAudio = async (logger, socket) => {
    socket.on("message", function (data) {
      /* first message is a JSON object containing metadata about the call */
      try {
        socket.removeAllListeners("message");
        const metadata = JSON.parse(data);
        logger.info({ metadata }, "received metadata");
        const { callSid, accountSid, applicationSid, from, to, callId } =
          metadata;
        let md = {
          callSid,
          accountSid,
          applicationSid,
          from,
          to,
          callId,
        };
        if (metadata.parent_call_sid)
          md = { ...md, parent_call_sid: metadata.parent_call_sid };
        const s3Stream = new S3Stream(new AWS.S3());
        const upload = s3Stream.upload({
          Bucket: process.env.RECORD_BUCKET,
          Key: `${metadata.callSid}.L16`,
          ACL: "public-read",
          ContentType: `audio/L16;rate=${metadata.sampleRate};channels=${
            metadata.mixType === "stereo" ? 2 : 1
          }`,
          Metadata: md,
        });
        upload.on("error", function (err) {
          logger.error(
            { err },
            `Error uploading audio to ${process.env.RECORD_BUCKET}`
          );
        });
        const duplex = Websocket.createWebSocketStream(socket);
        duplex.pipe(upload);
      } catch (err) {
        logger.error(
          { err },
          `Error starting upload to bucket ${process.env.RECORD_BUCKET}`
        );
      }
    });
    socket.on("error", function (err) {
      logger.error({ err }, "recordAudio: error");
    });
  };

  return {
    recordAudio,
    calculateResponse,
    getContactByZaloID,
    getContactByMobile,
    getExtensionByUserID,
    getCredentials,
    getCallDetail,
    addRecordAppSheet,
  };
};
