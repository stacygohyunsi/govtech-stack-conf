const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const tokenConfig = require('./config');
const uuidv4 = require('uuid/v4');
const uuidv1 = require('uuid/v1');
const crypto = require('crypto');
const moment = require('moment');
const bodyParser = require('body-parser');

let app = express();

app.use(cookieParser());
app.use(bodyParser());

app.get('/', function (req, res) {
    res.send('Hello World');
});

app.get('/sign', function (req, res) {
    generateMobileAccessToken(1);
    res.send('Hello World');
});

function checkIsBeforeCurrentDate(dateValue) {
    let dateToCheck = moment(dateValue).format('YYYY-MM-DD HH:mm');
    let todaysDate = moment().format('YYYY-MM-DD HH:mm');
    return (moment(dateToCheck).isBefore(todaysDate, 'second'));
}

function generateMobileRefreshToken(uuid, cryptoModule) {
    if (!cryptoModule) {
        cryptoModule = crypto;
    }
    let hash = cryptoModule.createHmac(tokenConfig.refreshTokenHashAlgorithm, tokenConfig.refreshTokenHashKey)
    hash.update(uuid);
    return hash.digest('hex');
}

function generateNewDatePlusUTCMinutesFromNow(minutesToAdd) {
    let current = new Date();
    current.setMinutes(current.getMinutes() + minutesToAdd);
    return current;
}

function generateMobileAccessToken(userId) {
    const newAccessToken = {
        payload: {
            iss: tokenConfig.iss,
            parent: 'parent1'
        },
        digitalSigningSecret: tokenConfig.digitalSigningSecret,
        options: {
            jwtid: uuidv1(),
            algorithm: tokenConfig.algorithm,
            expiresIn: (tokenConfig.mobileToken.accessTokenExpiresInMins * 60)
        }
    };

    console.log(newAccessToken);

    jwt.sign(newAccessToken.payload, newAccessToken.digitalSigningSecret, newAccessToken.options, (err, accessToken) => {
        if (err) {
            console.log(err);
        }
        console.log(accessToken);
        let refreshToken;
        try {
            refreshToken = generateMobileRefreshToken(uuidv4(), crypto);
        } catch (err) {
            console.log(err);
        }
        console.log(refreshToken);
        const accessTokenExpiry = generateNewDatePlusUTCMinutesFromNow(tokenConfig.mobileToken.accessTokenExpiresInMins);
        const refreshTokenExpiry = generateNewDatePlusUTCMinutesFromNow(tokenConfig.mobileToken.refreshTokenExpiresInMins);
        const newTokenRecord = {
            tokenId: newAccessToken.options.jwtid,
            accessTokenType: 'mobile',
            accessToken,
            accessTokenExpiry,
            refreshToken,
            refreshTokenExpiry,
            userId,
            isRevoked: false
        }; 

        console.log(newTokenRecord);
    });
}

app.post('/verify', function (req, res) {
    // console.log(req.cookies.jwt);
    console.log(req.body);
    if (checkIsBeforeCurrentDate(req.body.refreshTokenExpiry)) {
        console.log('direct to login page');
    } else {
        console.log(checkIsBeforeCurrentDate(req.body.accessTokenExpiry));
        if (checkIsBeforeCurrentDate(req.body.accessTokenExpiry)) {
            generateMobileAccessToken(1);
        } else {
            console.log('congrats you may proceed');
        }
    }
    res.send('Hello World');
});
 
 app.listen(8081, function () {    
    console.log("Example app listening at 8081");
});