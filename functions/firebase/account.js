'use strict';
const axios = require("axios");
const firebaseApiKey = process.env.FIREBASE_API_KEY;

module.exports.create = async (event, context, callback) => {
  if (!firebaseApiKey) {
    console.error("No firebase api key set")
  }
  let body;
  try {
    body = JSON.parse(event.body);
  } catch (e) {
    body = event.body
  }
  const url =
    "https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=" + firebaseApiKey;
  try {
    const res = await axios.post(url, body);
    console.log("res", res);
    callback(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(res.data),
    });
  } catch (err) {
    console.log("err", err);
    const response = {
      statusCode: err.response.data.error.code,
      body: JSON.stringify(err.response.data)
    }
    return callback(null, response);
  }
};