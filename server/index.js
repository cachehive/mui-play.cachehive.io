'use strict';
require('dotenv').config();

const compression = require('compression')
const express = require("express");
const bodyParser = require("body-parser");
const sendMailchimp = require('./src/mc');
const path = require('path');

// ********************************************
// *  Server Routings
// ********************************************

var apiRouter = function(app) {

    // Answer API requests.
    app.post("/api", function(req, res) {
        sendMailchimp.sendToMailchimp3( req.body.email_address );
        console.log( "sent address - " + req.body.email_address )
        res.send( 'success - added ${req.body.email`address}');
    });

    // All remaining requests return the React app, so it can handle routing.
    app.get('*', function(req, res) {
        res.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
    });
}

// ********************************************
// *  Server Settup
// ********************************************
var app = express();

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
//    app.use(express.static('client/build'));
    app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

}

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 'extended': true }));

apiRouter(app);

app.set('port', process.env.PORT || 3001);

var server = app.listen( app.get('port'), function () {
    console.log("Listening on port %s...", server.address().port);
});