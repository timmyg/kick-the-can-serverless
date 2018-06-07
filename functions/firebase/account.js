'use strict';
const axios = require("axios");
const firebaseApiKey = process.env.firebaseApiKey;

module.exports.create = async (event, context, callback) => {
  const body = JSON.parse(event.body);
  const url =
    "https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=" + firebaseApiKey;
  try {
    const res = await axios.post(url, body);
    callback(null, {
      statusCode: 200,
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