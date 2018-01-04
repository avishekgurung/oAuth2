/**
 * Created by avishek on 1/3/18.
 */

var express = require("express");
var request = require('request');
var bodyParser = require("body-parser");
var PORT = 3000;

//constants
var CLIENT_ID = "1066817426142-41pk11rn01ed3tnaofsriq74pkfciqdc.apps.googleusercontent.com";
var CLIENT_SECRET = "P6wibjFMFmyNDm-Dco4wgysu";
var REDIRECT_URI = "http://localhost:3000/oauth2callback";
var ACCESS_KEY_END_POINT = "https://www.googleapis.com/oauth2/v4/token";
var CONSENT_PAGE_END_POINT = "https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id="+CLIENT_ID+"&redirect_uri="+REDIRECT_URI+"&scope=https://www.googleapis.com/auth/userinfo.email"
console.log(CONSENT_PAGE_END_POINT);


var app = express();
var http = require('http').Server(app);

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/pages'));

//contains access_token, token_type, expires_in information.
var accessInfo = {};

// Routes
app.get('/login', function(req, res) {
    res.sendfile(__dirname + '/pages/login.html');
})

app.get('/home', function(req, res) {
    res.sendfile(__dirname + '/pages/home.html');
})

app.get('/details', function(req, res) {

});

app.get('/oauth2callback', function(req, res) {
    var authorizationCode = req.query.code;

    var data = {
        code : authorizationCode,
        client_id : CLIENT_ID,
        client_secret : CLIENT_SECRET,
        redirect_uri : REDIRECT_URI,
        grant_type: 'authorization_code'
    };

    var options = {
        url : ACCESS_KEY_END_POINT,
        method : 'POST',
        form : data
    }

    request.post(options, function(err, res, body) {
        if(!err) {
            accessInfo = JSON.parse(body);
            request.get({url:"https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token="+accessInfo.access_token}, function (err, res, body) {
                console.log(body)
            })
        }
    })

    res.end();
});


http.listen(PORT, function(err) {
    if(err) {
        console.log('Error in running server');
        console.log(err.message);
    }
    else {
        console.log('Server running @ ' + PORT);
    }
});