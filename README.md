# Mattermost to Slack bridge (both ways)
This simple application will mirror all messages between one instance of Mattermost and one instance of Slack through a dedicated channel

## Installation
* npm install
* In case you are using kong, you can use the install-kong.sh script to setup all API
* In case you are using PM2 for process management, you can use the following command to start this service: pm2 start mm2slack.sh --interpreter sh --name mm2slack

## install-kong parameters
SERVICE_PORT parameter need to be setup to same MMSLACK_PORT from the **mm2slack.sh** script.

## Environment variable settings
The following environment variables need to be setup:
 * SLACK_OUTGOING   : Slack outgoing webhook token
 * SLACK_INCOMING   : Slack incoming webhook
 * SLACK_CHANNEL    : Slack channel (for incoming webhook)
 * MM_OUTGOING      : MM outgoing webhook token
 * MM_INCOMING      : MM incoming webhook
 * MM_CHANNEL       : MM channel (for incoming webhook)
 * MMSLACK_PORT     : Listening port (for service)
 
 ## Slack / Mattermost setup
 On both platform, you need to setup outgoing / incoming webhook as followed:
 * Outgoing webhook shall be setup to one specific channel, with no trigger words (so it will listen to all messages). You should setup the outgoing webhook for slack to http://YOUR_SERVER/slack and the outgoing webhook for Mattermost to http://YOUR_SERVER/mm
 * Incoming webhook shall be defined on each platform (for the channel, it shall be setup that the hook can overwrite the channel definition)
 * Channel defined as SLACK_CHANNEL / MM_CHANNEL shall be setup to the same channel outgoing webhook is listening to
 
 ## Notes
 This application is using the node-mattermost and node-slack package allowing easy interfacing with those platforms.
 
 ## License
 Apache 2.0 License
 