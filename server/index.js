'use strict';
require('dotenv').config();

var compression = require('compression')
var express = require("express");
var bodyParser = require("body-parser");
var sendMailchimp = require('./src/mc');

// ********************************************
// *  Server Routings
// ********************************************

var apiRouter = function(app) {

    app.get("/", function(req, res) {
        res.sendFile( 'index.html', {root: './public' } );
    });

    // Always return the main index.html on routes that should return a "page" (e.g. /contact),
    // so react-router will render the route in the client
    //app.get('*/:page', (req, res) => {
    //    res.sendFile(path.resolve(staticAssets, 'index.html'));
    //});

    app.post("/api", function(req, res) {
        sendMailchimp.sendToMailchimp3( req.body.email_address );
        console.log( "sent address - " + req.body.email_address )
        res.send( 'success');
    });

    app.use(function(req, res) {
        res.status(404).send('Sorry cant find that!');
    });
}

// ********************************************
// *  Server Setup
// ********************************************
var app = express();

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
}

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 'extended': true }));

apiRouter(app);

app.set('port', process.env.PORT || 3001);

var server = app.listen( app.get('port'), function () {
    console.log("Listening on port %s...", server.address().port);
});