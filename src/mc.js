const axios = require('axios')

exports.sendToMailchimp = function (email) {
    let mailchimpInstance   = 'us15' /*process.env.MC_DATA_CENTER*/,
        listUniqueId        = 'c877def6a3' /*process.env.MC_LIST_ID*/,
        mailchimpApiKey     = '620ce86925df3426ec27d1bc41e856a7-us15' /*process.env.MC_API_KEY*/;

    axios.post('https://' + mailchimpInstance + '.api.mailchimp.com/3.0/lists/' + listUniqueId + '/members/', {
        auth: 'api_key: ' + mailchimpApiKey,
        header: 'content-type: application/json',
        mode: 'no-cors',
        data: {
            "email_address": email,
            "status": "subscribed"
        }
    })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
}

exports.sendToMailchimp2 = function (email) {
    var mailchimpInstance   = process.env.MC_DATA_CENTER,
        listUniqueId        = process.env.MC_LIST_ID,
        mailchimpApiKey     = process.env.MC_API_KEY;

    axios.post('https://' + mailchimpInstance + '.api.mailchimp.com/3.0/lists/' + listUniqueId + '/members/', {
        headers:
            {
                'cache-control': 'no-cache',
                authorization: mailchimpApiKey,
                'content-type': 'application/json' },
        body: { email_address: email, status: 'subscribed' },
        json: true })``
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
}


exports.sendToMailchimp3 = function (email) {
    var request = require("request");
    var mailchimpInstance   = process.env.MC_DATA_CENTER,
        listUniqueId        = process.env.MC_LIST_ID,
        mailchimpApiKey     = process.env.MC_API_KEY,
        basicAuthKey        = process.env.MC_BASIC_AUTH;


    var options = {
            method: 'POST',
            url: 'https://' + mailchimpInstance + '.api.mailchimp.com/3.0/lists/' + listUniqueId + '/members/',
            headers: {
                'cache-control': 'no-cache',
                authorization: 'Basic " + basicAuthKey,
                'content-type': 'application/json'
            },
            body: {email_address: email, status: 'subscribed'},
            json: true
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);

            console.log(body);
        });

}