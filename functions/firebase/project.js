'use strict';
const axios = require("axios");
const firebaseApiKey = process.env.FIREBASE_API_KEY;

function checkAndGetBody(event) {
  if (!firebaseApiKey) {
    console.error("No firebase api key set")
  }
  try {
    return JSON.parse(event.body);
  } catch (e) {
    return event.body;
  }
};

function generateGuid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return (s4() +s4() + "-" +s4() + "-" +s4() + "-" +s4() + "-" +s4() +s4() +s4()
    );
  }

module.exports.create = async (event, context, callback) => {
  console.log("proj create", event);
  const body = checkAndGetBody(event)
  body.apiKey = generateGuid()
  const url = "https://kick-the-can.firebaseio.com/projects.json?auth=" + event.headers.Authorization,
  try {
    // const res = await axios.post(url, body);
    const res = await this.$axios.post(url, data)
    callback(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(res.data),
    });
  } catch (err) {
    const response = {
      statusCode: err.response.data.error.code,
      body: JSON.stringify(err.response.data)
    }
    return callback(null, response);
  }
};