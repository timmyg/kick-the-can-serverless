const fixture = require('./account');
const axios = require('axios');
const nock = require('nock');
// const MockAdapter = require('axios-mock-adapter');

test('account create success', async (done) => {
    process.env.FIREBASE_API_KEY = "undefined"
    axios.defaults.adapter = require('axios/lib/adapters/http');
    const requestBody = require('../../test/data/new-account.json')
    const responseOk = require('../../test/response/signup_ok.json')

    // nock('https://www.googleapis.com')
    //     .post('/identitytoolkit/v3/relyingparty/signupNewUser?key=undefined', JSON.stringify(requestBody))
    //     .query(true)
    //     .reply(200, {}, responseOk);
    nock('https://www.googleapis.com').post(() => true) .reply(200, responseOk);

    const callback = (cxt, data) => {
        console.log("data", JSON.parse(data.body));
        expect.anything(JSON.parse(data.body).refreshToken);
        done()
    }

    await fixture.create(requestBody, {}, callback)
});

// test('account create email exists', async (done) => {
//     process.env.FIREBASE_API_KEY = "key123"
//     var mock = new MockAdapter(axios);
//     const requestBody = require('../../test/data/new-account.json')
//     const responseEmailExists = require('../../test/response/signup_email_exists.json')
//     const response = { 
//         statusCode: 400,
//         body: JSON.stringify(responseEmailExists)
//     };
//     mock.onPost('https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=key123', requestBody).reply(200, response);

//     const callback = (cxt, data) => {
//         console.log("data", data);
//         expect(JSON.parse(data.body).statusCode).toBe(400);
//         expect(JSON.parse(data.body).body.error.message).toBe("EMAIL_EXISTS");
//         done()
//     }

//     const result = await fixture.create(data, {}, callback)
// });