const serverConfig = {
	port: 9000,
	serverStartTime: new Date().toLocaleString("en-GB", { timeZone: "Asia/Singapore" })
};

const secrets = {
	jwtSecret: 'stackconf2018'
}

module.exports.serverConfig = serverConfig;
module.exports.secrets = secrets;
