const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const tokenConfig = require('./config');
const uuidv4 = require('uuid/v4');
const uuidv1 = require('uuid/v1');
const crypto = require('crypto');
const utils = require('./utils');

let app = express();

app.use(cookieParser());
app.use(bodyParser());

app.get('/', function (req, res) {
    res.send('Hello ladies and gentlemen, welcome to a mock up of this cool token playground');
});

app.get('/uponlogin', function (req, res) {
    generateMobileAccessToken(1).then((tokens) => {
        res.json(tokens);
    })
});

function generateMobileRefreshToken(uuid, cryptoModule) {
    if (!cryptoModule) {
        cryptoModule = crypto;
    }
    let hash = cryptoModule.createHmac(tokenConfig.refreshTokenHashAlgorithm, tokenConfig.refreshTokenHashKey)
    hash.update(uuid);
    return hash.digest('hex');
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
    return new Promise((resolve, reject) => {
        jwt.sign(newAccessToken.payload, newAccessToken.digitalSigningSecret, newAccessToken.options, (err, accessToken) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            let refreshToken;
            try {
                refreshToken = generateMobileRefreshToken(uuidv4(), crypto);
            } catch (err) {
                console.log(err);
                reject(err);
            }
    
            const accessTokenExpiry = utils.generateNewDatePlusUTCMinutesFromNow(tokenConfig.mobileToken.accessTokenExpiresInMins);
            const refreshTokenExpiry = utils.generateNewDatePlusUTCMinutesFromNow(tokenConfig.mobileToken.refreshTokenExpiresInMins);
            const newTokenRecord = {
                tokenId: newAccessToken.options.jwtid,
                accessToken,
                accessTokenExpiry,
                refreshToken,
                refreshTokenExpiry,
                userId,
                isRevoked: false
            }; 
    
            console.log(newTokenRecord);
            resolve(newTokenRecord);
        });
    });
}

app.post('/verify', function (req, res) {
    if (utils.checkIsBeforeCurrentDate(req.body.refreshTokenExpiry)) {
        res.send('Your refresh token has expired! Direct to login page');
    } else {
        if (utils.checkIsBeforeCurrentDate(req.body.accessTokenExpiry)) {
            generateMobileAccessToken(1).then((accessTokens) => {
                res.json(accessTokens);
            });
        } else {
            jwt.verify(req.body.accessToken, tokenConfig.digitalSigningSecret, function(err, decoded) {
                if (err) {
                    res.send('None of your tokens have expired but your JWT signature is invalid.');
                } else {
                    res.send('Congrats none of your tokens have expired and your JWT signature matches.');
                }
            });
            
        }
    }
});

app.listen(8081, function () {    
    console.log("Example app listening at 8081");
});