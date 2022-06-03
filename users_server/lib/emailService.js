const path = require('path');
const juice = require('juice');


const pug = require('pug');
const nodemailer = require('nodemailer');
const htmlToText = require('nodemailer-html-to-text').htmlToText;
const SMTPTransport = require('nodemailer-smtp-transport');


const tranportEngine = new SMTPTransport({
	host: 'smtp.gmail.com',
	port: 465,
	secure: true,
	auth: {
		user: '',
		pass: ''
	}
})


const transport = nodemailer.createTransport(tranportEngine);

transport.use('compile', htmlToText());

module.exports = async function(options) {
	const html = pug.renderFile(
		path.join(__dirname, '../templates', options.template) + '.pug',
		options.locals || {}
	)

	const message = {
		html: juice(html),
		to: {
			address: options.to
		},
		subject: {
			subject: options.subject
		}
	}

	return await transport.sendMail(message);
}