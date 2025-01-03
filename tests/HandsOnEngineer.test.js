/**
 * @fileoverview This file contains the unit tests for the HandsOnEngineerService module.
 */
const {changeStatus} = require('../service/HandsOnEngineerService.js');
const http = require('http');
const test = require('ava').default;
const listen = require('test-listen');
const got = require('got');
const app = require('../index.js');

test.before(async (t) => {
    t.context.server = http.createServer(app);
    t.context.prefixUrl = await listen(t.context.server);
    t.context.got = got.extend({ http2: true, prefixUrl: t.context.prefixUrl, responseType: 'json' });
});

test.after.always((t) => {
    t.context.server.close();
});

const { putChangeProposalStatus_examples } = require('./HE_global_variables_examples.js');
test('PUT /user/handsOnEngineer/{userID}/proposals/{proposalID} change the proposal status', async (t) => {
    const userID = 5;
    const proposalID = 2;

    // Send a PUT request to modify the proposal status
    const response = await t.context.got.put(`user/handsOnEngineer/${userID}/proposals/${proposalID}`, {
        json: putChangeProposalStatus_examples,
        responseType: 'json'
    });

    t.is(response.statusCode, 200);
    // Retrieve the updated resource using a GET request
    const result = await t.context.got.get(`user/handsOnEngineer/${userID}/proposals/${proposalID}`);
        
    t.is(result.statusCode, 200);
    // Compare specific properties between the initial request and the updated resource 
    t.deepEqual(response.body.newValue, result.body.newValue);
    t.deepEqual(response.body.status, result.body.status);
    t.deepEqual(response.body.confirmation, result.body.confirmation);
    t.deepEqual(response.body.description, result.body.description);
});

test('PUT change the proposal status by function' , async (t) => {
    const userID = 24;
    const proposalID = 6;

    // Call the changeStatus function with the new data, user ID, and proposal ID
    const result = await changeStatus(putChangeProposalStatus_examples, userID, proposalID);
    // Assert that the returned result matches the provided new_user data
    t.deepEqual(result, putChangeProposalStatus_examples);
});