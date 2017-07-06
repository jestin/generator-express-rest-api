var yeoman = require('yeoman-generator');
var fs = require('fs');

module.exports = yeoman.generators.Base.extend({
	initializingStep: function() {
		this.questions = [];
		this.serviceName = 'clown';
		this.serviceClassName = 'Clown';
		this.serviceInstanceName = 'clown';
		this.serviceRequirePathFromTest = '';
	},

	promptingStep: function() {
		this.questions.push({ type    : 'input',
			name    : 'serviceName',
			message : 'Service Name (dash delimited, leave off -service)',
			default : this.serviceName });

		var done = this.async();

		var generator = this;

		var handleAnswers = function(answers) {
			generator.serviceName = answers.serviceName.toLowerCase();
			generator.serviceClassName = generator._.classify(answers.serviceName);
			generator.serviceInstanceName = generator._.camelize(generator.serviceName);
			generator.serviceRequirePathFromTest =  '../../../app/services/' + generator.serviceName + '-service';

			done();
		};

		this.prompt(this.questions, handleAnswers.bind(this));
	},

	configuringStep: function() {
	},

	defaultStep: function() {
	},

	writingStep: function() {
		copyService(this);
		copyServiceTest(this);
	},

	conflictsStep: function() {
	},

	installStep: function() {
	},

	endStep: function() {
	}
});

function copyService(generator) {
	var serviceDestination = generator.destinationRoot() +
		'/app/services/' +
		generator.serviceName.toLowerCase() +
		'-service.js';

	copyTemplate(generator, 'app/services/_service.js', serviceDestination);
}

function copyServiceTest(generator) {
	var serviceTestDestination = generator.destinationRoot() +
		'/test/spec/services/' +
		generator.serviceName.toLowerCase() +
		'-service.tests.js';

	copyTemplate(generator, 'test/spec/services/_service.tests.js', serviceTestDestination);
}

function copyTemplate(generator, template, path) {
	if(fs.existsSync(path)) {
		console.log('The file "' + path + '" already exists!');
	}
	else {
		generator.template(template, path);
	}
}
