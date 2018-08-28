var nodemailer = require('nodemailer');
var logger = require('./logger.js');
var env = require('node-env-file');
env(__dirname + '/.env');
var logger = require('./logger.js');

var mailOptions = {
	from: process.env.FROM_EMAIL,
	to: process.env.TO_EMAILS,
	subject: "Update"
}

var obj = {};

obj.sendEmail = function (data) {
	var transporter = nodemailer.createTransport({
		service: 'gmail',
		pool: true,
		host: 'smtp.gmail.com',
		port: 465,
		secure: true,
		auth: {
			user: process.env.BOTEMAIL,
			pass: process.env.PASS
		},
		tls: {
			rejectUnauthorized: false
		}
	});

	mailOptions.html = data;
	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			return logger.error(error);
		}
		logger.info("message %s sent: %s", info.messageId, info.response);
		transporter.close();
		transporter = null;
	});
}

module.exports = obj;
