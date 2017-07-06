var yeoman = require('yeoman-generator');
var fs = require('fs');

const routeConfigRequirePath = '/app/config/route.config.json';
const dependenciesRequirePath = '/app/config/dependencies.json';

module.exports = yeoman.generators.Base.extend({
	initializingStep: function() {
		this.questions = [];
		this.controllerName = 'clowns';
		this.controllerClassName = 'Clowns';
		this.controllerInstanceName = 'clowns';
		this.controllerVersion = 'v1';
		this.controllerRequirePathFromTest = '';
		this.controllerRoute = '/clowns/:clownid';
		this.controllerMethod = 'GET';
		this.httpMethods = [ 'GET', 'PUT', 'POST', 'DELETE' ];
	},

	promptingStep: function() {
		this.questions.push({ type    : 'input',
			name    : 'controllerName',
			message : 'Controller Name (dash delimited, leave off -controller)',
			default : this.controllerName });

		this.questions.push({ type    : 'input',
			name    : 'controllerVersion',
			message : 'Controller Version',
			default :  this.controllerVersion });

		this.questions.push({ type    : 'input',
			name    : 'controllerRoute',
			message : 'Controller Route (HTTP request route without the version)',
			default :  this.controllerRoute });

		this.questions.push({ type    : 'list',
			name    : 'controllerMethod',
			message : 'Controller Method',
			choices : this.httpMethods,
			default : 0 });

		var done = this.async();

		var generator = this;

		var handleAnswers = function(answers) {
			generator.controllerName = answers.controllerName.toLowerCase();
			generator.controllerClassName = generator._.classify(answers.controllerName);
			generator.controllerInstanceName = generator._.camelize(generator.controllerName);
			generator.controllerVersion = answers.controllerVersion;
			generator.controllerRequirePathFromTest =  '../../../../app/controllers/' + generator.controllerVersion + '/' + generator.controllerName + "-controller";
			generator.controllerRoute = answers.controllerRoute.toLowerCase();
			generator.controllerMethod = answers.controllerMethod;

			done();
		};

		this.prompt(this.questions, handleAnswers.bind(this));
	},

	configuringStep: function() {
	},

	defaultStep: function() {
	},

	writingStep: function() {
		if(tryUpdateRouteConfig(this) && tryUpdateDependencies(this)) {
			copyController(this);
			copyControllerTest(this);
		}
	},

	conflictsStep: function() {
	},

	installStep: function() {
	},

	endStep: function() {
	}
});

function copyController(generator) {
	var controllerDestination = generator.destinationRoot() +
		'/app/controllers/' +
		generator.controllerVersion +
		'/' +
		generator.controllerName.toLowerCase() +
		'-controller.js';

	copyTemplate(generator, 'app/controllers/_controller.js', controllerDestination);
}

function copyControllerTest(generator) {
	var controllerTestDestination = generator.destinationRoot() +
		'/test/spec/controllers/' +
		generator.controllerVersion +
		'/' +
		generator.controllerName.toLowerCase() +
		'-controller.tests.js';

	copyTemplate(generator, 'test/spec/controllers/_controller.tests.js', controllerTestDestination);
}

function tryUpdateRouteConfig(generator) {
	var success = false;

	var routeConfigPath = generator.destinationRoot() + routeConfigRequirePath;

	try {
		var routeConfig = require(routeConfigPath);

		if (routeConfig && routeConfig.routes) {
			var controllerRoute = '/' + generator.controllerVersion + generator.controllerRoute;

			if(doesRouteExistInConfig(routeConfig, controllerRoute)) {
				console.log('Route already exists in route.config.json. Route: ' + controllerRoute);
				console.log('If you want to add a new http method to an existing controller you must modify ' + routeConfigRequirePath + ' and add the method to the controller.');
			}
			else {
				writeToRouteConfig(generator, routeConfig, routeConfigPath, controllerRoute);
				success = true;
			}
		}
		else {
			console.log('Badly formatted route config "' + routeConfigPath + '", routes array is not defined');
		}
	}
	catch (e) {
		var message = 'Error parsing and updating route config "' + routeConfigPath + '":' + e;
		console.log(message);
	}

	return success;
}

function tryUpdateDependencies(generator) {
	var success = false;
	var dependenciesPath = generator.destinationRoot() + dependenciesRequirePath;

	try{
		var dependenciesConfig = require(dependenciesPath);

		if (dependenciesConfig && dependenciesConfig.dependencies) {
			var dependencyName = generator.controllerName + "Controller";

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

function doesRouteExistInConfig(routeConfig, controllerRoute) {
	var i, routesLength;

	for(i = 0, routesLength = routeConfig.routes.length; i < routesLength; i++) {
		var routeItem = routeConfig.routes[i];
		if(routeItem.route === controllerRoute) {
			return true;
		}
	}

	return false;
}

function writeToRouteConfig(generator, routeConfig, routeConfigPath, controllerRoute) {
	routeConfig.routes.push({ route: controllerRoute,
		method: generator.controllerMethod,
		controller: generator.controllerName + 'Controller' });

	fs.writeFileSync(routeConfigPath, JSON.stringify(routeConfig, null, 2));
}

function writeToDependenciesConfig(generator, dependenciesConfig, dependenciesPath, dependencyName) {
	dependenciesConfig.dependencies[dependencyName] = {
		concrete: getControllerRequirePath(generator)
	};

	fs.writeFileSync(dependenciesPath, JSON.stringify(dependenciesConfig, null, 2));
}

function getControllerRequirePath(generator) {
	return '../controllers/' +
		generator.controllerVersion +
		'/' +
		generator.controllerName.toLowerCase() +
		'-controller';
}

function copyTemplate(generator, template, path) {
	if(fs.existsSync(path)) {
		console.log('The file "' + path + '" already exists!');
	}
	else {
		generator.template(template, path);
	}
}
