const express = require('express');
var cors = require('cors');
const { serverConfig } = require('./server/config');
const cookieParser = require('cookie-parser');
const createRouter = require('./server/routes/create');
var jwt = require('jsonwebtoken');

let app = express();

app.use(cors());
app.use(cookieParser());

//Exercise 1
app.get('/verifytoken', (req, res) => {
	if (req.headers.authorization) {
		//add Bearer check too
		let accessToken = req.headers.authorization.split(' ')[1];
		jwt.verify(accessToken, 'stackconf', function(err, decoded) {
				if (err) {
					res.send(`Oops, you are NOT authorised to view this page because: ${err.message}`);
				} else {
					res.send('Congrats, you are authorised to view this page.');
				}
		});
	} else {
		res.send('No authorisation header found.');
	}
});

app.get('/', (req, res) => {
	res.send('Running!')
});

app.use('/api', createRouter);

app.listen(serverConfig.port, () => console.log(`Authorisation Server is listening on port ${serverConfig.port}!`));