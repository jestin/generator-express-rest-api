var yeoman = require('yeoman-generator');
var fs = require('fs');

const dependenciesRequirePath = '/app/config/dependencies.json';

module.exports = yeoman.generators.Base.extend({
	initializingStep: function() {
		this.questions = [];
		this.modelName = 'clown';
		this.modelClassName = 'Clown';
		this.modelInstanceName = 'clown';
		this.modelRequirePathFromTest = '';
	},

	promptingStep: function() {
		this.questions.push({ type    : 'input',
			name    : 'modelName',
			message : 'Model Name',
			default : this.modelName });

		var done = this.async();

		var generator = this;

		var handleAnswers = function(answers) {
			generator.modelName = answers.modelName.toLowerCase();
			generator.modelClassName = generator._.classify(answers.modelName);
			generator.modelInstanceName = generator._.camelize(generator.modelName);
			generator.modelRequirePathFromTest =  '../../../app/models/' + generator.modelName;

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
			copyModel(this);
		}
	},

	conflictsStep: function() {
	},

	installStep: function() {
	},

	endStep: function() {
	}
});

function copyModel(generator) {
	var modelDestination = generator.destinationRoot() +
		'/app/models/' +
		generator.modelName.toLowerCase() + '.js';

	copyTemplate(generator, 'app/models/_model.js', modelDestination);
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
			var dependencyName = generator.modelName;

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
		concrete: getModelRequirePath(generator)
	};

	fs.writeFileSync(dependenciesPath, JSON.stringify(dependenciesConfig, null, 2));
}

function getModelRequirePath(generator) {
	return '../models/' +
		generator.modelName.toLowerCase();
}

