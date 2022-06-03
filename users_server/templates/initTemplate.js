const pug = require('pug');


console.log(pug.renderFile(__dirname + '/mail.pug', {
	name: "Nikita",
	count: "Count",
	trueTitle: "True title",
	falseTitle: "False title",
	condition: true
}));