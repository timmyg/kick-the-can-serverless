const fixture = require('./account');
const axios = require('axios');
const nock = require('nock');
axios.defaults.adapter = require('axios/lib/adapters/http');
// beforeEach(() => {
//     jest.resetModules();
// });

test('account create success', async (done) => {
    const requestBody = require('../../test/data/new-account.json')
    const responseOk = require('../../test/response/signup-ok.json')

    nock('https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser')
        .post('', function() { 
            return true;
        })
        .query({key: 'key1234'})
        .reply(200, responseOk);

    fixture.create(requestBody, {}, function(cxt, data) {
        expect.anything(JSON.parse(data.body).refreshToken);
        done()
    })
});

test('account create email exists', async (done) => {
    const requestBody = require('../../test/data/new-account.json')
    const responseEmailExists = require('../../test/response/signup-email-exists.json')

    nock('https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser')
        .post('', function() { 
            return true;
        })
        .query({key: 'key1234'})
        .reply(400, responseEmailExists);

    fixture.create(requestBody, {}, function(cxt, data) {
        expect(data.statusCode).toBe(400);
        expect(JSON.parse(data.body).error.message).toBe("EMAIL_EXISTS");
        done();    
    })
});