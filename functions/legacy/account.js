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

module.exports.create = async (event, context, callback) => {
  const body = checkAndGetBody(event)
  const url =
    "https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=" + firebaseApiKey;
  try {
    const res = await axios.post(url, body);
    callback(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(res.data),
    });
  } catch (err) {
    // console.error("errrr", err);
    const response = {
      statusCode: err.response.data.error.code,
      body: JSON.stringify(err.response.data)
    }
    return callback(null, response);
  }
};