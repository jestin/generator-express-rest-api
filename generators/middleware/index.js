var yeoman = require('yeoman-generator');
var fs = require('fs');

const dependenciesRequirePath = '/app/config/dependencies.json';

module.exports = yeoman.generators.Base.extend({
	initializingStep: function() {
		this.questions = [];
		this.middlewareName = 'clown';
		this.middlewareRequirePathFromTest = '';
	},

	promptingStep: function() {
		this.questions.push({ type    : 'input',
			name    : 'middlewareName',
			message : 'Middleware Name',
			default : this.middlewareName });

		var done = this.async();

		var generator = this;

		var handleAnswers = function(answers) {
			generator.middlewareName = answers.middlewareName.toLowerCase();
			generator.middlewareRequirePathFromTest =  '../../../app/middleware/' + generator.middlewareName;

			done();
		};

		this.prompt(this.questions, handleAnswers.bind(this));
	},

	configuringStep: function() {
	},

	defaultStep: function() {
	},

	writingStep: function() {
		if(tryUpdateDependencies(this)) {
			copyMiddleware(this);
			copyMiddlewareTest(this);
		}
	},

	conflictsStep: function() {
	},

	installStep: function() {
	},

	endStep: function() {
	}
});

function copyMiddleware(generator) {
	var middlewareDestination = generator.destinationRoot() +
		'/app/middleware/' +
		generator.middlewareName.toLowerCase() + '.js';

	copyTemplate(generator, 'app/middleware/_middleware.js', middlewareDestination);
}

function copyMiddlewareTest(generator) {
	var middlewareTestDestination = generator.destinationRoot() +
		'/test/spec/middlware/' +
		generator.middlewareName.toLowerCase() +
		'-middleware.tests.js';

	copyTemplate(generator, 'test/spec/middleware/_middleware.tests.js', middlewareTestDestination);
}

function copyTemplate(generator, template, path) {
	if(fs.existsSync(path)) {
		console.log('The file "' + path + '" already exists!');
	}
	else {
		generator.template(template, path);
	}
}

function tryUpdateDependencies(generator) {
	var success = false;
	var dependenciesPath = generator.destinationRoot() + dependenciesRequirePath;

	try{
		var dependenciesConfig = require(dependenciesPath);

		if (dependenciesConfig && dependenciesConfig.dependencies) {
			var dependencyName = generator.middlewareName;

			if (dependenciesConfig.dependencies[dependencyName]) {
				console.log('dependency already exists in dependencies.json. Dependency: ' + dependencyName);
			}
			else {
				writeToDependenciesConfig(generator, dependenciesConfig, dependenciesPath, dependencyName);
				success = true;
			}
		}
		else {
			console.log('Badly formatted dependencies config "' + dependenciesPath + '", dependencies array is not defined');
		}
	}
	catch (e) {
		var message = 'Error parsing and updating dependencies config "' + dependenciesPath + '":' + e;
		console.log(message);
	}

	return success;
}

function writeToDependenciesConfig(generator, dependenciesConfig, dependenciesPath, dependencyName) {
	dependenciesConfig.dependencies[dependencyName] = {
		concrete: getMiddlewareRequirePath(generator)
	};

	fs.writeFileSync(dependenciesPath, JSON.stringify(dependenciesConfig, null, 2));
}

function getMiddlewareRequirePath(generator) {
	return '../middleware/' +
		generator.middlewareName.toLowerCase();
}

