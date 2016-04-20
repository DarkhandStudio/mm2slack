/**
 * Mattermost <> Slack message mirroring
 * 
 * Copyright Frank Bignone, 2016
 * Apache 2.0 License (see LICENSE file)
 */

var Mattermost = require('node-mattermost');
var Slack = require('node-slack');

var express = require('express');
var bodyParser = require("body-parser");

/*
 * Get all parameters
 * env.SLACK_OUTGOING   Slack outgoing webhook token
 * env.SLACK_INCOMING   Slack incoming webhook
 * env.SLACK_CHANNEL    Slack channel (for incoming webhook)
 * env.MM_OUTGOING      MM outgoing webhook token
 * env.MM_INCOMING      MM incoming webhook
 * env.MM_CHANNEL       MM channel (for incoming webhook)
 * env.MMSLACK_PORT     Listening port (for outgoing webhook)
 */
var slackOutgoing = process.env.SLACK_OUTGOING;
var slackIncoming = process.env.SLACK_INCOMING;
var slackChannel = process.env.SLACK_CHANNEL;
var mmOutgoing = process.env.MM_OUTGOING;
var mmIncoming = process.env.MM_INCOMING;
var mmChannel = process.env.MM_CHANNEL;
var port = process.env.MMSLACK_PORT;

/* 
 * Create slack / mm webhook
 */
var slack = new Slack(slackIncoming);
var mm = new Mattermost(mmIncoming);

/*
 * Update of headers for response allowing access from outside
 */
var app = express();

/* Use of bodyparser to parse body of request with JSON / URLENCODED mode */
app.use(bodyParser.urlencoded({
    limit: '128mb'
    , extended: true
}));
app.use(bodyParser.json({
    limit: '128mb'
}));


/*
 * Get a message from slack and send it to mm
 */
app.post('/slack', function (req, response) {

    /* Get info from slack hook */
    var reply = slack.respond(req.body, function (hook) {
        if (hook.token !== slackOutgoing) {
            return null;
        }

        return {
            text: hook.text
            , username: hook.user_name
        , };
    });

    /* Mirror the message on MM platform */
    if (reply !== null && reply.username !== 'slackbot') {
        mm.send({
            text: reply.text
            , channel: mmChannel
            , username: reply.username
            , unfurl_links: true
        , });
    }
});

/*
 * Get a message from slack and send it to mm
 */
app.post('/mm', function (req, response) {

    /* Get info from slack hook */
    var reply = mm.respond(req.body, function (hook) {
        if (hook.token !== mmOutgoing) {
            return null;
        }
        return {
            text: hook.text
            , username: hook.user_name
        , };
    });

    /* Mirror the message on MM platform */
    if (reply !== null && reply.username !== 'bot') {
        slack.send({
            text: reply.text
            , channel: slackChannel
            , username: reply.username
            , unfurl_links: true
        , });
    }
});

/*
 * Open server on given port
 */
console.log("Listening on port " + port);
app.listen(port);
